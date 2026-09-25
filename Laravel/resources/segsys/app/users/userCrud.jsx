import { Badge } from "#components/ui/badge";

import UserFormPage from "./UserFormPage";

export function createUserCrudSpec({
    resource,
    availableRoles = [],
}) {
    return {
        title: "Usuários",
        description: "Gerencie as contas de acesso ao sistema.",

        resource,

        labels: {
            singular: "usuário",
            plural: "usuários",
            create: "Novo usuário",
            listTitle: "Contas de Acesso",
            listDescription: "Usuários cadastrados no sistema.",
            deleteTitle: "Deletar usuário",
            deleteDescription:
                "Esta ação irá apagar permanentemente este usuário e não poderá ser desfeita.",
            delete: "Deletar usuário",
        },

        search: {
            enabled: true,
            placeholder: "Pesquisar usuários...",
        },

        table: {
            perPage: 15,
        },

        columns: [
            {
                key: "name",
                header: "Usuário",
                render: value => (
                    <span className="font-medium">{value}</span>
                ),
            },
            {
                key: "email",
                header: "E-mail",
            },
            {
                key: "roles",
                header: "Grupo",
                render: (_, user) => (
                    <div className="flex max-w-40 flex-wrap gap-1">
                        {user.roles?.map(role => (
                            <Badge key={role}>{role}</Badge>
                        ))}
                    </div>
                ),
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
            component: UserFormPage,
            createTitle: "Novo usuário",
            editTitle: "Editar usuário",
            description: "Atualize os dados da conta de acesso.",
            props: {
                availableRoles,
            },
        },

        getItemKey: user => user.id,
    };
}