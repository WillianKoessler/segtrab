import { useEffect, useMemo, useState } from "react";

import { Button } from "#components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError, } from "#components/ui/field";
import { Input } from "#components/ui/input";
import { Textarea } from "#components/ui/textarea";
import { Switch } from "#components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "#components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "#components/ui/select";
import { getClient } from "#api/clients";
import { DocumentInput } from "#components/ui/DocumentInput";
import { toast } from "sonner";

/**
 * --------
 * Cadastro
 * --------
 *
 * doctype = tipo de documento/cadastro
 * person_type   = natureza do cliente
 *
 * CNO pode pertencer a PF ou PJ.
 * CEI é mantido apenas para compatibilidade com cadastros antigos.
 */
const DOCTYPES = {
    cpf: {
        label: "CPF",
        personType: "person",
        nameLabel: "Nome completo",
        showSocialName: false,
    },

    cnpj: {
        label: "CNPJ",
        personType: "company",
        nameLabel: "Razão social",
        showSocialName: true,
    },

    caepf: {
        label: "CAEPF",
        personType: "person",
        nameLabel: "Nome completo",
        showSocialName: false,
    },

    cno: {
        label: "CNO",
        personType: null,
        nameLabel: "Nome da obra",
        showSocialName: false,
    },

    cei: {
        label: "CEI",
        personType: null,
        nameLabel: "Nome",
        showSocialName: false,
        legacy: true,
    },
};

const emptyForm = {
    person_type: "",
    doctype: "",

    name: "",
    trade_name: "",
    document: "",
    email: "",
    phone: "",
    is_active: true,
    notes: "",

    financial: {
        billing_name: "",
        billing_email: "",
        payment_terms_days: "",
        notes: "",
    },

    sst: {
        technical_responsible: "",
        service_status: "",
        notes: "",
    },

    clinical: {
        responsible_contact: "",
        notes: "",
    },

    engineering: {
        technical_responsible: "",
        service_status: "",
        notes: "",
    },
};

const DOCTYPES_BY_PERSON = {
    person: ["cpf", "caepf", "cno", "cei"],
    company: ["cnpj", "cno", "cei"],
};

function getDocumentConfig(type) {
    return DOCTYPES[type] ?? null;
}

function getDefaultPersonType(documentType) {
    return getDocumentConfig(documentType)?.personType ?? "";
}

function mergeForm(data) {
    const documentType =
        data?.doctype ??
        data?.type ??
        "";

    const personType =
        data?.person_type ??
        getDefaultPersonType(documentType);

    return {
        ...emptyForm,
        ...data,

        person_type: personType,
        doctype: documentType,

        financial: {
            ...emptyForm.financial,
            ...(data?.financial ?? {}),
        },

        sst: {
            ...emptyForm.sst,
            ...(data?.sst ?? {}),
        },

        clinical: {
            ...emptyForm.clinical,
            ...(data?.clinical ?? {}),
        },

        engineering: {
            ...emptyForm.engineering,
            ...(data?.engineering ?? {}),
        },
    };
}

