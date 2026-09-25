import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ModulePlaceholderPage({ title }) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>This module page is ready for real business screens.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Add list, form, and detail pages here using the same pattern.
      </CardContent>
    </Card>
  );
}