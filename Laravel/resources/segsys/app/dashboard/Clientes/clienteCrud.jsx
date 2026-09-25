import { Badge } from "#components/ui/badge";
import { formatDocument } from "#lib/document";
import ClienteForm from "./CreateCliente";


export function createClientCrudSpec({ resource }) {
    return {
        title: "Clientes",
        description: "Empresas e pessoas atendidas pela Segtrab.",

        resource,

        labels: {
            singular: "cliente",
            plural: "clientes",
            create: "Novo cliente",
            listTitle: "Clientes cadastrados",
            listDescription: "Cadastros e relacionamentos da empresa.",
            deleteTitle: "Deletar cliente",
            deleteDescription:
                "Esta ação irá apagar permanentemente este cliente e não poderá ser desfeita.",
        },

        search: {
            enabled: true,
            placeholder: "Pesquisar clientes...",
        },

        table: {
            perPage: 15,
            rowClickable: true,
        },

        columns: [
            {
                key: "name",
                header: "Cliente",
                render: (_, client) => client.social_name || client.name || "—",
            },
            {
                key: "document",
                header: "Documento",
                render: (_, client) =>
                    formatDocument(client.document, client.doctype) || "—",
            },
            {
                key: "doctype",
                header: "Tipo",
                render: (_, client) =>
                    client.person_type === "company"
                        ? "PJ"
                        : client.person_type === "person"
                            ? "PF"
                            : client.doctype?.toUpperCase() || "—",
            },
            {
                key: "is_active",
                header: "Status",
                render: value =>
                    value
                        ? <Badge>Ativo</Badge>
                        : <Badge variant="secondary">Inativo</Badge>,
            },
        ],

        form: {
            component: ClienteForm,
            createTitle: "Novo Cliente",
            editTitle: "Editar Cliente",
            description:
                "Atualize os dados cadastrais e os módulos relacionados.",
            dialogClassName:
                "max-h-[90vh] overflow-y-auto sm:max-w-4xl",
        },

        getItemKey: client => client.id,
    };
}