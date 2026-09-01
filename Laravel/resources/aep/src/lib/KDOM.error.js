; (function () {
    function createErrorUIAddon(options) {
        options = options || {};

        const addon = {
            id: options.id || "kdom-error-ui",
            name: options.name || "KDOM Error UI",
            version: options.version || "1.0.0",

            install(KDOM) {
                const state = {
                    container: null,
                    mountedMode: null, // "kdom" | "vanilla"
                    currentError: null,
                    lastAction: null,
                };

                function normalizeError(error) {
                    if (error instanceof Error) return error;
                    return new Error(String(error));
                }

                function getErrorMessage(error) {
                    const e = normalizeError(error);
                    return e.message || "Erro desconhecido";
                }

                function getErrorStack(error) {
                    const e = normalizeError(error);
                    return e.stack || e.message || String(e);
                }

                function ensureContainer() {
                    if (state.container && state.container.parentNode) return state.container;

                    const container = document.createElement("div");
                    container.id = options.containerId || "kdom_error_overlay_root";
                    document.body.appendChild(container);

                    state.container = container;
                    return container;
                }

                function lockBody(lock) {
                    document.body.classList.toggle("overflow-hidden", !!lock);
                }

                function destroyContainer() {
                    if (state.container && state.container.parentNode) {
                        state.container.parentNode.removeChild(state.container);
                    }
                    state.container = null;
                    state.mountedMode = null;
                    lockBody(false);
                }

                function handleClose() {
                    if (typeof options.onClose === "function") {
                        try {
                            options.onClose(state.currentError, state.lastAction);
                        } catch (_) { }
                    }
                    destroyContainer();
                }

                function handleRetry() {
                    if (typeof options.onRetry === "function") {
                        try {
                            options.onRetry(state.currentError);
                        } catch (_) { }
                    }
                    if (typeof state.lastAction === "function") {
                        try {
                            state.lastAction();
                        } catch (_) { }
                    }
                    destroyContainer();
                }

                function viewModel(error) {
                    const e = normalizeError(error);

                    return {
                        tag: null,
                        children: [
                            {
                                tag: "div",
                                className: "print:hidden",
                                style: {
                                    position: "fixed",
                                    inset: 0,
                                    zIndex: 2147483647,
                                    background: "rgba(0, 0, 0, 0.55)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "24px",
                                },
                                children: [
                                    {
                                        tag: "div",
                                        style: {
                                            width: "min(980px, 100%)",
                                            maxHeight: "min(90vh, 900px)",
                                            overflow: "auto",
                                            background: "#fff1f2",
                                            color: "#7f1d1d",
                                            border: "1px solid #991b1b",
                                            borderRadius: "16px",
                                            boxShadow: "0 20px 60px rgba(0,0,0,.35)",
                                            padding: "20px",
                                            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: '#7f1d1d #fff1f2',
                                        },
                                        children: [
                                            {
                                                tag: "div",
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "start",
                                                    gap: "16px",
                                                    marginBottom: "16px",
                                                },
                                                children: [
                                                    {
                                                        tag: "div",
                                                        children: [
                                                            {
                                                                tag: "div",
                                                                style: {
                                                                    fontSize: "12px",
                                                                    fontWeight: "700",
                                                                    letterSpacing: "0.08em",
                                                                    textTransform: "uppercase",
                                                                    opacity: 0.8,
                                                                    marginBottom: "4px",
                                                                },
                                                                children: ["KDOM Error Overlay"],
                                                            },
                                                            {
                                                                tag: "h2",
                                                                style: {
                                                                    margin: 0,
                                                                    fontSize: "22px",
                                                                    lineHeight: 1.2,
                                                                },
                                                                children: [options.title || "Algo quebrou na renderização"],
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        tag: "button",
                                                        type: "button",
                                                        onClick: handleClose,
                                                        title: "Fechar",
                                                        style: {
                                                            width: "36px",
                                                            height: "36px",
                                                            borderRadius: "10px",
                                                            border: "1px solid #991b1b",
                                                            background: "#fecaca",
                                                            color: "#7f1d1d",
                                                            cursor: "pointer",
                                                            fontSize: "18px",
                                                            lineHeight: 1,
                                                            flex: "0 0 auto",
                                                        },
                                                        children: ["X"],
                                                    },
                                                ],
                                            },
                                            {
                                                tag: "div",
                                                style: {
                                                    display: "grid",
                                                    gap: "12px",
                                                },
                                                children: [
                                                    {
                                                        tag: "div",
                                                        style: {
                                                            background: "#fff",
                                                            border: "1px solid #fecdd3",
                                                            borderRadius: "12px",
                                                            padding: "14px",
                                                        },
                                                        children: [
                                                            {
                                                                tag: "div",
                                                                style: {
                                                                    fontWeight: "700",
                                                                    marginBottom: "6px",
                                                                },
                                                                children: ["Mensagem"],
                                                            },
                                                            {
                                                                tag: "div",
                                                                style: {
                                                                    whiteSpace: "pre-wrap",
                                                                    wordBreak: "break-word",
                                                                    fontFamily: "inherit",
                                                                },
                                                                children: [getErrorMessage(e)],
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        tag: "details",
                                                        open: true,
                                                        style: {
                                                            background: "#fff",
                                                            border: "1px solid #fecdd3",
                                                            borderRadius: "12px",
                                                            padding: "14px",
                                                        },
                                                        children: [
                                                            {
                                                                tag: "summary",
                                                                style: {
                                                                    cursor: "pointer",
                                                                    fontWeight: "700",
                                                                    marginBottom: "10px",
                                                                },
                                                                children: ["Stack trace"],
                                                            },
                                                            {
                                                                tag: "pre",
                                                                style: {
                                                                    margin: 0,
                                                                    whiteSpace: "pre-wrap",
                                                                    wordBreak: "break-word",
                                                                    overflow: "auto",
                                                                    maxHeight: "48vh",
                                                                    background: "#fafafa",
                                                                    border: "1px solid #fda4af",
                                                                    borderRadius: "10px",
                                                                    padding: "12px",
                                                                    color: "#7f1d1d",
                                                                    fontSize: "12px",
                                                                    lineHeight: 1.5,
                                                                },
                                                                children: [getErrorStack(e)],
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        tag: "div",
                                                        style: {
                                                            display: "flex",
                                                            gap: "10px",
                                                            justifyContent: "flex-end",
                                                            flexWrap: "wrap",
                                                            marginTop: "4px",
                                                        },
                                                        children: [
                                                            {
                                                                tag: "button",
                                                                type: "button",
                                                                onClick: handleClose,
                                                                style: {
                                                                    border: "1px solid #991b1b",
                                                                    background: "#fff",
                                                                    color: "#7f1d1d",
                                                                    borderRadius: "10px",
                                                                    padding: "10px 14px",
                                                                    cursor: "pointer",
                                                                },
                                                                children: [options.closeLabel || "Fechar"],
                                                            },
                                                            {
                                                                tag: "button",
                                                                type: "button",
                                                                onClick: handleRetry,
                                                                style: {
                                                                    border: "1px solid #991b1b",
                                                                    background: "#fecaca",
                                                                    color: "#7f1d1d",
                                                                    borderRadius: "10px",
                                                                    padding: "10px 14px",
                                                                    cursor: "pointer",
                                                                },
                                                                children: [options.retryLabel || "Tentar novamente"],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    };
                }

                function renderWithKDOM(error) {
                    const container = ensureContainer();
                    lockBody(true);

                    const App = function () {
                        return viewModel(error);
                    };

                    try {
                        KDOM.render(App, container);
                        state.mountedMode = "kdom";
                        return true;
                    } catch (_) {
                        return false;
                    }
                }

                function renderWithVanilla(error) {
                    const e = normalizeError(error);
                    const container = ensureContainer();
                    lockBody(true);
                    container.innerHTML = "";

                    const overlay = document.createElement("div");
                    overlay.className = "print:hidden";
                    overlay.style.position = "fixed";
                    overlay.style.inset = "0";
                    overlay.style.zIndex = "2147483647";
                    overlay.style.background = "rgba(0, 0, 0, 0.55)";
                    overlay.style.display = "flex";
                    overlay.style.justifyContent = "center";
                    overlay.style.alignItems = "center";
                    overlay.style.padding = "24px";

                    const main = document.createElement("div");
                    main.style.width = "min(980px, 100%)";
                    main.style.maxHeight = "min(90vh, 900px)";
                    main.style.overflow = "auto";
                    main.style.background = "#fff1f2";
                    main.style.color = "#7f1d1d";
                    main.style.border = "1px solid #991b1b";
                    main.style.borderRadius = "16px";
                    main.style.boxShadow = "0 20px 60px rgba(0,0,0,.35)";
                    main.style.padding = "20px";
                    main.style.fontFamily =
                        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

                    const header = document.createElement("div");
                    header.style.display = "flex";
                    header.style.justifyContent = "space-between";
                    header.style.alignItems = "start";
                    header.style.gap = "16px";
                    header.style.marginBottom = "16px";

                    const titleWrap = document.createElement("div");

                    const badge = document.createElement("div");
                    badge.textContent = "KDOM Error Overlay";
                    badge.style.fontSize = "12px";
                    badge.style.fontWeight = "700";
                    badge.style.letterSpacing = "0.08em";
                    badge.style.textTransform = "uppercase";
                    badge.style.opacity = "0.8";
                    badge.style.marginBottom = "4px";

                    const title = document.createElement("h2");
                    title.textContent = options.title || "Algo quebrou na renderização";
                    title.style.margin = "0";
                    title.style.fontSize = "22px";
                    title.style.lineHeight = "1.2";

                    titleWrap.appendChild(badge);
                    titleWrap.appendChild(title);

                    const closeBtn = document.createElement("button");
                    closeBtn.type = "button";
                    closeBtn.textContent = "×";
                    closeBtn.title = "Fechar";
                    closeBtn.style.width = "36px";
                    closeBtn.style.height = "36px";
                    closeBtn.style.borderRadius = "10px";
                    closeBtn.style.border = "1px solid #991b1b";
                    closeBtn.style.background = "#fecaca";
                    closeBtn.style.color = "#7f1d1d";
                    closeBtn.style.cursor = "pointer";
                    closeBtn.style.fontSize = "18px";
                    closeBtn.style.lineHeight = "1";
                    closeBtn.style.flex = "0 0 auto";
                    closeBtn.onclick = handleClose;

                    header.appendChild(titleWrap);
                    header.appendChild(closeBtn);

                    const bodyGrid = document.createElement("div");
                    bodyGrid.style.display = "grid";
                    bodyGrid.style.gap = "12px";

                    const messageBox = document.createElement("div");
                    messageBox.style.background = "#fff";
                    messageBox.style.border = "1px solid #fecdd3";
                    messageBox.style.borderRadius = "12px";
                    messageBox.style.padding = "14px";

                    const messageLabel = document.createElement("div");
                    messageLabel.textContent = "Mensagem";
                    messageLabel.style.fontWeight = "700";
                    messageLabel.style.marginBottom = "6px";

                    const messageValue = document.createElement("div");
                    messageValue.textContent = getErrorMessage(e);
                    messageValue.style.whiteSpace = "pre-wrap";
                    messageValue.style.wordBreak = "break-word";
                    messageValue.style.fontFamily = "inherit";

                    messageBox.appendChild(messageLabel);
                    messageBox.appendChild(messageValue);

                    const details = document.createElement("details");
                    details.open = true;
                    details.style.background = "#fff";
                    details.style.border = "1px solid #fecdd3";
                    details.style.borderRadius = "12px";
                    details.style.padding = "14px";

                    const summary = document.createElement("summary");
                    summary.textContent = "Stack trace";
                    summary.style.cursor = "pointer";
                    summary.style.fontWeight = "700";
                    summary.style.marginBottom = "10px";

                    const pre = document.createElement("pre");
                    pre.textContent = getErrorStack(e);
                    pre.style.margin = "0";
                    pre.style.whiteSpace = "pre-wrap";
                    pre.style.wordBreak = "break-word";
                    pre.style.overflow = "auto";
                    pre.style.maxHeight = "48vh";
                    pre.style.background = "#fafafa";
                    pre.style.border = "1px solid #fda4af";
                    pre.style.borderRadius = "10px";
                    pre.style.padding = "12px";
                    pre.style.color = "#7f1d1d";
                    pre.style.fontSize = "12px";
                    pre.style.lineHeight = "1.5";

                    details.appendChild(summary);
                    details.appendChild(pre);

                    const actions = document.createElement("div");
                    actions.style.display = "flex";
                    actions.style.gap = "10px";
                    actions.style.justifyContent = "flex-end";
                    actions.style.flexWrap = "wrap";
                    actions.style.marginTop = "4px";

                    const closeBtn2 = document.createElement("button");
                    closeBtn2.type = "button";
                    closeBtn2.textContent = options.closeLabel || "Fechar";
                    closeBtn2.style.border = "1px solid #991b1b";
                    closeBtn2.style.background = "#fff";
                    closeBtn2.style.color = "#7f1d1d";
                    closeBtn2.style.borderRadius = "10px";
                    closeBtn2.style.padding = "10px 14px";
                    closeBtn2.style.cursor = "pointer";
                    closeBtn2.onclick = handleClose;

                    const retryBtn = document.createElement("button");
                    retryBtn.type = "button";
                    retryBtn.textContent = options.retryLabel || "Tentar novamente";
                    retryBtn.style.border = "1px solid #991b1b";
                    retryBtn.style.background = "#fecaca";
                    retryBtn.style.color = "#7f1d1d";
                    retryBtn.style.borderRadius = "10px";
                    retryBtn.style.padding = "10px 14px";
                    retryBtn.style.cursor = "pointer";
                    retryBtn.onclick = handleRetry;

                    actions.appendChild(closeBtn2);
                    actions.appendChild(retryBtn);

                    bodyGrid.appendChild(messageBox);
                    bodyGrid.appendChild(details);
                    bodyGrid.appendChild(actions);

                    main.appendChild(header);
                    main.appendChild(bodyGrid);
                    overlay.appendChild(main);
                    container.appendChild(overlay);

                    state.mountedMode = "vanilla";
                    return true;
                }

                function show(error, action) {
                    state.currentError = normalizeError(error);
                    state.lastAction = typeof action === "function" ? action : null;

                    if (typeof options.onShow === "function") {
                        try {
                            options.onShow(state.currentError);
                        } catch (_) { }
                    }

                    const ok = typeof KDOM === "object" && KDOM && typeof KDOM.render === "function"
                        ? renderWithKDOM(state.currentError)
                        : false;

                    if (!ok) {
                        renderWithVanilla(state.currentError);
                    }

                    return state.currentError;
                }

                function hide() {
                    destroyContainer();
                }

                function update(error) {
                    return show(error, state.lastAction);
                }

                function isVisible() {
                    return !!state.container;
                }

                window.KDOM_ErrorUI = {
                    show,
                    hide,
                    update,
                    isVisible,
                };

                KDOM.onUnhandledError = (error, context) => {
                    console.error("[KDOM]", error);
                    window.KDOM_ErrorUI.show(error);
                };

                return function uninstall() {
                    hide();
                    if (window.KDOM_ErrorUI) {
                        delete window.KDOM_ErrorUI;
                    }
                };
            },
        };

        return addon;
    }

    window.KDOM_Addons = window.KDOM_Addons || [];
    window.KDOM_Addons.push(
        createErrorUIAddon({
            id: "kdom-error-ui",
            name: "KDOM Error UI",
            version: "1.0.0",
        })
    );

    if (window.KDOM && typeof window.KDOM.useAddon === "function") {
        window.KDOM.useAddon(window.KDOM_Addons[window.KDOM_Addons.length - 1]);
    } else if (window.KDOM_AddonAPI && typeof window.KDOM_AddonAPI.use === "function") {
        window.KDOM_AddonAPI.use(window.KDOM_Addons[window.KDOM_Addons.length - 1]);
    }
})();