export default function ClienteForm({ client = null, item = null, onSubmit, onConfirm }) {
    if (!onSubmit)
        throw new Error("Este formulário precisa receber a funcão onSubmit.");

    client = client ?? item;
    const isEdit = !!client;

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Configuração do documento atual.
     */
    const documentConfig = useMemo(
        () => getDocumentConfig(form.doctype),
        [form.doctype]
    );

    /**
     * Tipos de documento disponíveis para a natureza escolhida.
     */
    const availableDocumentTypes = useMemo(() => {
        if (!form.person_type) {
            return [];
        }

        return DOCTYPES_BY_PERSON[form.person_type] ?? [];
    }, [form.person_type]);

    /**
     * Atualiza campo principal.
     */
    const setField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    /**
     * Atualiza campo de módulo.
     */
    const setModuleField = (module, field, value) => {
        setForm((current) => ({
            ...current,
            [module]: {
                ...current[module],
                [field]: value,
            },
        }));
    };

    /**
     * Alteração da natureza do cliente.
     *
     * Limpa o documento quando o tipo atual não é compatível
     * com a nova natureza.
     */
    const handlePersonTypeChange = (personType) => {
        setForm((current) => {
            const currentDocument = getDocumentConfig(
                current.doctype
            );

            const isCompatible =
                currentDocument &&
                (
                    currentDocument.personType === null ||
                    currentDocument.personType === personType
                );

            return {
                ...current,
                person_type: personType,

                doctype: isCompatible
                    ? current.doctype
                    : "",

                document: isCompatible
                    ? current.document
                    : "",

                name: isCompatible
                    ? current.name
                    : "",

                trade_name:
                    personType === "company"
                        ? current.trade_name
                        : "",
            };
        });
    };

    /**
     * Alteração do tipo de documento.
     */
    const handleDocumentTypeChange = (documentType) => {
        const config = getDocumentConfig(documentType);

        setForm((current) => ({
            ...current,

            doctype: documentType,

            person_type:
                config?.personType ??
                current.person_type,

            trade_name:
                config?.showSocialName
                    ? current.trade_name
                    : "",
        }));
    };

    /**
     * Obtém erro de campo principal.
     */
    const getError = (field) => {
        const value = error?.fields?.[field];

        if (!value) {
            return null;
        }

        return Array.isArray(value)
            ? value.map((message) => ({ message }))
            : [{ message: String(value) }];
    };

    /**
     * Obtém erro de campo pertencente a módulo.
     */
    const getModuleError = (module, field) => {
        const value =
            error?.fields?.[`${module}.${field}`] ??
            error?.fields?.[module]?.[field];

        if (!value) {
            return null;
        }

        return Array.isArray(value)
            ? value.map((message) => ({ message }))
            : [{ message: String(value) }];
    };

    /**
     * Envia ao servidor.
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError(null);

            // const {
            //     trade_name: tradeName,
            //     ...form
            // } = formPayload;

            const payload = {
                ...form,
                // ...formPayload,

                // social_name: tradeName,

                // Compatibilidade caso seu backend ainda use "type".
                type: form.doctype,

                financial: {
                    ...form.financial,

                    payment_terms_days:
                        form.financial.payment_terms_days === ""
                            ? null
                            : Number(
                                form.financial.payment_terms_days
                            ),
                },
            };

            // if (isEdit) await updateClient(client?.id, payload);
            // else  await createClient(payload);

            await onSubmit(payload);

            onConfirm?.();
        } catch (error) {
            console.error(error);

            setError({
                message:
                    error.message ||
                    "Não foi possível salvar o cliente.",

                fields:
                    error.data?.data ?? {},
            });
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Carrega cliente.
     */
    useEffect(() => {
        if (!isEdit) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                const response = await getClient(client?.id);
                setForm(mergeForm(response));
            } catch (error) {
                console.error(error);
                toast.error(error.message || "Não foi possível carregar as informações do cliente.");
                setError({
                    message: error.message || "Não foi possível carregar o cliente.",
                    fields: error.data?.data ?? {},
                });
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [client, isEdit]);

    if (loading)
        return <div className="py-12 text-center text-sm text-muted-foreground">Carregando cliente...</div>;

    return (
        <form onSubmit={handleSubmit} className="grid gap-6" >
            <Tabs defaultValue="data" className="w-full" >
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="data">Dados</TabsTrigger>
                    <TabsTrigger value="financial" disabled={!form.doctype} >Financeiro</TabsTrigger>
                    <TabsTrigger value="sst" disabled={!form.doctype} >SST</TabsTrigger>
                    <TabsTrigger value="clinical" disabled={!form.doctype} >Clínica</TabsTrigger>
                    <TabsTrigger value="engineering" disabled={!form.doctype} >Engenharia</TabsTrigger>
                    <TabsTrigger value="debug">Debug</TabsTrigger>
                </TabsList>

                {/* DADOS */}
                <TabsContent value="data" className="mt-6 grid gap-4 px-4" >
                    <FieldGroup className="flex flex-col sm:flex-row gap-4">
                        {/* Ativo */}
                        <Field orientation="vertical" className="min-w-20 w-fit sm:justify-center mx-4">
                            <FieldLabel htmlFor="is_active" className="flex-none!">Cliente ativo</FieldLabel>
                            <Switch id="is_active" checked={form.is_active} onCheckedChange={(value) => setField("is_active", value)} />
                        </Field>

                        {/* Natureza */}
                        <Field data-invalid={!!getError("person_type")} >
                            <FieldLabel>Tipo de pessoa</FieldLabel>
                            <Select value={form.person_type} onValueChange={handlePersonTypeChange} >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o tipo de pessoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="person">Pessoa Física</SelectItem>
                                    <SelectItem value="company">Pessoa Jurídica</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError errors={getError("person_type")} />
                        </Field>

                        {/* Documento */}
                        <Field data-invalid={!!getError("doctype")} >
                            <FieldLabel>Documento / cadastro</FieldLabel>
                            <Select value={form.doctype} onValueChange={handleDocumentTypeChange} disabled={!form.person_type} >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={form.person_type ? "Selecione o documento" : "Selecione primeiro o tipo de pessoa"} />
                                </SelectTrigger>
                                <SelectContent> {
                                    availableDocumentTypes.map((type) => {
                                        const config = getDocumentConfig(type);
                                        return (
                                            <SelectItem key={type} value={type} >
                                                {config.label}
                                                {config.legacy
                                                    ? " (legado)"
                                                    : ""} </SelectItem>);
                                    })}
                                </SelectContent>
                            </Select>
                            <FieldError errors={getError("doctype")} />
                        </Field>
                    </FieldGroup>

                    <FieldGroup className="grid gap-4 sm:grid-cols-2">
                        {documentConfig && (<>
                            {/* Nome */}
                            <Field data-invalid={!!getError("name")} >
                                <FieldLabel htmlFor="name"> {documentConfig.nameLabel}
                                </FieldLabel>
                                <Input id="name" value={form.name} onChange={event => setField("name", event.target.value)} aria-invalid={!!getError("name")} />
                                <FieldError errors={getError("name")} />
                            </Field>

                            {/* Nome fantasia */}
                            {documentConfig.showSocialName && (
                                <Field data-invalid={!!getError("trade_name")} >
                                    <FieldLabel htmlFor="trade_name">Nome fantasia</FieldLabel>
                                    <Input id="trade_name" value={form.trade_name} onChange={event => setField("trade_name", event.target.value)} aria-invalid={!!getError("trade_name")} />
                                    <FieldError errors={getError("trade_name")} />
                                </Field>
                            )}

                            {/* Documento */}
                            <Field data-invalid={!!getError("document")} >
                                <FieldLabel htmlFor="document">{documentConfig.label}</FieldLabel>
                                <DocumentInput id="document" type={form.doctype} value={form.document} onChange={value => setField("document", value)} aria-invalid={!!getError("document")} />
                                <FieldError errors={getError("document")} />
                            </Field>

                            {/* E-mail */}
                            <Field data-invalid={!!getError("email")} >
                                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                                <Input id="email" type="email" value={form.email} onChange={event => setField("email", event.target.value)} aria-invalid={!!getError("email")} />
                                <FieldError errors={getError("email")} />
                            </Field>

                            {/* Telefone */}
                            <Field data-invalid={!!getError("phone")} >
                                <FieldLabel htmlFor="phone"> Telefone
                                </FieldLabel>
                                <Input id="phone" value={form.phone} onChange={event => setField("phone", event.target.value)} aria-invalid={!!getError("phone")} />
                                <FieldError errors={getError("phone")} />
                            </Field>
                        </>)}
                    </FieldGroup> {documentConfig && (
                        <Field data-invalid={!!getError("notes")} >
                            <FieldLabel htmlFor="notes"> Observações
                            </FieldLabel>
                            <Textarea id="notes" value={form.notes} onChange={event => setField("notes", event.target.value)} aria-invalid={!!getError("notes")} />
                            <FieldError errors={getError("notes")} />
                        </Field>)}
                </TabsContent>

                {/* FINANCEIRO */}
                <TabsContent value="financial" className="mt-6 grid gap-4" >
                    <FieldGroup className="grid gap-4 sm:grid-cols-2">
                        <Field data-invalid={!!getModuleError("financial", "billing_name")} >
                            <FieldLabel>Nome para faturamento</FieldLabel>
                            <Input value={form.financial.billing_name} onChange={event => setModuleField("financial", "billing_name", event.target.value)} aria-invalid={!!getModuleError("financial", "billing_name")} />
                            <FieldError errors={getModuleError("financial", "billing_name")} />
                        </Field>
                        <Field data-invalid={!!getModuleError("financial", "billing_email")} >
                            <FieldLabel>E-mail de faturamento</FieldLabel>
                            <Input type="email" value={form.financial.billing_email} onChange={event => setModuleField("financial", "billing_email", event.target.value)} aria-invalid={!!getModuleError("financial", "billing_email")} />
                            <FieldError errors={getModuleError("financial", "billing_email")} />
                        </Field>
                        <Field data-invalid={!!getModuleError("financial", "payment_terms_days")} >
                            <FieldLabel>Prazo de pagamento (dias)</FieldLabel>
                            <Input type="number" min="0" max="365" value={form.financial.payment_terms_days} onChange={event => setModuleField("financial", "payment_terms_days", event.target.value)} aria-invalid={!!getModuleError("financial", "payment_terms_days")} />
                            <FieldError errors={getModuleError("financial", "payment_terms_days")} />
                        </Field>
                    </FieldGroup>
                    <Field data-invalid={!!getModuleError("financial", "notes")} >
                        <FieldLabel>Observações</FieldLabel>
                        <Textarea value={form.financial.notes} onChange={event => setModuleField("financial", "notes", event.target.value)} aria-invalid={!!getModuleError("financial", "notes")} />
                        <FieldError errors={getModuleError("financial", "notes")} />
                    </Field>
                </TabsContent>

                {/* SST */}
                <TabsContent value="sst" className="mt-6 grid gap-4" >
                    <FieldGroup className="grid gap-4 sm:grid-cols-2">
                        <Field data-invalid={!!getModuleError("sst", "technical_responsible")} >
                            <FieldLabel>Responsável técnico</FieldLabel>
                            <Input value={form.sst.technical_responsible} onChange={event => setModuleField("sst", "technical_responsible", event.target.value)} aria-invalid={!!getModuleError("sst", "technical_responsible")} />
                            <FieldError errors={getModuleError("sst", "technical_responsible")} />
                        </Field>
                        <Field data-invalid={!!getModuleError("sst", "service_status")} >
                            <FieldLabel>Status do serviço</FieldLabel>
                            <Input value={form.sst.service_status} onChange={event => setModuleField("sst", "service_status", event.target.value)} aria-invalid={!!getModuleError("sst", "service_status")} />
                            <FieldError errors={getModuleError("sst", "service_status")} />
                        </Field>
                    </FieldGroup>
                    <Field data-invalid={!!getModuleError("sst", "notes")} >
                        <FieldLabel>Observações</FieldLabel>
                        <Textarea value={form.sst.notes} onChange={event => setModuleField("sst", "notes", event.target.value)} aria-invalid={!!getModuleError("sst", "notes")} />
                        <FieldError errors={getModuleError("sst", "notes")} />
                    </Field>
                </TabsContent>

                {/* CLÍNICA */}
                <TabsContent value="clinical" className="mt-6 grid gap-4" >
                    <Field data-invalid={!!getModuleError("clinical", "responsible_contact")} >
                        <FieldLabel>Contato responsável</FieldLabel>
                        <Input value={form.clinical.responsible_contact} onChange={event => setModuleField("clinical", "responsible_contact", event.target.value)} aria-invalid={!!getModuleError("clinical", "responsible_contact")} />
                        <FieldError errors={getModuleError("clinical", "responsible_contact")} />
                    </Field>
                    <Field data-invalid={!!getModuleError("clinical", "notes")} >
                        <FieldLabel>Observações</FieldLabel>
                        <Textarea value={form.clinical.notes} onChange={event => setModuleField("clinical", "notes", event.target.value)} aria-invalid={!!getModuleError("clinical", "notes")} />
                        <FieldError errors={getModuleError("clinical", "notes")} />
                    </Field>
                </TabsContent>

                {/* ENGENHARIA */}
                <TabsContent value="engineering" className="mt-6 grid gap-4" >
                    <FieldGroup className="grid gap-4 sm:grid-cols-2">
                        <Field data-invalid={!!getModuleError("engineering", "technical_responsible")} >
                            <FieldLabel>Responsável técnico</FieldLabel>
                            <Input value={form.engineering.technical_responsible} onChange={event => setModuleField("engineering", "technical_responsible", event.target.value)} aria-invalid={!!getModuleError("engineering", "technical_responsible")} />
                            <FieldError errors={getModuleError("engineering", "technical_responsible")} />
                        </Field>
                        <Field data-invalid={!!getModuleError("engineering", "service_status")} >
                            <FieldLabel>Status do serviço</FieldLabel>
                            <Input value={form.engineering.service_status} onChange={event => setModuleField("engineering", "service_status", event.target.value)} aria-invalid={!!getModuleError("engineering", "service_status")} />
                            <FieldError errors={getModuleError("engineering", "service_status")} />
                        </Field>
                    </FieldGroup>
                    <Field data-invalid={!!getModuleError("engineering", "notes")} >
                        <FieldLabel>Observações</FieldLabel>
                        <Textarea value={form.engineering.notes} onChange={event => setModuleField("engineering", "notes", event.target.value)} aria-invalid={!!getModuleError("engineering", "notes")} />
                        <FieldError errors={getModuleError("engineering", "notes")} />
                    </Field>
                </TabsContent>

                <TabsContent value="debug" className="mt-6">
                    <pre>{JSON.stringify(form, null, 4)}</pre>
                </TabsContent>
            </Tabs>

            {/* ACTIONS */}
            <div className={`flex ${error ? "items-start justify-between gap-4" : "justify-end"}`} >
                {error && <div className="max-w-xl rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error.message}</div>}
                <Button type="submit" disabled={submitting || !form.person_type || !form.doctype} >
                    {submitting
                        ? "Salvando..."
                        : isEdit
                            ? "Salvar alterações"
                            : "Criar cliente"}
                </Button>
            </div>
        </form>
    );
}
