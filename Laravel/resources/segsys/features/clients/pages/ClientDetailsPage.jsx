import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ClientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Dialog open onOpenChange={(open) => !open && navigate("/clients")}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Customer #{id}</DialogTitle>
                    <DialogDescription>Detail view starter.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-2 text-sm">
                    <p><strong>Name:</strong> Example customer</p>
                    <p><strong>Email:</strong> example@example.com</p>
                    <p><strong>Status:</strong> Active</p>
                </div>

                <DialogFooter>
                    <Button asChild variant="outline">
                        <Link to="edit">Edit</Link>
                    </Button>

                    <Button type="button" variant="secondary" onClick={() => navigate("/clients")}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}