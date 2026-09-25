import { Bell, Building2, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Company } from "./company";
import { Notification } from "./notification";
import { Security } from "./security";

export default function SettingsPage() {

    const handleSave = () => {
        console.log("Save settings", {
            // profile,
            // company,
            // notifications,
            // security,
            // appearance,
        });
    };

    return (
        <section className="grid gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
                    <p className="text-sm text-muted-foreground">
                        Configure suas notificações e segurança.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1.5">
                        <Shield className="h-3.5 w-3.5" />
                        Secure workspace
                    </Badge>
                    <Button onClick={handleSave}>Save changes</Button>
                </div>
            </div>

            <Tabs defaultValue="geral" className="w-full">
                <TabsList className="w-full flex flex-nowrap justify-evenly">
                    <TabsTrigger value="geral" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        Geral
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notificações
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Segurança
                    </TabsTrigger>
                </TabsList>


                <TabsContent value="geral" className="m-1 space-y-6">
                    <Company />
                </TabsContent>

                <TabsContent value="notifications" className="m-1 space-y-6">
                    <Notification />
                </TabsContent>

                <TabsContent value="security" className="m-1 space-y-6">
                    <Security />
                </TabsContent>
            </Tabs>
        </section>
    );
}