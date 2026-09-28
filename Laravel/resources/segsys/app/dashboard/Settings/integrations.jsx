import { useEffect, useState } from "react";
import { CheckCircle2, Landmark, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "./section";
import { Field } from "./field";
import {
    getAsaasSettings,
    updateAsaasSettings,
} from "#api/integrations";

export function Integrations() {
    const [form, setForm] = useState({
        environment: "sandbox",
        api_key: "",
        is_active: true,
    });

    const [configured, setConfigured] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const response = await getAsaasSettings();
                const data = response.data;

                setConfigured(Boolean(data.api_key_configured));
                setForm({
                    environment: data.environment ?? "sandbox",
                    api_key: "",
                    is_active: data.is_active ?? true,
                });
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    async function save() {
        setSaving(true);

        try {
            const payload = {
                environment: form.environment,
                is_active: form.is_active,
            };

            if (form.api_key.trim()) {
                payload.api_key = form.api_key.trim();
            }

            await toast.promise(
                updateAsaasSettings(payload),
                {
                    loading: "Salvando configuração do Asaas...",
                    success: "Configuração do Asaas salva.",
                    error: error => error.message,
                }
            );

            setConfigured(true);
            setForm(current => ({
                ...current,
                api_key: "",
            }));
        } catch (error) {
            // toast.promise already displayed the error.
        } finally {
            setSaving(false);
        }
    }

    return (
        <SettingsSection
            icon={Landmark}
            title="Asaas"
            description="Configure a conta Asaas utilizada pelo módulo financeiro. A chave nunca é enviada ao frontend."
        >
            {loading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                    Carregando configuração...
                </div>
            ) : (
                <div className="grid gap-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                {configured ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : (
                                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>

                            <div>
                                <div className="font-medium">
                                    {configured
                                        ? "Conta configurada"
                                        : "Conta não configurada"}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    {configured
                                        ? "As credenciais ficam armazenadas de forma criptografada no backend."
                                        : "Informe uma chave de API para ativar a integração."}
                                </div>
                            </div>
                        </div>

                        <Badge variant={configured ? "default" : "secondary"}>
                            {configured ? "Configurado" : "Pendente"}
                        </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field
                            label="Ambiente"
                            hint="A chave Sandbox não funciona na Produção e vice-versa."
                        >
                            <Select
                                value={form.environment}
                                onValueChange={value =>
                                    setForm(current => ({
                                        ...current,
                                        environment: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="sandbox">
                                        Sandbox
                                    </SelectItem>
                                    <SelectItem value="production">
                                        Produção
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field
                            label="Chave de API"
                            hint={configured
                                ? "Deixe vazio para manter a chave atual."
                                : "A chave é criada no painel de Integrações do Asaas."}
                        >
                            <Input
                                type="text"
                                autocomplete="off"
                                className="masked"
                                value={form.api_key}
                                onChange={event =>
                                    setForm(current => ({
                                        ...current,
                                        api_key: event.target.value,
                                    }))
                                }
                                placeholder={configured
                                    ? "Chave já configurada"
                                    : "$aact_hmlg_..."}
                            />
                        </Field>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <div className="font-medium">
                                Integração ativa
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Quando desativada, o Segtrab não utilizará essa conta como provedor financeiro.
                            </div>
                        </div>

                        <Switch
                            checked={form.is_active}
                            onCheckedChange={checked =>
                                setForm(current => ({
                                    ...current,
                                    is_active: checked,
                                }))
                            }
                        />
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="outline" asChild>
                            <Link to="/asaas-tester">
                                Testar integração
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        <Button
                            onClick={save}
                            disabled={saving}
                        >
                            {saving ? "Salvando..." : "Salvar configuração"}
                        </Button>
                    </div>
                </div>
            )}
        </SettingsSection>
    );
}
