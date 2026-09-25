import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "#components/ui/card";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "#components/ui/field";
import { Input } from "#components/ui/input";
import { Button } from "#components/ui/button";
import { Textarea } from "#components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#components/ui/select";
import { Badge } from "#components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "#components/ui/tabs";
import {
    Trash2,
    Plus,
    Send,
    Loader2,
    Copy,
    Check,
} from "lucide-react";
import { getStoredToken } from "#lib/api";

const METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
];

export function TesterPage() {
    const [method, setMethod] = useState("GET");
    const [endpoint, setEndpoint] = useState("");

    const [queryParams, setQueryParams] = useState([
        { id: 1, key: "", value: "" },
    ]);

    const [headers, setHeaders] = useState([
        {
            id: 1,
            key: "Content-Type",
            value: "application/json",
        },
    ]);

    const [body, setBody] = useState("");

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [copied, setCopied] = useState(false);

    const addQueryParam = () => {
        setQueryParams((current) => [
            ...current,
            {
                id: Date.now(),
                key: "",
                value: "",
            },
        ]);
    };

    const removeQueryParam = (id) => {
        setQueryParams((current) =>
            current.filter((param) => param.id !== id)
        );
    };

    const updateQueryParam = (
        id,
        field,
        value
    ) => {
        setQueryParams((current) =>
            current.map((param) =>
                param.id === id
                    ? { ...param, [field]: value }
                    : param
            )
        );
    };

    const addHeader = () => {
        setHeaders((current) => [
            ...current,
            {
                id: Date.now(),
                key: "",
                value: "",
            },
        ]);
    };

    const removeHeader = (id) => {
        setHeaders((current) =>
            current.filter((header) => header.id !== id)
        );
    };

    const updateHeader = (
        id,
        field,
        value,
    ) => {
        setHeaders((current) =>
            current.map((header) =>
                header.id === id
                    ? { ...header, [field]: value }
                    : header
            )
        );
    };

    const performAction = async e => {
        e.preventDefault();

        if (!endpoint.trim()) {
            return;
        }

        setLoading(true);
        setResponse(null);

        try {
            const url = new URL(
                endpoint,
                window.location.origin
            );

            queryParams.forEach(({ key, value }) => {
                if (key.trim()) {
                    url.searchParams.set(key, value);
                }
            });

            const requestHeaders = {};

            headers.forEach(({ key, value }) => {
                if (key.trim()) {
                    requestHeaders[key] = value;
                }
            });

            const token = getStoredToken();
            requestHeaders.Authorization = `Bearer ${token}`;

            const startedAt = performance.now();

            const result = await fetch(url.toString(), {
                method,
                headers: requestHeaders,
                body:
                    method === "GET" || method === "DELETE"
                        ? undefined
                        : body || undefined,
            });

            const duration = Math.round(
                performance.now() - startedAt
            );

            const responseText = await result.text();

            const responseHeaders = {};

            result.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            setResponse({
                status: result.status,
                statusText: result.statusText,
                duration,
                headers: responseHeaders,
                body: formatResponseBody(responseText),
            });
        } catch (error) {
            setResponse({
                status: 0,
                statusText: "Request failed",
                duration: 0,
                headers: {},
                body:
                    error instanceof Error
                        ? error.message
                        : String(error),
            });
        } finally {
            setLoading(false);
        }
    };

    const copyResponse = async () => {
        if (!response?.body) {
            return;
        }

        await navigator.clipboard.writeText(response.body);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <form onSubmit={performAction}>
                <FieldSet>
                    <FieldLegend className="text-2xl">
                        Teste de API
                    </FieldLegend>

                    <FieldDescription>
                        Página utilizada para testar as APIs do sistema.
                    </FieldDescription>

                    <FieldGroup className="gap-6">
                        {/* Endpoint */}
                        <Field>
                            <FieldLabel htmlFor="endpoint">
                                Endpoint
                            </FieldLabel>

                            <FieldContent>
                                <div className="flex gap-2">
                                    <Select
                                        value={method}
                                        onValueChange={setMethod}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {METHODS.map((item) => (
                                                <SelectItem
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        id="endpoint"
                                        value={endpoint}
                                        onChange={(e) =>
                                            setEndpoint(e.target.value)
                                        }
                                        autoComplete="off"
                                        placeholder="/api/teste"
                                        className="font-mono"
                                    />

                                    <Button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !endpoint.trim()
                                        }
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send />
                                                Enviar
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </FieldContent>
                        </Field>

                        {/* Request configuration */}
                        <Card>
                            <CardContent className="p-0">
                                <Tabs defaultValue="query">
                                    <div className="border-b px-4">
                                        <TabsList className="h-12">
                                            <TabsTrigger value="query">
                                                Query
                                                {queryParams.some(
                                                    (p) =>
                                                        p.key.trim()
                                                ) && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-2"
                                                        >
                                                            {
                                                                queryParams.filter(
                                                                    (p) =>
                                                                        p.key.trim()
                                                                ).length
                                                            }
                                                        </Badge>
                                                    )}
                                            </TabsTrigger>

                                            <TabsTrigger value="headers">
                                                Headers
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="body"
                                                disabled={
                                                    method === "GET" ||
                                                    method === "DELETE"
                                                }
                                            >
                                                Body
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    {/* Query params */}
                                    <TabsContent
                                        value="query"
                                        className="m-0 p-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-[1fr_1fr_40px] gap-2">
                                                <span className="text-sm font-medium">
                                                    Key
                                                </span>
                                                <span className="text-sm font-medium">
                                                    Value
                                                </span>
                                            </div>

                                            {queryParams.map((param) => (
                                                <div
                                                    key={param.id}
                                                    className="grid grid-cols-[1fr_1fr_40px] gap-2"
                                                >
                                                    <Input
                                                        value={param.key}
                                                        onChange={(e) =>
                                                            updateQueryParam(
                                                                param.id,
                                                                "key",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="page"
                                                        className="font-mono"
                                                    />

                                                    <Input
                                                        value={param.value}
                                                        onChange={(e) =>
                                                            updateQueryParam(
                                                                param.id,
                                                                "value",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="1"
                                                        className="font-mono"
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeQueryParam(
                                                                param.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addQueryParam}
                                            >
                                                <Plus />
                                                Adicionar parâmetro
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    {/* Headers */}
                                    <TabsContent
                                        value="headers"
                                        className="m-0 p-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-[1fr_1fr_40px] gap-2">
                                                <span className="text-sm font-medium">
                                                    Header
                                                </span>
                                                <span className="text-sm font-medium">
                                                    Value
                                                </span>
                                            </div>

                                            {headers.map((header) => (
                                                <div
                                                    key={header.id}
                                                    className="grid grid-cols-[1fr_1fr_40px] gap-2"
                                                >
                                                    <Input
                                                        value={header.key}
                                                        onChange={(e) =>
                                                            updateHeader(
                                                                header.id,
                                                                "key",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Authorization"
                                                        className="font-mono"
                                                    />

                                                    <Input
                                                        value={header.value}
                                                        onChange={(e) =>
                                                            updateHeader(
                                                                header.id,
                                                                "value",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Bearer ..."
                                                        className="font-mono"
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeHeader(
                                                                header.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addHeader}
                                            >
                                                <Plus />
                                                Adicionar header
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    {/* Body */}
                                    <TabsContent
                                        value="body"
                                        className="m-0 p-4"
                                    >
                                        <Field>
                                            <FieldLabel htmlFor="body">
                                                Request body
                                            </FieldLabel>

                                            <FieldDescription>
                                                Informe o conteúdo enviado
                                                no corpo da requisição.
                                            </FieldDescription>

                                            <Textarea
                                                id="body"
                                                value={body}
                                                onChange={(e) =>
                                                    setBody(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`{
  "name": "John",
  "email": "john@example.com"
}`}
                                                className="min-h-64 resize-y font-mono text-sm"
                                            />
                                        </Field>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </FieldGroup>
                </FieldSet>
            </form>

            {/* Response */}
            <Card className="mt-8 overflow-hidden">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle>Response</CardTitle>

                        {response && (
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        response.status >= 200 &&
                                            response.status < 300
                                            ? "default"
                                            : "destructive"
                                    }
                                    className="font-mono"
                                >
                                    {response.status || "ERROR"}{" "}
                                    {response.statusText}
                                </Badge>

                                {response.status > 0 && (
                                    <span className="text-muted-foreground text-sm">
                                        {response.duration} ms
                                    </span>
                                )}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={copyResponse}
                                    title="Copy response"
                                >
                                    {copied ? (
                                        <Check />
                                    ) : (
                                        <Copy />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {!response ? (
                        <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
                            A resposta da API aparecerá aqui.
                        </div>
                    ) : (
                        <Tabs defaultValue="body">
                            <div className="border-b px-4">
                                <TabsList className="h-12">
                                    <TabsTrigger value="body">
                                        Body
                                    </TabsTrigger>

                                    <TabsTrigger value="headers">
                                        Headers
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent
                                value="body"
                                className="m-0"
                            >
                                <div className="min-h-64 max-h-[600px] overflow-auto bg-muted/30 p-4">
                                    <pre className="whitespace-pre-wrap break-words font-mono text-sm">
                                        {response.body}
                                    </pre>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="headers"
                                className="m-0"
                            >
                                <div className="divide-y">
                                    {Object.entries(
                                        response.headers
                                    ).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="grid grid-cols-[220px_1fr] gap-4 px-4 py-3 font-mono text-sm"
                                        >
                                            <span className="font-medium">
                                                {key}
                                            </span>

                                            <span className="text-muted-foreground break-all">
                                                {value}
                                            </span>
                                        </div>
                                    ))}

                                    {Object.keys(response.headers)
                                        .length === 0 && (
                                            <div className="p-6 text-center text-sm text-muted-foreground">
                                                Nenhum header retornado.
                                            </div>
                                        )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function formatResponseBody(body) {
    if (!body) {
        return "";
    }

    try {
        return JSON.stringify(
            JSON.parse(body),
            null,
            2
        );
    } catch {
        return body;
    }
}
