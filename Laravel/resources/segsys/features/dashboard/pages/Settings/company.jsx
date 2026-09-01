import { useState } from "react";
import { Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingsSection } from "./section";
import { Field } from "./field";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const initialCompany = {
    companyName: "My ERP LTDA",
    taxId: "12.345.678/0001-90",
    currency: "BRL",
    timezone: "America/Sao_Paulo",
    address: "Av. Paulista, 1000 - São Paulo, SP",
};

const rows = [
    { id: 1, name: "Acme Ltda", email: "financeiro@acme.com", status: "Active" },
    { id: 2, name: "Blue Market", email: "contato@bluemarket.com", status: "Pending" },
];

export function Company() {
    const [company, setCompany] = useState(initialCompany);

    return (
        <>
            <SettingsSection
                icon={Building2}
                title="Organization details"
                description="Company settings used across invoices, reports and internal records."
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Company name">
                        <Input
                            value={company.companyName}
                            onChange={(e) =>
                                setCompany((prev) => ({ ...prev, companyName: e.target.value }))
                            }
                            placeholder="Company name"
                        />
                    </Field>

                    <Field label="Tax ID / CNPJ">
                        <Input
                            value={company.taxId}
                            onChange={(e) =>
                                setCompany((prev) => ({ ...prev, taxId: e.target.value }))
                            }
                            placeholder="00.000.000/0001-00"
                        />
                    </Field>

                    <Field label="Currency">
                        <Input
                            value={company.currency}
                            onChange={(e) =>
                                setCompany((prev) => ({ ...prev, currency: e.target.value }))
                            }
                            placeholder="BRL"
                        />
                    </Field>

                    <Field label="Timezone">
                        <Input
                            value={company.timezone}
                            onChange={(e) =>
                                setCompany((prev) => ({ ...prev, timezone: e.target.value }))
                            }
                            placeholder="America/Sao_Paulo"
                        />
                    </Field>

                    <div className="md:col-span-2">
                        <Field label="Business address">
                            <Textarea
                                value={company.address}
                                onChange={(e) =>
                                    setCompany((prev) => ({ ...prev, address: e.target.value }))
                                }
                                placeholder="Street, city, state"
                            />
                        </Field>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={User}
                title="Usuários"
                description="Gerencie os usuários do sistema."
                action={<Button variant="outline">Adicionar Usuário</Button>}
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell className="text-right">
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </SettingsSection>
        </>
    );
}