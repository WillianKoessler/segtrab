import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
    { label: "Customers", value: "128" },
    { label: "Orders", value: "42" },
    { label: "Revenue", value: "R$ 18.450" },
    { label: "Open tasks", value: "7" },
];

export default function DashboardHome() {
    return (
        <section className="grid gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Visão geral do sistema</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <Card key={item.label}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {item.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-semibold tracking-tight">
                                {item.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}