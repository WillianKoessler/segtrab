import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../app/providers/AuthProvider";

function getCaptchaSiteKey() {
    return document.querySelector('meta[name="captcha-site-key"]')?.content ?? "";
}

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, login } = useAuth();

    const captchaRef = useRef(null);
    const widgetIdRef = useRef(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaReady, setCaptchaReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const siteKey = useMemo(getCaptchaSiteKey, []);

    useEffect(() => {
        if (currentUser) {
            navigate("/", { replace: true });
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (!siteKey) {
            return undefined;
        }

        let disposed = false;

        const renderWidget = () => {
            if (
                disposed ||
                !captchaRef.current ||
                !window.turnstile ||
                widgetIdRef.current !== null
            ) {
                return;
            }

            widgetIdRef.current = window.turnstile.render(captchaRef.current, {
                sitekey: siteKey,
                callback: token => {
                    setCaptchaToken(token);
                    setCaptchaReady(true);
                },
                "expired-callback": () => {
                    setCaptchaToken("");
                    setCaptchaReady(false);
                },
                "error-callback": () => {
                    setCaptchaToken("");
                    setCaptchaReady(false);
                },
            });

            setCaptchaReady(false);
        };

        const existing = document.querySelector(
            'script[data-segsys-turnstile="true"]',
        );

        if (window.turnstile) {
            renderWidget();
            return () => {
                disposed = true;
            };
        }

        if (existing) {
            existing.addEventListener("load", renderWidget, { once: true });
        } else {
            const script = document.createElement("script");
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            script.dataset.segsysTurnstile = "true";
            script.addEventListener("load", renderWidget, { once: true });
            document.head.appendChild(script);
        }

        return () => {
            disposed = true;

            if (existing) {
                existing.removeEventListener("load", renderWidget);
            }

            if (widgetIdRef.current !== null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey]);

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await login({
                email,
                password,
                captchaToken,
            });

            const destination =
                location.state?.from?.pathname ?? "/";

            navigate(destination, { replace: true });
        } catch (reason) {
            setError(reason?.message ?? "Não foi possível entrar.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">
            <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8">
                <div className="grid w-full overflow-hidden rounded-3xl border border-black/10 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:grid-cols-2">
                    <div className="flex flex-col justify-evenly bg-gradient-to-br from-slate-100 via-emerald-50 to-teal-100 p-10 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-900 md:p-12">
                        <div>
                            <img
                                src="/assets/img/logo.png"
                                alt="SegSys"
                                className="mx-auto mb-4 w-1/2"
                            />
                            <p className="text-center text-sm font-medium text-emerald-800/90 dark:text-emerald-200/90 sm:text-base">
                                Plataforma corporativa para gestão de SST
                            </p>
                            <p className="mt-8 max-w-md text-sm leading-6 text-slate-800/85 dark:text-slate-200/85 sm:text-base">
                                Gerencie treinamentos, exames ocupacionais,
                                EPIs, inspeções e registros de segurança
                                com acesso protegido e organizado.
                            </p>
                        </div>

                        <div className="mt-8 space-y-3 text-sm text-slate-800/85 dark:text-slate-200/85">
                            <div>✓ Controle de treinamentos e reciclagens</div>
                            <div>✓ Gestão de EPIs e entregas</div>
                            <div>✓ Registros de inspeções e conformidade</div>
                        </div>
                    </div>

                    <div className="bg-slate-50/90 p-8 dark:bg-slate-950/90 sm:p-10 md:p-12">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                SISTEMA SEGSYS
                            </h1>
                            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                                Acesse sua conta para gerenciar processos de
                                segurança do trabalho, conformidade e registros
                                operacionais.
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                    required
                                    autoFocus
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3.5 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/30"
                                    placeholder="seu.nome@empresa.com"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    required
                                    className="w-full rounded-xl border border-black/10 bg-black/5 px-4 py-3.5 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/30"
                                    placeholder="••••••••"
                                />
                            </div>

                            {siteKey && (
                                <div
                                    ref={captchaRef}
                                    className="min-h-[65px]"
                                    aria-label="Verificação de segurança"
                                />
                            )}

                            <button
                                type="submit"
                                disabled={submitting || (Boolean(siteKey) && !captchaReady)}
                                className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                            >
                                {submitting ? "Entrando..." : "Entrar"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
