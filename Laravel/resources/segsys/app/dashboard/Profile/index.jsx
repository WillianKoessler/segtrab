import { useState } from "react";
import { User, Camera, Laptop, MoonStar, SunMedium } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "#components/ui/separator";
import { useTheme } from "@/contexts/theme-context";

function Field({ label, children, hint }) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
    );
}

export function ProfilePage() {
    const [profile, setProfile] = useState({});
    const { theme, resolvedTheme, setTheme } = useTheme();
    const nameInitials = name => name&&name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();

    return (
        <>
            <Card className="m-1">
                <CardHeader className="space-y-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/40">
                                <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Perfil de Usuário</CardTitle>
                                <CardDescription className="mt-1">Informações que aparecerão na dashboard do sistema</CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/20 w-50 py-4">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-lg">
                                {nameInitials(profile?.name)}
                            </AvatarFallback>
                        </Avatar>

                        <Button variant="outline" size="sm" className="gap-2 my-2">
                            <Camera className="h-4 w-4" />Trocar foto
                        </Button>
                        <Separator />

                        <div className="mt-4">
                            <div className="font-medium">{profile?.name}</div>
                            <p className="text-sm text-muted-foreground">{profile?.role}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 w-full">
                        <Field label="Nome Completo">
                            <Input
                                value={profile?.name}
                                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Digite seu nome..."
                            />
                        </Field>

                        <Field label="Email">
                            <Input
                                type="email"
                                value={profile?.email}
                                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="fulano@empresa.com.br"
                            />
                        </Field>

                        <Field label="Telefone">
                            <Input
                                value={profile?.phone}
                                onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                                placeholder="(12) 9 3456-7890"
                            />
                        </Field>

                        <Field label="Cargo">
                            <Input
                                value={profile?.role}
                                onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                                placeholder="Digite o nome do seu cargo..."
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Bio">
                                <Textarea
                                    value={profile?.bio}
                                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Conte um pouco sobre você &#128512;"
                                />
                            </Field>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="m-1">
                <CardHeader className="space-y-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/40">
                                <Laptop className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Aparência</CardTitle>
                                <CardDescription className="mt-1">Controle as cores do sistema</CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <button
                            type="button"
                            onClick={() => setTheme("light")}
                            className={[
                                "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                                theme === "light"
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-accent",
                            ].join(" ")}
                        >
                            <SunMedium className="h-5 w-5" />
                            <div>
                                <div className="font-medium">Light</div>
                                <div className="text-xs text-muted-foreground">Bright interface</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            className={[
                                "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                                theme === "dark"
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-accent",
                            ].join(" ")}
                        >
                            <MoonStar className="h-5 w-5" />
                            <div>
                                <div className="font-medium">Dark</div>
                                <div className="text-xs text-muted-foreground">Low-light friendly</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme("system")}
                            className={[
                                "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                                theme === "system"
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-accent",
                            ].join(" ")}
                        >
                            <Laptop className="h-5 w-5" />
                            <div>
                                <div className="font-medium">System</div>
                                <div className="text-xs text-muted-foreground">Match device theme</div>
                            </div>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}