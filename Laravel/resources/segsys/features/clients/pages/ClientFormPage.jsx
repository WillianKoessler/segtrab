import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientFormPage({ mode }) {
    const navigate = useNavigate();
    const params = useParams();

    function handleSubmit(event) {
        event.preventDefault();
        navigate("/clients");
    }

    const isEdit = mode === "edit";
    const title = isEdit ? `Editar cliente #${params.id}` : "Novo cliente";
    const description = isEdit
        ? "Atualiza as informações do cliente."
        : "Cria um novo cliente.";

    return (
        <Dialog open onOpenChange={(open) => !open && navigate(-1)}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue="" />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}