import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const labels: Record<string, string> = {
  ventas: "Ventas",
  compras: "Compras",
  ingresos: "Ingresos",
  gastos: "Gastos",
  inventario: "Inventario",
  contabilidad: "Contabilidad",
  graficos: "Gráficos y Balances",
  gimnasia: "Sección Gimnasia",
  clinica: "Sección Clínica",
  peluqueria: "Sección Peluquería",
  usuarios: "Gestión de Usuarios",
  configuracion: "Configuración",
};

const PlaceholderPage = () => {
  const location = useLocation();
  const segment = location.pathname.split("/").pop() || "";
  const title = labels[segment] || segment;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
      <Card className="shadow-card border-0">
        <CardContent className="p-12 text-center">
          <Construction className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-xl font-semibold text-foreground mb-2">En Desarrollo</h2>
          <p className="text-muted-foreground">
            El módulo de {title.toLowerCase()} estará disponible próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
