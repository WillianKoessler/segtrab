import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const rows = [
    { id: 1, name: "Acme Ltda", email: "financeiro@acme.com", status: "Active" },
    { id: 2, name: "Blue Market", email: "contato@bluemarket.com", status: "Pending" },
];

export default function ClientListPage() {
    return (
        <section className="grid gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage customer records.
                    </p>
                </div>

                <Button asChild>
                    <Link to="new">New customer</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer list</CardTitle>
                    <CardDescription>
                        All registered customers in the system.
                    </CardDescription>
                </CardHeader>

                <CardContent>
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
                                        <div className="inline-flex gap-3">
                                            <Link
                                                className="text-sm underline-offset-4 hover:underline"
                                                to={`${row.id}`}
                                            >
                                                View
                                            </Link>
                                            <Link
                                                className="text-sm underline-offset-4 hover:underline"
                                                to={`${row.id}/edit`}
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </section>
    );
}