import { useState } from "react";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SettingsSection } from "./section";
import { Field } from "./field";

const initialNotifications = {
    emailSummary: true,
    newCustomer: true,
    newOrder: true,
    weeklyReport: false,
    systemAlerts: true,
    marketingEmails: false,
};

export function Notification() {
    const [notifications, setNotifications] = useState(initialNotifications);

    return (
        <>
            <SettingsSection
                icon={Bell}
                title="Notification preferences"
                description="Choose which alerts and summaries you want to receive."
            >
                <div className="grid gap-4">
                    {[
                        {
                            key: "emailSummary",
                            label: "Email summary",
                            description: "Receive a daily digest with key activity.",
                        },
                        {
                            key: "newCustomer",
                            label: "New customer",
                            description: "Get notified when a new customer is created.",
                        },
                        {
                            key: "newOrder",
                            label: "New order",
                            description: "Get notified whenever a new order is placed.",
                        },
                        {
                            key: "weeklyReport",
                            label: "Weekly report",
                            description: "Send a weekly performance report by email.",
                        },
                        {
                            key: "systemAlerts",
                            label: "System alerts",
                            description: "Important warnings about system status and errors.",
                        },
                        {
                            key: "marketingEmails",
                            label: "Marketing emails",
                            description: "Receive product updates and feature announcements.",
                        },
                    ].map((item) => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between gap-4 rounded-lg border p-4"
                        >
                            <div className="space-y-1">
                                <div className="font-medium">{item.label}</div>
                                <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                            <Switch
                                checked={notifications[item.key]}
                                onCheckedChange={(checked) =>
                                    setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                                }
                            />
                        </div>
                    ))}
                </div>
            </SettingsSection>
        </>
    )
}