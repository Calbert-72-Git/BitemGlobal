import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, TrendingDown, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import logoGym from "@/assets/logo-gym.png";
import logoClinica from "@/assets/logo-clinica.png";
import logoPeluqueria from "@/assets/logo-peluqueria.jpg";

const pieColors = ["hsl(145, 60%, 40%)", "hsl(217, 85%, 45%)", "hsl(38, 92%, 50%)"];

const sectionLogos: Record<string, string> = {
  gimnasia: logoGym,
  clinica: logoClinica,
  peluqueria: logoPeluqueria,
};

const sectionNames: Record<string, string> = {
  gimnasia: "GeQ Sport",
  clinica: "Clínica Bitem",
  peluqueria: "Peluquería Bitem",
};

const DashboardHome = () => {
  const [stats, setStats] = useState({ sales: 0, income: 0, expenses: 0, inventory: 0 });
  const [sectionData, setSectionData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [salesRes, incomeRes, expensesRes, inventoryRes] = await Promise.all([
        supabase.from("sales").select("amount, section"),
        supabase.from("income").select("amount, section"),
        supabase.from("expenses").select("amount"),
        supabase.from("inventory").select("id"),
      ]);

      const totalSales = (salesRes.data || []).reduce((s, r) => s + Number(r.amount), 0);
      const totalIncome = (incomeRes.data || []).reduce((s, r) => s + Number(r.amount), 0);
      const totalExpenses = (expensesRes.data || []).reduce((s, r) => s + Number(r.amount), 0);

      setStats({
        sales: totalSales,
        income: totalIncome,
        expenses: totalExpenses,
        inventory: (inventoryRes.data || []).length,
      });

      // Section breakdown from sales
      const bySection: Record<string, number> = {};
      (salesRes.data || []).forEach((r: any) => {
        bySection[r.section] = (bySection[r.section] || 0) + Number(r.amount);
      });
      setSectionData(
        Object.entries(bySection).map(([name, value]) => ({ name: sectionNames[name] || name, value }))
      );
    };
    fetchStats();
  }, []);

  const formatXAF = (n: number) => n.toLocaleString("es-GQ") + " XAF";

  const statCards = [
    { label: "Ventas Totales", value: formatXAF(stats.sales), icon: ShoppingCart, color: "text-primary" },
    { label: "Ingresos", value: formatXAF(stats.income), icon: TrendingUp, color: "text-accent" },
    { label: "Gastos", value: formatXAF(stats.expenses), icon: TrendingDown, color: "text-destructive" },
    { label: "Inventario", value: `${stats.inventory} items`, icon: Package, color: "text-warning" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Panel General</h1>
        <p className="text-muted-foreground mt-1">Resumen de la actividad de Bitem Global</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map(s => (
          <Card key={s.label} className="shadow-card border-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="font-heading text-xl md:text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Ventas por Sección</CardTitle>
          </CardHeader>
          <CardContent>
            {sectionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatXAF(v)} />
                  <Bar dataKey="value" fill="hsl(217, 85%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">No hay datos de ventas aún. Registra tu primera venta.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Distribución</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {sectionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={sectionData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name }) => name}>
                    {sectionData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatXAF(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">Sin datos</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
        {(["gimnasia", "clinica", "peluqueria"] as const).map((sec, i) => (
          <Card key={sec} className="shadow-card border-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <img src={sectionLogos[sec]} alt={sectionNames[sec]} className="h-8 w-8 rounded object-contain" />
                <h3 className="font-heading font-bold text-foreground">{sectionNames[sec]}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ventas: {formatXAF(sectionData.find(d => d.name === sectionNames[sec])?.value || 0)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
