; (function () {
    "use strict";

    // =============================================================================
    // KDOM Store — a Redux-style state container addon for KDOM.
    //
    // Two layers:
    //
    //   1. A framework-agnostic store core — createStore, combineReducers,
    //      applyMiddleware, compose, thunk, shallowEqual — same shape and
    //      semantics as the `redux` package. Works with or without KDOM.
    //
    //   2. KDOM hooks — useStore, useSelector, useDispatch, useStoreState —
    //      that subscribe a component to a store the exact same way
    //      KDOM's own useTheme() subscribes a component to ThemeManager
    //      (useState to force a render + useEffect to subscribe/cleanup).
    //
    // KDOM has no Context/Provider mechanism (function components never receive
    // `children`, by design — see VNode.from), so stores are not scoped through
    // the tree. Instead, register a store once and every component can reach it
    // through the hooks below — mirroring how `KDOM.theme` already works.
    //
    // ---------------------------------------------------------------------------
    // Quick start
    // ---------------------------------------------------------------------------
    //
    //   function counterReducer(state = { count: 0 }, action) {
    //     switch (action.type) {
    //       case "increment": return { count: state.count + 1 };
    //       case "decrement": return { count: state.count - 1 };
    //       default: return state;
    //     }
    //   }
    //
    //   const store = KDOM.createStore(counterReducer);
    //   KDOM.registerStore(store); // becomes the default store
    //
    //   function Counter() {
    //     const count = KDOM.useSelector((s) => s.count);
    //     const dispatch = KDOM.useDispatch();
    //     return {
    //       tag: "div",
    //       children: [
    //         { tag: "span", children: [`Count: ${count}`] },
    //         { tag: "button", onClick: () => dispatch({ type: "increment" }), children: ["+"] },
    //         { tag: "button", onClick: () => dispatch({ type: "decrement" }), children: ["-"] },
    //       ],
    //     };
    //   }
    //
    //   KDOM.render(Counter, document.getElementById("app"));
    //
    // ---------------------------------------------------------------------------
    // Multiple stores
    // ---------------------------------------------------------------------------
    //
    //   KDOM.registerStore(cartStore, "cart");
    //   KDOM.registerStore(userStore, "user");
    //
    //   const items = KDOM.useSelector((s) => s.items, "cart");
    //   const dispatchCart = KDOM.useDispatch("cart");
    //
    // You can skip the registry entirely too — every hook below also accepts a
    // store object directly wherever a `ref` is expected, handy for tests or
    // one-off local stores:
    //
    //   const localStore = KDOM.createStore(reducer);
    //   const value = KDOM.useSelector((s) => s.value, localStore);
    //
    // ---------------------------------------------------------------------------
    // Async actions (thunks)
    // ---------------------------------------------------------------------------
    //
    //   const store = KDOM.createStore(reducer, undefined, KDOM.applyMiddleware(KDOM.thunk));
    //   dispatch((dispatch, getState) => {
    //     fetch("/api/things").then((r) => r.json()).then((data) =>
    //       dispatch({ type: "things/loaded", payload: data })
    //     );
    //   });
    // =============================================================================

    class KDOMStoreError extends Error {
        constructor(message) {
            super(message);
            this.name = "KDOMStoreError";
        }
    }

    // ── Store core (framework-agnostic) ─────────────────────────────────────────

    const INIT_ACTION = { type: "@@kdom-store/INIT" };
    const REPLACE_ACTION = { type: "@@kdom-store/REPLACE" };

    function isPlainObject(value) {
        if (typeof value !== "object" || value === null) return false;
        let proto = value;
        while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);
        return Object.getPrototypeOf(value) === proto;
    }

    // createStore(reducer, preloadedState?, enhancer?) → { getState, dispatch, subscribe, replaceReducer }
    function createStore(reducer, preloadedState, enhancer) {
        if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
            enhancer = preloadedState;
            preloadedState = void 0;
        }

        if (typeof enhancer !== "undefined") {
            if (typeof enhancer !== "function")
                throw new KDOMStoreError("createStore: enhancer must be a function.");
            return enhancer(createStore)(reducer, preloadedState);
        }

        if (typeof reducer !== "function")
            throw new KDOMStoreError("createStore: reducer must be a function.");

        let currentReducer = reducer;
        let currentState = preloadedState;
        const listeners = new Set();
        let isDispatching = false;

        function getState() {
            if (isDispatching)
                throw new KDOMStoreError("You may not call getState() while the reducer is executing.");
            return currentState;
        }

        function subscribe(listener) {
            if (typeof listener !== "function")
                throw new KDOMStoreError("subscribe: listener must be a function.");
            
            listeners.add(listener);
            
            let subscribed = true;
            return function unsubscribe() {
                if (!subscribed)
                    return;

                subscribed = false;
                listeners.delete(listener);
            };
        }

        // function dispatch(type, action = null) {
        //     if (typeof type === "undefined") throw new KDOMStoreError("Dispatch must have a 'type'.");
        //     if (isDispatching) throw new KDOMStoreError("Reducers may not dispatch actions.");

        //     try {
        //         isDispatching = true;
        //         currentState = currentReducer(currentState, action);
        //     } finally {
        //         isDispatching = false;
        //     }

        //     // Snapshot listeners so a subscriber added/removed mid-dispatch can't
        //     // shift indices out from under this loop.
        //     for (const listener of Array.from(listeners)) listener();
        //     return action;
        // }

        function dispatch(action) {
            if (!isPlainObject(action)) {
                throw new KDOMStoreError(
                    "Actions must be plain objects with a 'type' property. " +
                        "To dispatch functions (thunks), create the store with KDOM.applyMiddleware(KDOM.thunk)."
                );
            }
            if (typeof action.type === "undefined") throw new KDOMStoreError("Actions must have a 'type' property.");
            if (isDispatching) throw new KDOMStoreError("Reducers may not dispatch actions.");

            try {
                isDispatching = true;
                currentState = currentReducer(currentState, action);
            } finally {
                isDispatching = false;
            }

            // Snapshot listeners so a subscriber added/removed mid-dispatch can't
            // shift indices out from under this loop.
            for (const listener of Array.from(listeners)) listener();
            return action;
        }

        function replaceReducer(nextReducer) {
            if (typeof nextReducer !== "function")
                throw new KDOMStoreError("replaceReducer: nextReducer must be a function.");
            currentReducer = nextReducer;
            dispatch(REPLACE_ACTION);
        }

        dispatch(INIT_ACTION);

        return { getState, dispatch, subscribe, replaceReducer };
    }

    // combineReducers({ a: reducerA, b: reducerB }) → reducer over { a, b }
    function combineReducers(reducers) {
        const keys = Object.keys(reducers);
        return function combinedReducer(state = {}, action) {
            let hasChanged = false;
            const nextState = {};
            for (const key of keys) {
                const next = reducers[key](state[key], action);
                if (typeof next === "undefined")
                    throw new KDOMStoreError(
                        `combineReducers: reducer for "${key}" returned undefined for action "${action && action.type}".`
                    );
                nextState[key] = next;
                hasChanged = hasChanged || next !== state[key];
            }
            hasChanged = hasChanged || keys.length !== Object.keys(state).length;
            return hasChanged ? nextState : state;
        };
    }

    function compose(...funcs) {
        if (funcs.length === 0) return (arg) => arg;
        if (funcs.length === 1) return funcs[0];
        return funcs.reduce((a, b) => (...args) => a(b(...args)));
    }

    // applyMiddleware(...middlewares) → enhancer, pass as createStore's 3rd arg
    function applyMiddleware(...middlewares) {
        return (createStoreFn) =>
            (reducer, preloadedState) => {
                const store = createStoreFn(reducer, preloadedState);
                let dispatch = () => {
                    throw new KDOMStoreError("Dispatching while constructing your middleware is not allowed.");
                };

                const middlewareAPI = {
                    getState: store.getState,
                    dispatch: (action, ...args) => dispatch(action, ...args),
                };

                const chain = middlewares.map((mw) => mw(middlewareAPI));
                dispatch = compose(...chain)(store.dispatch);

                return { ...store, dispatch };
            };
    }

    // persistState(key, options?) → enhancer
    //
    // Persists the store state to localStorage.
    //
    // Example:
    //   const store = KDOM.createStore(
    //     reducer,
    //     KDOM.persistState("my-app")
    //   );
    //
    // Optional options:
    //   {
    //     storage: localStorage-like object,
    //     serialize: (state) => string,
    //     deserialize: (value) => state,
    //     select: (state) => state,
    //     debounce: number
    //   }

    function persistState(key, options) {
        options = options || {};

        if (typeof key !== "string" || key.length === 0) {
            throw new KDOMStoreError("persistState: key must be a non-empty string.");
        }

        const serialize =
            typeof options.serialize === "function"
                ? options.serialize
                : JSON.stringify;

        const deserialize =
            typeof options.deserialize === "function"
                ? options.deserialize
                : JSON.parse;

        const select =
            typeof options.select === "function"
                ? options.select
                : (state) => state;

        const debounce =
            typeof options.debounce === "number" && options.debounce >= 0
                ? options.debounce
                : 0;

        function getStorage() {
            if (options.storage) return options.storage;

            // Important for SSR / Node / tests:
            if (typeof window === "undefined") return null;

            try {
                return window.localStorage;
            } catch (err) {
                console.warn("[KDOM Store] localStorage unavailable:", err);
                return null;
            }
        }

        return (createStoreFn) =>
            (reducer, preloadedState) => {
                const storage = getStorage();

                let hydratedState = preloadedState;

                // Only hydrate from storage when the caller did not explicitly
                // provide a preloadedState.
                if (typeof hydratedState === "undefined" && storage) {
                    try {
                        const persisted = storage.getItem(key);

                        if (persisted !== null) {
                            hydratedState = deserialize(persisted);
                        }
                    } catch (err) {
                        console.warn(
                            `[KDOM Store] Failed to restore persisted state for "${key}":`,
                            err
                        );
                    }
                }

                const store = createStoreFn(reducer, hydratedState);

                if (!storage) {
                    return store;
                }

                let saveTimer = null;
                let destroyed = false;

                function save() {
                    if (destroyed) return;

                    try {
                        const state = select(store.getState());
                        const serialized = serialize(state);
                        storage.setItem(key, serialized);
                    } catch (err) {
                        console.warn(
                            `[KDOM Store] Failed to persist state for "${key}":`,
                            err
                        );
                    }
                }

                function scheduleSave() {
                    if (debounce === 0) {
                        save();
                        return;
                    }

                    if (saveTimer !== null) {
                        clearTimeout(saveTimer);
                    }

                    saveTimer = setTimeout(() => {
                        saveTimer = null;
                        save();
                    }, debounce);
                }

                // Persist the initial state as well. This means a completely new
                // store will populate localStorage immediately.
                save();

                const unsubscribe = store.subscribe(scheduleSave);

                // Preserve the normal store API and add a few persistence helpers.
                return {
                    ...store,

                    persist: save,

                    clearPersisted() {
                        try {
                            storage.removeItem(key);
                        } catch (err) {
                            console.warn(
                                `[KDOM Store] Failed to clear persisted state for "${key}":`,
                                err
                            );
                        }
                    },

                    destroyPersistence() {
                        if (destroyed) return;

                        destroyed = true;

                        unsubscribe();

                        if (saveTimer !== null) {
                            clearTimeout(saveTimer);
                            saveTimer = null;
                        }
                    },
                };
            };
    }

    // Lets you dispatch functions: dispatch((dispatch, getState) => { ... })
    const thunk = ({ dispatch, getState }) => (next) => (action) => {
        if (typeof action === "function")
            return action(dispatch, getState);
        return next(action);
    };

    // Shallow (one-level) equality — useful as useSelector's equalityFn when a
    // selector returns a freshly-built object/array each call.
    function shallowEqual(a, b) {
        if (Object.is(a, b)) return true;
        if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) return false;
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (const key of keysA) {
            if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is(a[key], b[key])) return false;
        }
        return true;
    }

    // ── KDOM addon ───────────────────────────────────────────────────────────────

    function createStoreAddon(options) {
        options = options || {};

        const addon = {
            id: options.id || "kdom-store",
            name: options.name || "KDOM Store",
            version: options.version || "1.0.0",

            install(KDOM) {
                const namedStores = new Map();
                let defaultStore = null;

                function isStoreLike(value) {
                    return !!value && typeof value.getState === "function" && typeof value.subscribe === "function";
                }

                // registerStore(store)         → sets/overwrites the default store
                // registerStore(store, "cart") → registers a named store (also becomes
                //                                 the default if none exists yet)
                function registerStore(store, name) {
                    if (!isStoreLike(store))
                        throw new KDOMStoreError("registerStore expects a store created with KDOM.createStore().");
                    if (name) namedStores.set(name, store);
                    if (!name || !defaultStore) defaultStore = store;
                    return store;
                }

                function getStore(name) {
                    if (!name) return defaultStore;
                    return namedStores.get(name) || null;
                }

                // Resolves a `ref` that may be omitted (→ default store), a store
                // object itself (used as-is, no registration required), or a string
                // name (looked up in the registry).
                function resolveStore(ref) {
                    if (isStoreLike(ref)) return ref;
                    if (typeof ref === "string") {
                        const found = getStore(ref);
                        if (!found)
                            throw new KDOMStoreError(
                                `No store registered under "${ref}". Call KDOM.registerStore(store, "${ref}") first.`
                            );
                        return found;
                    }
                    if (defaultStore) return defaultStore;
                    throw new KDOMStoreError(
                        "No store available. Create one with KDOM.createStore(reducer) and register it with " +
                        "KDOM.registerStore(store), or pass a store directly to useStore/useSelector/useDispatch."
                    );
                }

                KDOM.createStore = createStore;
                KDOM.combineReducers = combineReducers;
                KDOM.applyMiddleware = applyMiddleware;
                KDOM.compose = compose;
                KDOM.thunk = thunk;
                KDOM.shallowEqual = shallowEqual;
                KDOM.persistState = persistState;
                KDOM.registerStore = registerStore;
                KDOM.getStore = getStore;

                // useStore(ref?) → the resolved store object itself.
                KDOM.useStore = function (ref) {
                    return resolveStore(ref);
                };

                // useDispatch(ref?) → store.dispatch for the resolved store.
                KDOM.useDispatch = function (ref) {
                    return resolveStore(ref).dispatch;
                };

                // useSelector(selector, equalityFn?, ref?) — the two optional args
                // can be passed in either order; whichever is a function is treated
                // as the equality comparator, whichever is a store/string as `ref`.
                KDOM.useSelector = function (selector) {
                    if (typeof selector !== "function")
                        throw new KDOMStoreError("useSelector requires a selector function.");

                    let ref, equalityFn;
                    for (let i = 1; i < arguments.length; i++) {
                        const arg = arguments[i];
                        if (typeof arg === "function") equalityFn = arg;
                        else if (typeof arg !== "undefined") ref = arg;
                    }
                    const store = resolveStore(ref);
                    const eq = equalityFn || Object.is;

                    const selectedRef = this.useRef();
                    const initializedRef = this.useRef(false);
                    const [, forceRender] = this.useState(0);

                    // Re-run the selector on every render (not just on store
                    // notifications) so the returned value is never stale relative
                    // to a re-render triggered by something unrelated to the store.
                    const selected = selector(store.getState());
                    if (!initializedRef.current || !eq(selectedRef.current, selected)) {
                        selectedRef.current = selected;
                    }
                    initializedRef.current = true;

                    // Note: if `selector` is a fresh inline arrow function on every
                    // render (the common case), this effect re-subscribes on every
                    // render too — harmless, just slightly wasteful. Hoist the
                    // selector outside the component if that ever matters.
                    this.useEffect(() => {
                        const checkForUpdates = () => {
                            let next;
                            try {
                                next = selector(store.getState());
                            } catch (err) {
                                // A throwing selector must not break dispatch for
                                // other subscribers — log and bail rather than
                                // rethrowing from inside the store's listener loop.
                                console.error("[KDOM Store] selector threw:", err);
                                return;
                            }
                            if (!eq(selectedRef.current, next)) {
                                selectedRef.current = next;
                                forceRender((n) => n + 1);
                            }
                        };
                        checkForUpdates();
                        return store.subscribe(checkForUpdates);
                    }, [store, selector]);

                    return selectedRef.current;
                };

                // useStoreState(ref?) → [state, dispatch]. Re-renders on every
                // dispatch — a plain useReducer-style convenience for small stores
                // where slicing with useSelector isn't worth it.
                KDOM.useStoreState = function (ref) {
                    const store = resolveStore(ref);
                    const [, forceRender] = this.useState(0);
                    this.useEffect(() => {
                        return store.subscribe(() => forceRender((n) => n + 1));
                    }, [store]);
                    return [store.getState(), store.dispatch];
                };

                return function uninstall() {
                    namedStores.clear();
                    defaultStore = null;
                    for (const key of [
                        "createStore",
                        "combineReducers",
                        "applyMiddleware",
                        "compose",
                        "thunk",
                        "shallowEqual",
                        "persistState",
                        "registerStore",
                        "getStore",
                        "useStore",
                        "useSelector",
                        "useDispatch",
                        "useStoreState",
                    ]) {
                        delete KDOM[key];
                    }
                };
            },
        };

        return addon;
    }

    window.KDOM_Addons = window.KDOM_Addons || [];
    window.KDOM_Addons.push(
        createStoreAddon({
            id: "kdom-store",
            name: "KDOM Store",
            version: "1.0.0",
        })
    );

    if (window.KDOM && typeof window.KDOM.useAddon === "function") {
        window.KDOM.useAddon(window.KDOM_Addons[window.KDOM_Addons.length - 1]);
    } else if (window.KDOM_AddonAPI && typeof window.KDOM_AddonAPI.use === "function") {
        window.KDOM_AddonAPI.use(window.KDOM_Addons[window.KDOM_Addons.length - 1]);
    }
})();
