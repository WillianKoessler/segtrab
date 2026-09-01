import { useState } from "react";
import { Shield, Trash2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./section";
import { Field } from "./field";

const initialSecurity = {
    twoFactor: true,
    loginAlerts: true,
    sessionTimeout: "30",
};

export function Security() {
    const [security, setSecurity] = useState(initialSecurity);

    return (
        <>
            <SettingsSection
                icon={Shield}
                title="Security"
                description="Protect your account and control access to your workspace."
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <div className="font-medium">Two-factor authentication</div>
                            <div className="text-sm text-muted-foreground">
                                Add an extra layer of protection.
                            </div>
                        </div>
                        <Switch
                            checked={security.twoFactor}
                            onCheckedChange={(checked) =>
                                setSecurity((prev) => ({ ...prev, twoFactor: checked }))
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <div className="font-medium">Login alerts</div>
                            <div className="text-sm text-muted-foreground">
                                Notify you when a new device logs in.
                            </div>
                        </div>
                        <Switch
                            checked={security.loginAlerts}
                            onCheckedChange={(checked) =>
                                setSecurity((prev) => ({ ...prev, loginAlerts: checked }))
                            }
                        />
                    </div>

                    <Field label="Session timeout" hint="Minutes of inactivity before auto logout.">
                        <Input
                            type="number"
                            min="5"
                            step="5"
                            value={security.sessionTimeout}
                            onChange={(e) =>
                                setSecurity((prev) => ({ ...prev, sessionTimeout: e.target.value }))
                            }
                        />
                    </Field>

                    <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 font-medium">
                            <KeyRound className="h-4 w-4" />
                            Password
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update your password regularly to keep your account safe.
                        </p>
                        <Button variant="outline" className="mt-4">
                            Change password
                        </Button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Trash2}
                title="Danger zone"
                description="Irreversible actions for your account and workspace."
                action={
                    <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Deactivate account
                    </Button>
                }
            >
                <Separator className="mb-4" />
                <p className="text-sm text-muted-foreground">
                    Deactivating your account will sign you out and disable access to the dashboard.
                    This action can be reversed by an administrator.
                </p>
            </SettingsSection>
        </>
    );
}