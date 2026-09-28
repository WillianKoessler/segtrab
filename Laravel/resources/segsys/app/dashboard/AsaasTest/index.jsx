import { useState } from "react";
import { Landmark, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#components/ui/card";
import { Separator } from "#components/ui/separator";
import {
    getAsaasSettings,
    getFinanceBalance,
} from "#api/integrations";

export default function AsaasTestPage() {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(null);
    const [settings, setSettings] = useState(null);

    async function testBalance() {
        setLoading(true);
        setBalance(null);

        try {
            const configResponse = await getAsaasSettings();
            setSettings(configResponse.data);

            if (!configResponse.data?.api_key_configured) {
                toast.error("A conta Asaas ainda não está configurada.");
                return;
            }

            toast.promise(
                getFinanceBalance().then(
                    value => setBalance(value.data)
                ), {
                loading: "Consultando saldo no Asaas...",
                success: "Saldo obtido com sucesso.",
                error: error => error.message,
            });
        } catch (error) {
            console.error(error);
            // toast.promise handles request errors.
        } finally {
            setLoading(false);
        }
    }

    const amount = balance?.amount ?? null;
    const currency = balance?.currency ?? "BRL";

    const formattedAmount = amount === null
        ? "—"
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency,
        }).format(amount);

    return (
        <section className="mx-auto grid w-full max-w-5xl gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Teste do Asaas</h1>
                <p className="text-sm text-muted-foreground">Página de homologação para validar a comunicação do módulo financeiro com o Asaas.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/40">
                                <Landmark className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div>
                                <CardTitle>Saldo da conta</CardTitle>
                                <CardDescription>
                                    Consulta o saldo atual da conta Asaas através do backend do Segtrab.
                                </CardDescription>
                            </div>
                        </div>

                        <Badge variant="outline" className="gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Chave protegida
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-6">
                    <div className="rounded-xl border bg-muted/20 p-6">
                        <div className="text-sm text-muted-foreground">Saldo disponível</div>
                        <div className="mt-2 text-4xl font-semibold tracking-tight">{formattedAmount}</div>

                        {settings && (
                            <div className="mt-3 text-sm text-muted-foreground">
                                Ambiente: {settings.environment === "production"
                                    ? "Produção"
                                    : "Sandbox"}
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                        <Button onClick={testBalance} disabled={loading} >
                            <RefreshCw className={loading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
                            {loading
                                ? "Consultando..."
                                : "Consultar saldo"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
