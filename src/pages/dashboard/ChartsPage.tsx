import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

const SECTIONS = ["gimnasia", "clinica", "peluqueria"] as const;
const SECTION_NAMES: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };
const COLORS = ["hsl(217, 85%, 45%)", "hsl(145, 60%, 40%)", "hsl(38, 92%, 50%)"];

const fmt = (n: number) => n.toLocaleString("es-GQ") + " XAF";

const ChartsPage = () => {
  const [filter, setFilter] = useState("all");
  const [salesBySection, setSalesBySection] = useState<{ name: string; value: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [incomeVsExpenses, setIncomeVsExpenses] = useState<any[]>([]);
  const [inventoryBySection, setInventoryBySection] = useState<{ name: string; items: number; value: number }[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [salesRes, incomeRes, expensesRes, inventoryRes] = await Promise.all([
        supabase.from("sales").select("amount, section, sale_date"),
        supabase.from("income").select("amount, section, income_date"),
        supabase.from("expenses").select("amount, section, expense_date"),
        supabase.from("inventory").select("section, quantity, unit_price"),
      ]);

      const sales = (salesRes.data || []).filter((r: any) => filter === "all" || r.section === filter);
      const income = (incomeRes.data || []).filter((r: any) => filter === "all" || r.section === filter);
      const expenses = (expensesRes.data || []).filter((r: any) => filter === "all" || r.section === filter);
      const inventory = (inventoryRes.data || []).filter((r: any) => filter === "all" || r.section === filter);

      // Sales by section (pie)
      const bySection: Record<string, number> = {};
      sales.forEach((r: any) => {
        bySection[r.section] = (bySection[r.section] || 0) + Number(r.amount);
      });
      setSalesBySection(Object.entries(bySection).map(([k, v]) => ({ name: SECTION_NAMES[k] || k, value: v })));

      // Monthly sales evolution
      const monthlyMap: Record<string, Record<string, number>> = {};
      sales.forEach((r: any) => {
        const month = r.sale_date?.substring(0, 7) || "N/A";
        if (!monthlyMap[month]) monthlyMap[month] = {};
        const sec = SECTION_NAMES[r.section] || r.section;
        monthlyMap[month][sec] = (monthlyMap[month][sec] || 0) + Number(r.amount);
      });
      const sorted = Object.entries(monthlyMap).sort(([a], [b]) => a.localeCompare(b));
      setMonthlyData(sorted.map(([month, data]) => ({ month, ...data })));

      // Income vs Expenses by month
      const ieMap: Record<string, { income: number; expenses: number }> = {};
      income.forEach((r: any) => {
        const month = r.income_date?.substring(0, 7) || "N/A";
        if (!ieMap[month]) ieMap[month] = { income: 0, expenses: 0 };
        ieMap[month].income += Number(r.amount);
      });
      expenses.forEach((r: any) => {
        const month = r.expense_date?.substring(0, 7) || "N/A";
        if (!ieMap[month]) ieMap[month] = { income: 0, expenses: 0 };
        ieMap[month].expenses += Number(r.amount);
      });
      const ieSorted = Object.entries(ieMap).sort(([a], [b]) => a.localeCompare(b));
      setIncomeVsExpenses(ieSorted.map(([month, data]) => ({ month, Ingresos: data.income, Gastos: data.expenses })));

      // Inventory by section
      const invMap: Record<string, { items: number; value: number }> = {};
      inventory.forEach((r: any) => {
        const sec = r.section;
        if (!invMap[sec]) invMap[sec] = { items: 0, value: 0 };
        invMap[sec].items += Number(r.quantity);
        invMap[sec].value += Number(r.quantity) * Number(r.unit_price);
      });
      setInventoryBySection(Object.entries(invMap).map(([k, v]) => ({ name: SECTION_NAMES[k] || k, ...v })));
    };

    fetchAll();
  }, [filter]);

  const hasData = salesBySection.length > 0 || monthlyData.length > 0 || incomeVsExpenses.length > 0;
  const noDataMsg = <p className="text-muted-foreground text-center py-12">No hay datos disponibles. Registra transacciones para ver gráficos.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Gráficos e Informes</h1>
          <p className="text-muted-foreground mt-1">Análisis visual de la actividad de Bitem Global</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar sección" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las secciones</SelectItem>
            <SelectItem value="gimnasia">GeQ Sport</SelectItem>
            <SelectItem value="clinica">Clínica Bitem</SelectItem>
            <SelectItem value="peluqueria">Peluquería Bitem</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row 1: Sales pie + Monthly evolution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Distribución de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            {salesBySection.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={salesBySection} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {salesBySection.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : noDataMsg}
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Evolución Mensual de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  {Object.values(SECTION_NAMES).map((name, i) => (
                    <Bar key={name} dataKey={name} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : noDataMsg}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Income vs Expenses + Inventory */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Ingresos vs Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            {incomeVsExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={incomeVsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="Ingresos" stackId="1" stroke="hsl(145, 60%, 40%)" fill="hsl(145, 60%, 40%)" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="Gastos" stackId="2" stroke="hsl(0, 72%, 50%)" fill="hsl(0, 72%, 50%)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : noDataMsg}
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Inventario por Sección</CardTitle>
          </CardHeader>
          <CardContent>
            {inventoryBySection.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryBySection} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(v: number, name: string) => name === "value" ? fmt(v) : v} />
                  <Legend />
                  <Bar dataKey="items" fill="hsl(217, 85%, 45%)" name="Unidades" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : noDataMsg}
          </CardContent>
        </Card>
      </div>

      {/* Summary cards */}
      {inventoryBySection.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          {inventoryBySection.map((s, i) => (
            <Card key={s.name} className="shadow-card border-0">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <h3 className="font-heading font-bold text-foreground text-sm">{s.name}</h3>
                </div>
                <p className="text-2xl font-bold text-foreground">{s.items} <span className="text-sm font-normal text-muted-foreground">unidades</span></p>
                <p className="text-sm text-muted-foreground">Valor: {fmt(s.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartsPage;
