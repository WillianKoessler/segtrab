import { Label } from "@/components/ui/label";

export function Field({ label, children, hint }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
