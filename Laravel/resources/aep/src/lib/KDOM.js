(() => {
    // src/core/error.js
    var KDOMError = class extends Error {
    };

    // src/core/vnode.js
    var VNode = class _VNode {
        constructor(kind, tag = null, props = {}, children = [], text = null) {
            this.kind = kind;
            this.tag = tag;
            this.props = props || {};
            this.children = children || [];
            this.text = text;
            this.dom = null;
            this.endDom = null;
            this.instance = null;
            this.namespace = null;
        }
        // ── Static factories ──────────────────────────────────────────────────────
        static text(value) {
            return new _VNode("text", null, {}, [], String(value));
        }
        static element(tag, props = {}, children = []) {
            const { children: _c, ...rest } = props || {};
            return new _VNode("element", tag, rest, children);
        }
        static component(tag, props = {}) {
            const { children: _c, ...rest } = props || {};
            return new _VNode("component", tag, rest, []);
        }
        static fragment(children = []) {
            return new _VNode("fragment", null, {}, children);
        }
        // Coerce any value a component might return into a VNode.
        // Returns null for values that produce no DOM (null / undefined / boolean).
        static from(value) {
            if (value instanceof _VNode) return value;
            if (value === null || value === void 0 || value === false || value === true) return null;
            if (Array.isArray(value)) return _VNode.fragment(value.map(_VNode.from).filter(Boolean));
            if (typeof value === "function") return _VNode.component(value);
            if (typeof value === "string" || typeof value === "number") return _VNode.text(value);
            if (value && typeof value === "object" && "tag" in value) {
                const tag = value.tag;
                const children = value.children ?? [];
                if (typeof tag === "function") {
                    const { children: _c2, tag: _t2, ...props2 } = value;
                    return new _VNode("component", tag, props2, []);
                }
                if (tag === null) return _VNode.fragment(children);
                const { children: _c, tag: _t, ...props } = value;
                return new _VNode("element", tag, props, children);
            }
            return _VNode.text(String(value));
        }
        static removeFromParent(target) {
            if (target?.parentNode) target.parentNode.removeChild(target);
        }
        // ── Type guards ───────────────────────────────────────────────────────────
        get isText() {
            return this.kind === "text";
        }
        get isElement() {
            return this.kind === "element";
        }
        get isComponent() {
            return this.kind === "component";
        }
        get isFragment() {
            return this.kind === "fragment";
        }
    };

    // src/core/instance.js
    var ComponentInstance = class {
        constructor({ renderer, component, props, parent, parentInstance, namespace, start, end }) {
            this.renderer = renderer;
            this.component = component;
            this.props = props;
            this.parent = parent;
            this.parentInstance = parentInstance;
            this.namespace = namespace;
            this.start = start;
            this.end = end;
            this.hooks = [];
            this.hookIndex = 0;
            this.tree = [];
            this.updateScheduled = false;
            this.isMounted = false;
        }
    };

    // src/css/builder.js
    var CSSBuilder = class _CSSBuilder {
        constructor(styleId = "kdom-atomic-css", variants = {}) {
            this.styleId = styleId;
            this.cache = /* @__PURE__ */ new Map();
            this.counter = 0;
            this.styleEl = null;
            this.variants = {
                hover: "&:hover",
                focus: "&:focus",
                focusVisible: "&:focus-visible",
                active: "&:active",
                disabled: "&:disabled",
                visited: "&:visited",
                checked: "&:checked",
                ...variants
            };
        }
        // ── Static helpers ────────────────────────────────────────────────────────
        static kebabCase(name) {
            if (name.startsWith("--")) return name;
            return name.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
        }
        static isUnitless(prop) {
            return _CSSBuilder.UNITLESS.has(prop);
        }
        // Normalise a JS style value to a CSS string.
        //   "$token.path" → "var(--k-token-path)"   (design token)
        //   42 on a dimensional prop → "42px"        (auto px)
        //   anything else → String(value)
        static normalizeValue(prop, value) {
            if (value === null || value === void 0 || value === false) return "";
            if (typeof value === "string" && value.startsWith("$")) {
                const varName = value.slice(1).replace(/\./g, "-");
                return `var(--k-${varName})`;
            }
            if (typeof value === "number" && !_CSSBuilder.isUnitless(prop))
                return `${value}px`;
            return String(value).trim();
        }
        // ── Style element management ──────────────────────────────────────────────
        ensureStyleElement() {
            if (this.styleEl) return this.styleEl;
            let el = document.getElementById(this.styleId);
            if (!el) {
                el = document.createElement("style");
                el.id = this.styleId;
                (document.head || document.documentElement).appendChild(el);
            }
            this.styleEl = el;
            return el;
        }
        // Insert a rule via CSSOM for performance; fall back to text append if the
        // sheet isn't available yet (e.g. during SSR or before document is ready).
        emitRule(rule) {
            const el = this.ensureStyleElement();
            const sheet = el.sheet;
            if (sheet) {
                try {
                    sheet.insertRule(rule, sheet.cssRules.length);
                    return;
                } catch {
                }
            }
            el.appendChild(document.createTextNode(rule));
        }
        nextClassName() {
            return `k${(this.counter++).toString(36)}`;
        }
        // ── Variant selector resolution ───────────────────────────────────────────
        resolveVariantSelector(key, baseSelector = "&") {
            const parts = String(key).split("+").map((s) => s.trim()).filter(Boolean);
            let selector = baseSelector;
            for (const part of parts) {
                if (part.startsWith("&")) {
                    selector = part.replaceAll("&", selector);
                    continue;
                }
                if (part === "dark") {
                    selector = `.dark ${selector}`;
                    continue;
                }
                if (part === "hover") {
                    selector = `${selector}:hover`;
                    continue;
                }
                if (part === "focus") {
                    selector = `${selector}:focus`;
                    continue;
                }
                const mapped = this.variants[part];
                if (mapped) {
                    selector = mapped.replaceAll("&", selector);
                    continue;
                }
                return null;
            }
            return selector;
        }
        // ── Build API ─────────────────────────────────────────────────────────────
        // Public — accepts a style object and returns a space-separated class string.
        // Called by System.setProp() when style={...} is encountered on an element.
        build(styleObj = {}) {
            if (!styleObj || typeof styleObj !== "object") return "";
            const classes = [];
            for (const [key, rawValue] of Object.entries(styleObj)) {
                if (rawValue === null || rawValue === void 0 || rawValue === false) continue;
                if (typeof rawValue === "object" && !Array.isArray(rawValue)) {
                    const variantSelector = this.resolveVariantSelector(key, "&");
                    if (!variantSelector) continue;
                    for (const [nestedKey, nestedValue] of Object.entries(rawValue)) {
                        if (nestedValue === null || nestedValue === void 0 || nestedValue === false) continue;
                        const prop2 = _CSSBuilder.kebabCase(nestedKey);
                        const value2 = _CSSBuilder.normalizeValue(prop2, nestedValue);
                        if (!value2) continue;
                        const cacheKey2 = `${variantSelector}|${prop2}:${value2}`;
                        if (!this.cache.has(cacheKey2)) {
                            const className = this.nextClassName();
                            this.cache.set(cacheKey2, className);
                            const selector = variantSelector.replaceAll("&", `.${className}`);
                            this.emitRule(`${selector}{${prop2}:${value2};}`);
                        }
                        classes.push(this.cache.get(cacheKey2));
                    }
                    continue;
                }
                const prop = _CSSBuilder.kebabCase(key);
                const value = _CSSBuilder.normalizeValue(prop, rawValue);
                if (!value) continue;
                const cacheKey = `base|${prop}:${value}`;
                if (!this.cache.has(cacheKey)) {
                    const className = this.nextClassName();
                    this.cache.set(cacheKey, className);
                    this.emitRule(`.${className}{${prop}:${value};}`);
                }
                classes.push(this.cache.get(cacheKey));
            }
            return classes.join(" ");
        }
        // Flush CSSOM rules back into the element's textContent.
        // Called after mountComponent so that any server-injected content
        // stays consistent with what the CSSOM currently holds.
        syncRulesToDom() {
            const el = this.ensureStyleElement();
            const rules = Array.from(el.sheet.cssRules).map((r) => r.cssText).join("\n");
            el.textContent = `
${rules}
`;
        }
    };
    CSSBuilder.UNITLESS = /* @__PURE__ */ new Set([
        "animation-iteration-count",
        "border-image-outset",
        "border-image-slice",
        "border-image-width",
        "box-flex",
        "box-flex-group",
        "column-count",
        "columns",
        "flex",
        "flex-grow",
        "flex-shrink",
        "font-weight",
        "grid-area",
        "grid-column",
        "grid-column-end",
        "grid-column-start",
        "grid-row",
        "grid-row-end",
        "grid-row-start",
        "line-clamp",
        "line-height",
        "opacity",
        "order",
        "orphans",
        "scale",
        "tab-size",
        "widows",
        "z-index",
        "zoom"
    ]);

    // src/css/theme.js
    var ThemeManager = class {
        constructor(styleId = "kdom-theme") {
            this.styleId = styleId;
            this.styleEl = null;
            this.spec = {};
            this.listeners = /* @__PURE__ */ new Set();
        }
        ensureStyleElement() {
            if (this.styleEl) return this.styleEl;
            let el = document.getElementById(this.styleId);
            if (!el) {
                el = document.createElement("style");
                el.id = this.styleId;
                const atomicEl = document.getElementById("kdom-atomic-css");
                const head = document.head || document.documentElement;
                if (atomicEl) head.insertBefore(el, atomicEl);
                else head.appendChild(el);
            }
            this.styleEl = el;
            return el;
        }
        // Recursively flatten a nested token object into [key, value] pairs.
        // { colors: { primary: "#f00" } } → [["colors-primary", "#f00"]]
        flatten(obj, prefix = "") {
            const entries = [];
            for (const [key, value] of Object.entries(obj)) {
                const segment = prefix ? `${prefix}-${key}` : key;
                if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                    entries.push(...this.flatten(value, segment));
                } else {
                    entries.push([segment, value]);
                }
            }
            return entries;
        }
        buildBlock(selector, tokens) {
            const decls = tokens.map(([k, v]) => `  --k-${k}: ${v};`).join("\n");
            return `${selector} {
${decls}
}`;
        }
        // set(spec) accepts two shapes:
        //
        //   Split (light + dark):
        //     { light: { colors: {...}, spacing: {...} }, dark: { colors: {...} } }
        //
        //   Flat (light-only):
        //     { colors: {...}, spacing: {...} }
        set(spec) {
            this.spec = spec || {};
            const hasLight = "light" in this.spec;
            const lightTokens = hasLight ? this.spec.light || {} : this.spec;
            const darkTokens = hasLight ? this.spec.dark || {} : null;
            const blocks = [this.buildBlock(":root", this.flatten(lightTokens))];
            if (darkTokens && Object.keys(darkTokens).length > 0)
                blocks.push(this.buildBlock(".dark", this.flatten(darkTokens)));
            this.ensureStyleElement().textContent = blocks.join("\n\n");
            this.notify();
        }
        // Returns the raw spec last passed to set().
        get() {
            return this.spec;
        }
        // Subscribe to theme changes. Returns an unsubscribe function.
        // Used by System.useTheme() to trigger re-renders on theme change.
        subscribe(fn) {
            this.listeners.add(fn);
            return () => this.listeners.delete(fn);
        }
        notify() {
            for (const fn of this.listeners) fn();
        }
    };

    // src/core/renderer.js
    var Renderer = class {
        constructor() {
            this.SVG_NS = "http://www.w3.org/2000/svg";
            this.SVG_TAGS = /* @__PURE__ */ new Set([
                "svg",
                "g",
                "path",
                "circle",
                "rect",
                "defs",
                "mask",
                "clipPath",
                "linearGradient",
                "radialGradient",
                "stop",
                "title",
                "desc",
                "pattern",
                "use",
                "symbol",
                "text",
                "tspan",
                "line",
                "polyline",
                "polygon",
                "ellipse"
            ]);
            this.currentInstance = null;
            this.effectQueue = [];
            this.effectFlushPending = false;
            this.addComments = false;
            this.rootVNode = null;
            this.rootContainer = null;
            this.components = {};
            this.css = new CSSBuilder();
            this.theme = new ThemeManager();
        }
        // ── DOM helpers ───────────────────────────────────────────────────────────
        // className and style-generated classes are tracked separately on the element
        // so they can update independently without overwriting each other.
        syncClassAttribute(el) {
            const className = [el.__kdomClassName, el.__kdomStyleClasses].filter(Boolean).join(" ").trim();
            if (className) el.setAttribute("class", className);
            else el.removeAttribute("class");
        }
        isSpecialProp(key) {
            return key === "children" || key === "tag" || key === "key" || key.startsWith("__");
        }
        isSvg(value) {
            const v = value?.toLowerCase();
            return this.SVG_TAGS.has(v) || v === this.SVG_NS;
        }
        isObject(value) {
            return value !== null && typeof value === "object";
        }
        isFunction(value) {
            return typeof value === "function";
        }
        createBoundaryComment(label) {
            return this.addComments ? document.createComment(label) : document.createTextNode("");
        }
        getNamespace(parentNamespace, tag) {
            return parentNamespace === "svg" || this.isSvg(tag) ? "svg" : null;
        }
        createElement(tag, namespace) {
            if (this.getNamespace(namespace, tag) === "svg")
                return document.createElementNS(this.SVG_NS, tag);
            return document.createElement(tag);
        }
        // ── Props ─────────────────────────────────────────────────────────────────
        setProp(el, key, value, prevValue) {
            if (this.isSpecialProp(key)) return;
            if(key === "ref") {
                if(typeof value === "function")
                    value(el);
                else if(value && typeof value === "object")
                    value.current = el;
                return;
            }
            if (key === "className" || key === "class") {
                el.__kdomClassName = value === null || value === void 0 || value === false ? "" : String(value);
                this.syncClassAttribute(el);
                return;
            }
            if (key === "style") {
                if (this.isObject(value)) {
                    el.removeAttribute("style");
                    el.__kdomStyleClasses = this.css.build(value);
                    this.syncClassAttribute(el);
                } else if (typeof value === "string") {
                    el.__kdomStyleClasses = "";
                    el.setAttribute("style", value);
                    this.syncClassAttribute(el);
                } else {
                    el.__kdomStyleClasses = "";
                    el.removeAttribute("style");
                    this.syncClassAttribute(el);
                }
                return;
            }
            if (key.startsWith("on") && this.isFunction(value)) {
                const eventName = key.slice(2).toLowerCase();
                if (prevValue) el.removeEventListener(eventName, prevValue);
                el.addEventListener(eventName, value);
                return;
            }
            if (value === null || value === void 0 || value === false) {
                el.removeAttribute(key);
                return;
            }
            if (key in el && typeof value !== "object" && !this.isSvg(el.tagName)) {
                try {
                    el[key] = value;
                    return;
                } catch {
                }
            }
            el.setAttribute(key, String(value));
        }
        updateProps(el, nextProps, prevProps = {}) {
            const next = nextProps || {};
            const prev = prevProps || {};
            for (const key of Object.keys(prev)) {
                if (this.isSpecialProp(key)) continue;
                if (key in next) continue;
                if (key.startsWith("on") && this.isFunction(prev[key])) {
                    el.removeEventListener(key.slice(2).toLowerCase(), prev[key]);
                } else if (key.toLowerCase() === "classname" || key.toLowerCase() === "class") {
                    el.__kdomClassName = "";
                    this.syncClassAttribute(el);
                } else if (key === "style") {
                    el.__kdomStyleClasses = "";
                    el.removeAttribute("style");
                    this.syncClassAttribute(el);
                } else {
                    el.removeAttribute(key);
                }
            }
            for (const key of Object.keys(next)) {
                if (key.startsWith("__")) continue;
                this.setProp(el, key, next[key], prev[key]);
            }
        }
        // ── Children normalisation ────────────────────────────────────────────────
        normalizeChild(child) {
            return VNode.from(child);
        }
        normalizeChildren(children) {
            if (typeof children === "string") return [VNode.text(children)];
            const out = [];
            const c = typeof children === "object" || typeof children === "function" ? [children] : (children || []);
            try {
                for (const child of c) {
                    const n = this.normalizeChild(child);
                    if (!n) continue;
                    if (n.isFragment) out.push(...n.children);
                    else out.push(n);
                }
            } catch(error) {
                console.log(c);
                window.c = c;
                throw error;
            }
            return out;
        }
        // ── Mount ─────────────────────────────────────────────────────────────────
        mount(vnode, parent, beforeNode, parentInstance, namespace) {
            const n = this.normalizeChild(vnode);
            if (!n) return beforeNode;
            if (n.isText) {
                const node = document.createTextNode(n.text);
                n.dom = node;
                parent.insertBefore(node, beforeNode);
                return node.nextSibling;
            }
            if (n.isComponent) return this.mountComponent(n, parent, beforeNode, parentInstance, namespace);
            if (n.isFragment) return this.mountFragment(n, parent, beforeNode, parentInstance, namespace);
            return this.mountElement(n, parent, beforeNode, parentInstance, namespace);
        }
        mountElement(vnode, parent, beforeNode, parentInstance, namespace) {
            const ns = this.getNamespace(namespace, vnode.tag);
            const el = this.createElement(vnode.tag, ns);
            vnode.dom = el;
            vnode.namespace = ns;
            this.updateProps(el, vnode.props, {});
            if (!beforeNode) parent.appendChild(el);
            else parent.insertBefore(el, beforeNode);
            const children = this.normalizeChildren(vnode.children);
            vnode.children = children;
            let cursor = el.firstChild;
            for (const child of children)
                cursor = this.mount(child, el, cursor, parentInstance, ns);
            return el.nextSibling;
        }
        mountFragment(vnode, parent, beforeNode, parentInstance, namespace) {
            const start = this.createBoundaryComment("kdom:fragment:start");
            const end = this.createBoundaryComment("kdom:fragment:end");
            vnode.dom = start;
            vnode.endDom = end;
            parent.insertBefore(start, beforeNode);
            parent.insertBefore(end, beforeNode);
            const children = this.normalizeChildren(vnode.children);
            vnode.children = children;
            let cursor = end;
            for (const child of children)
                cursor = this.mount(child, parent, cursor, parentInstance, namespace);
            return end.nextSibling;
        }
        mountComponent(vnode, parent, beforeNode, parentInstance, namespace) {
            const name = vnode.tag.name || "anonymous";
            const start = this.createBoundaryComment(`kdom:${name}:start`);
            const end = this.createBoundaryComment(`kdom:${name}:end`);
            parent.insertBefore(start, beforeNode);
            parent.insertBefore(end, beforeNode);
            const instance = new ComponentInstance({
                renderer: this,
                component: vnode.tag,
                props: vnode.props,
                parent,
                parentInstance,
                namespace,
                start,
                end
            });
            vnode.dom = start;
            vnode.endDom = end;
            vnode.instance = instance;
            this.renderInstance(instance);
            this.css.syncRulesToDom();
            return end.nextSibling;
        }
        // ── Patch (reconciler) ────────────────────────────────────────────────────
        nextSiblingAfter(vnode) {
            if (!vnode) return null;
            if (vnode.kind === "component" || vnode.kind === "fragment")
                return vnode.endDom ? vnode.endDom.nextSibling : null;
            if (vnode.dom) return vnode.dom.nextSibling;
            return null;
        }
        sameVNodeType(a, b) {
            if (!a || !b) return false;
            if (a.kind !== b.kind) return false;
            if (a.kind === "element" || a.kind === "component") return a.tag === b.tag;
            return true;
        }
        patch(parent, oldVNode, newVNode, beforeNode, parentInstance, namespace) {
            const next = this.normalizeChild(newVNode);
            if (!next) {
                if (oldVNode) this.unmount(oldVNode);
                return beforeNode;
            }
            if (!oldVNode)
                return this.mount(next, parent, beforeNode, parentInstance, namespace);
            if (!this.sameVNodeType(oldVNode, next)) {
                const anchor = oldVNode.dom || oldVNode.endDom || beforeNode;
                this.mount(next, parent, anchor, parentInstance, namespace);
                this.unmount(oldVNode);
                return this.nextSiblingAfter(next);
            }
            if (oldVNode.kind === "text") {
                if (oldVNode.text !== next.text) oldVNode.dom.nodeValue = next.text;
                next.dom = oldVNode.dom;
                return oldVNode.dom.nextSibling;
            }
            if (oldVNode.kind === "element") return this.patchElement(parent, oldVNode, next, beforeNode, parentInstance, namespace);
            if (oldVNode.kind === "component") return this.patchComponent(parent, oldVNode, next, beforeNode, parentInstance, namespace);
            if (oldVNode.kind === "fragment") return this.patchFragment(parent, oldVNode, next, beforeNode, parentInstance, namespace);
            return beforeNode;
        }
        patchElement(parent, oldVNode, newVNode, beforeNode, parentInstance, namespace) {
            const el = oldVNode.dom;
            this.updateProps(el, newVNode.props, oldVNode.props);
            newVNode.dom = el;
            newVNode.namespace = oldVNode.namespace;
            const oldChildren = oldVNode.children || [];
            const newChildren = this.normalizeChildren(newVNode.children);
            newVNode.children = newChildren;
            let cursor = el.firstChild;
            const max = Math.max(oldChildren.length, newChildren.length);
            for (let i = 0; i < max; ++i) {
                const o = oldChildren[i], n = newChildren[i];
                if (o && n) cursor = this.patch(el, o, n, cursor, parentInstance, newVNode.namespace);
                else if (n) cursor = this.mount(n, el, cursor, parentInstance, newVNode.namespace);
                else this.unmount(o);
            }
            return el.nextSibling;
        }
        patchFragment(parent, oldVNode, newVNode, beforeNode, parentInstance, namespace) {
            newVNode.dom = oldVNode.dom;
            newVNode.endDom = oldVNode.endDom;
            const oldChildren = oldVNode.children || [];
            const newChildren = this.normalizeChildren(newVNode.children);
            newVNode.children = newChildren;
            let cursor = oldVNode.dom.nextSibling;
            const max = Math.max(oldChildren.length, newChildren.length);
            for (let i = 0; i < max; ++i) {
                const o = oldChildren[i], n = newChildren[i];
                if (o && n) cursor = this.patch(parent, o, n, cursor, parentInstance, namespace);
                else if (n) cursor = this.mount(n, parent, cursor, parentInstance, namespace);
                else this.unmount(o);
            }
            return oldVNode.endDom.nextSibling;
        }
        patchComponent(parent, oldVNode, newVNode, beforeNode, parentInstance, namespace) {
            const instance = oldVNode.instance;
            newVNode.dom = oldVNode.dom;
            newVNode.endDom = oldVNode.endDom;
            newVNode.instance = instance;
            instance.props = newVNode.props;
            instance.parent = parent;
            instance.parentInstance = parentInstance;
            instance.namespace = namespace;
            this.renderInstance(instance);
            return oldVNode.endDom.nextSibling;
        }
        // ── Unmount / cleanup ─────────────────────────────────────────────────────
        cleanupVNode(vnode) {
            if (!vnode) return;
            if (vnode.kind === "component" && vnode.instance) {
                const inst = vnode.instance;
                for (const hook of inst.hooks) {
                    if (hook && typeof hook.cleanup === "function") {
                        try {
                            hook.cleanup();
                        } catch (err) {
                            console.error("[KDOM] Effect cleanup error", err);
                        }
                    }
                }
                for (const child of inst.tree || []) this.cleanupVNode(child);
                VNode.removeFromParent(inst.start);
                VNode.removeFromParent(inst.end);
                return;
            }
            if (vnode.kind === "fragment") {
                for (const child of vnode.children || []) this.cleanupVNode(child);
                VNode.removeFromParent(vnode.dom);
                VNode.removeFromParent(vnode.endDom);
                return;
            }
            for (const child of vnode.children || []) this.cleanupVNode(child);
            if (vnode.instance) this.cleanupVNode({ kind: "component", instance: vnode.instance });
            VNode.removeFromParent(vnode.dom);
        }
        unmount(vnode) {
            this.cleanupVNode(vnode);
        }
        // ── Render ────────────────────────────────────────────────────────────────
        renderInstance(instance) {
            const prev = this.currentInstance;
            this.currentInstance = instance;
            instance.hookIndex = 0;
            let output;
            try {
                output = instance.component(instance.props || {});
            } finally {
                this.currentInstance = prev;
            }
            const nextVNode = VNode.from(output);
            const nextTree = !nextVNode ? [] : nextVNode.isFragment ? nextVNode.children : [nextVNode];
            const oldTree = instance.tree || [];
            const parent = instance.parent;
            const beforeNode = instance.end;
            const max = Math.max(oldTree.length, nextTree.length);
            for (let i = 0; i < max; i++) {
                const o = oldTree[i], n = nextTree[i];
                if (o && n) this.patch(parent, o, n, beforeNode, instance, instance.namespace);
                else if (n) this.mount(n, parent, beforeNode, instance, instance.namespace);
                else this.unmount(o);
            }
            instance.tree = nextTree;
            instance.isMounted = true;
            this.scheduleEffectFlush();
        }
        render(component, container) {
            if (!container) throw new KDOMError("render requer um elemento container");
            try {
                if (this.rootVNode) this.unmount(this.rootVNode);
                container.textContent = "";
                const vnode = VNode.component(component);
                this.rootVNode = vnode;
                this.rootContainer = container;
                this.mount(vnode, container, null, null, null);
                return vnode;
            } catch (error) {
                if (this.onUnhandledError) {
                    this.onUnhandledError(error, {
                        phase: "render",
                        component,
                        container,
                    });
                    return;
                }
                throw error;
            }
        }
        // ── Effect scheduling ─────────────────────────────────────────────────────
        // Effects are batched into a single microtask so they always run after the
        // entire synchronous render pass completes — same guarantee as React.
        scheduleEffectFlush() {
            if (this.effectFlushPending) return;
            this.effectFlushPending = true;
            queueMicrotask(() => {
                this.effectFlushPending = false;
                const queue = this.effectQueue;
                this.effectQueue = [];
                for (const run of queue) run();
            });
        }
        depsChanged(prevDeps, nextDeps) {
            if (!prevDeps || !nextDeps) return true;
            if (prevDeps.length !== nextDeps.length) return true;
            for (let i = 0; i < prevDeps.length; i++)
                if (!Object.is(prevDeps[i], nextDeps[i])) return true;
            return false;
        }
        // ── Hooks ─────────────────────────────────────────────────────────────────
        useState(initialValue) {
            if (!this.currentInstance)
                throw new KDOMError("useState deve ser chamado de dentro de um componente");
            const instance = this.currentInstance;
            const index = instance.hookIndex++;
            if (!(index in instance.hooks))
                instance.hooks[index] = typeof initialValue === "function" ? initialValue() : initialValue;
            const setState = (nextValue) => {
                const prev = instance.hooks[index];
                const value = typeof nextValue === "function" ? nextValue(prev) : nextValue;
                if (Object.is(prev, value)) return;
                instance.hooks[index] = value;
                if (!instance.updateScheduled) {
                    instance.updateScheduled = true;
                    queueMicrotask(() => {
                        instance.updateScheduled = false;
                        if (instance.start?.parentNode) this.renderInstance(instance);
                    });
                }
            };
            return [instance.hooks[index], setState];
        }
        useRef(initialValue) {
            if (!this.currentInstance)
                throw new KDOMError("useRef deve ser chamado de dentro de um componente");
            const instance = this.currentInstance;
            const index = instance.hookIndex++;
            if (!(index in instance.hooks))
                instance.hooks[index] = { current: initialValue };
            return instance.hooks[index];
        }
        useEffect(effect, deps) {
            if (!this.currentInstance)
                throw new KDOMError("useEffect deve ser chamado de dentro de um componente");
            const instance = this.currentInstance;
            const index = instance.hookIndex++;
            const prev = instance.hooks[index];
            const shouldRun = !prev || this.depsChanged(prev.deps, deps);
            instance.hooks[index] = { deps, cleanup: prev?.cleanup };
            if (!shouldRun) return;
            this.effectQueue.push(() => {
                const hook = instance.hooks[index];
                if (!hook) return;
                if (typeof hook.cleanup === "function")
                    try {
                        hook.cleanup();
                    } catch {
                    }
                const cleanup = effect();
                hook.cleanup = typeof cleanup === "function" ? cleanup : void 0;
            });
        }
        // useTheme() — returns [themeSpec, setTheme]
        //
        // Subscribes the calling component to theme changes; any call to
        // theme.set() re-renders it. The subscription is cleaned up automatically
        // on unmount via the fixed cleanupVNode (which now reads inst.hooks).
        useTheme() {
            if (!this.currentInstance)
                throw new KDOMError("useTheme deve ser chamado de dentro de um componente");
            const [, forceUpdate] = this.useState(0);
            this.useEffect(() => {
                const unsubscribe = this.theme.subscribe(() => forceUpdate((n) => n + 1));
                return unsubscribe;
            }, []);
            return [this.theme.get(), (spec) => this.theme.set(spec)];
        }
        // Enable HTML comment boundary nodes (useful for debugging component ranges).
        setComments(value) {
            this.addComments = !!value;
        }
    };

    // src/utilities.js
    var utilities = {
        // Generate a random alphanumeric string of the given length.
        randomString(length) {
            let result = "";
            while (result.length < length) result += Math.random().toString(36).slice(2);
            return result.slice(0, length);
        },
        // Toggle dark mode by adding/removing the "dark" class on <html>.
        // This activates the ".dark" CSS block injected by ThemeManager
        // and also enables the "dark" variant in CSSBuilder style objects.
        setDarkMode(value) {
            document.documentElement.classList.toggle("dark", value);
        },
        // Add two hex colour strings component-wise, clamping each channel to 0–255.
        // Useful for generating hover/active shades without a full colour library.
        //   offsetColor("#3b82f6", "#111111") → slightly lighter blue
        offsetColor(base, offset) {
            base = base.replace("#", "");
            offset = offset.replace("#", "");
            const r1 = parseInt(base.substring(0, 2), 16);
            const g1 = parseInt(base.substring(2, 4), 16);
            const b1 = parseInt(base.substring(4, 6), 16);
            const r2 = parseInt(offset.substring(0, 2), 16);
            const g2 = parseInt(offset.substring(2, 4), 16);
            const b2 = parseInt(offset.substring(4, 6), 16);
            const r = Math.min(255, r1 + r2);
            const g = Math.min(255, g1 + g2);
            const b = Math.min(255, b1 + b2);
            const toHex = (n) => n.toString(16).padStart(2, "0");
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }
    };

    // src/addons/manager.js
    var KDOMAddonManager = class {
        constructor() {
            this.registry = [];
            this.installed = new Map();
        }

        normalize(addon) {
            if (typeof addon === "function") {
                return {
                    id: addon.id || addon.name || `addon-${this.registry.length}`,
                    name: addon.name || addon.id || "anonymous-addon",
                    version: addon.version || null,
                    install: addon,
                };
            }

            if (addon && typeof addon.install === "function") {
                return {
                    id: addon.id || addon.name || addon.install.name || `addon-${this.registry.length}`,
                    name: addon.name || addon.id || addon.install.name || "anonymous-addon",
                    version: addon.version || null,
                    install: addon.install,
                    meta: addon,
                };
            }

            throw new KDOMError("Addon inválido: use uma função ou um objeto { id, install }");
        }

        register(addon) {
            const normalized = this.normalize(addon);
            if (this.registry.some((a) => a.id === normalized.id)) return normalized;
            this.registry.push(normalized);
            return normalized;
        }

        install(addonOrId, kdom) {
            const addon =
                typeof addonOrId === "string"
                    ? this.registry.find((a) => a.id === addonOrId)
                    : this.register(addonOrId);

            if (!addon) throw new KDOMError(`Addon não encontrado: ${addonOrId}`);
            if (this.installed.has(addon.id)) return this.installed.get(addon.id);

            const result = addon.install(kdom);
            this.installed.set(addon.id, result ?? true);
            return result;
        }

        installAll(kdom) {
            for (const addon of this.registry) {
                this.install(addon, kdom);
            }
        }

        list() {
            return this.registry.map(({ install, ...rest }) => rest);
        }

        isInstalled(id) {
            return this.installed.has(id);
        }
    };

    // src/index.js
    function createInstance() {
        const renderer = new Renderer();
        renderer.CSSBuilder = CSSBuilder;
        renderer.ThemeManager = ThemeManager;
        renderer.utilities = utilities;

        const addonManager = new KDOMAddonManager();

        renderer.addons = addonManager;
        renderer.registerAddon = (addon) => addonManager.register(addon);
        renderer.useAddon = (addon) => addonManager.install(addon, renderer);
        renderer.useAddonById = (id) => addonManager.install(id, renderer);
        renderer.useAllAddons = () => addonManager.installAll(renderer);
        renderer.listAddons = () => addonManager.list();

        if (typeof window !== "undefined") {
            const queue = Array.isArray(window.KDOM_Addons) ? window.KDOM_Addons : [];
            window.KDOM_Addons = queue;

            for (const addon of queue) addonManager.register(addon);
            addonManager.installAll(renderer);

            const originalPush = queue.push.bind(queue);
            queue.push = (...items) => {
                const result = originalPush(...items);
                for (const item of items) addonManager.install(item, renderer);
                return result;
            };

            window.KDOM_AddonAPI = {
                list: () => addonManager.list(),
                register: (addon) => addonManager.register(addon),
                use: (addon) => addonManager.install(addon, renderer),
                useById: (id) => addonManager.install(id, renderer),
            };
        }

        return renderer;
    }

    // src/index.iife.js
    window.KDOM = createInstance();
})();