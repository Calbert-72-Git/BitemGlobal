import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

interface Props {
  page: string;
  children: React.ReactNode;
}

const PageGuard = ({ page, children }: Props) => {
  const { canAccessPage, loading } = useAuth();

  if (loading) return null;

  if (!canAccessPage(page)) {
    return (
      <div className="space-y-6">
        <Card className="shadow-card border-0">
          <CardContent className="p-12 text-center space-y-4">
            <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="font-heading text-xl font-bold text-foreground">Acceso restringido</h2>
            <p className="text-muted-foreground">No tienes permisos para acceder a esta sección. Contacta al administrador para que te asigne acceso.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageGuard;
