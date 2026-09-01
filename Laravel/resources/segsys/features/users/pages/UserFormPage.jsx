import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select";
import { Switch } from "#components/ui/switch";
import { useState } from "react";
import { createUser, updateUser } from "../../../../js/api/users";
import { Button } from "#components/ui/button";

export default function UserFormPage({ user = null, onSaved, availableRoles }) {
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [role, setRole] = useState(user?.roles[0] ?? availableRoles[0]);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isActive, setIsActive] = useState(user?.is_active ?? true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async event => {
        event.preventDefault();

        setSaving(true);
        setError(null);

        try {
            const payload = { name, email, role, is_active: isActive };
            if (!user) {
                payload.password = password;
                payload.password_confirmation = passwordConfirmation;
            }
            const saved = user
                ? await updateUser(user.id, payload)
                : await createUser(payload);

            onSaved?.(saved);
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="flex flex-col flex-nowrap items-start justify-center gap-4">
                <div className="grid gap-2 w-full">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" placeholder="Nome completo" onChange={e => setName(e.target.value)} value={name} required />
                </div>
                <div className="grid gap-2 w-full">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" placeholder="usuario@exemplo.com.br" onChange={e => setEmail(e.target.value)} value={email} required />
                </div>
            </div>
            <div className="gap-4 flex flex-row flex-nowrap items-center justify-start">
                <div className="grid gap-2">
                    <Label htmlFor="role">Grupo de Permissões</Label>
                    <Select onValueChange={setRole} value={role}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {availableRoles?.map((role, idx) =>
                                    <SelectItem key={`role-selection-${idx}`} value={role.name}>{role.name}</SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {!user && (
                <>
                    <div className="grid gap-2 w-full">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" onChange={e => setPassword(e.target.value)} value={password} required minLength="8" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar senha</Label>
                        <Input id="password_confirmation" type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} required minLength="8" />
                    </div>
                </>
            )}

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <div className="text-sm font-medium">Conta Ativa</div>
                    <div className="text-sm text-muted-foreground">Usuários inativos não poderão acessar o sistema.</div>
                </div>

                <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            {error && (
                <div className="text-sm text-destructive">
                    {error}
                </div>
            )}

            <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
            </Button>
        </form>
    );
}