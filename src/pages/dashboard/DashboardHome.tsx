import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, TrendingDown, Package, Dumbbell, Stethoscope, Scissors } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Ventas del Mes", value: "1,250,000 XAF", icon: ShoppingCart, change: "+12%", color: "text-primary" },
  { label: "Ingresos", value: "980,000 XAF", icon: TrendingUp, change: "+8%", color: "text-accent" },
  { label: "Gastos", value: "420,000 XAF", icon: TrendingDown, change: "-3%", color: "text-destructive" },
  { label: "Inventario", value: "342 items", icon: Package, change: "", color: "text-warning" },
];

const barData = [
  { mes: "Ene", ventas: 800, gastos: 400 },
  { mes: "Feb", ventas: 950, gastos: 380 },
  { mes: "Mar", ventas: 1100, gastos: 420 },
  { mes: "Abr", ventas: 1050, gastos: 450 },
  { mes: "May", ventas: 1250, gastos: 420 },
];

const pieData = [
  { name: "Gimnasia", value: 40, color: "hsl(145, 60%, 40%)" },
  { name: "Clínica", value: 35, color: "hsl(217, 85%, 45%)" },
  { name: "Peluquería", value: 25, color: "hsl(0, 72%, 50%)" },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Panel General</h1>
        <p className="text-muted-foreground mt-1">Resumen de la actividad de Calbert 72</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <Card key={s.label} className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                {s.change && (
                  <span className={`text-xs font-semibold ${s.change.startsWith('+') ? 'text-accent' : 'text-destructive'}`}>
                    {s.change}
                  </span>
                )}
              </div>
              <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Ventas vs Gastos (miles XAF)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="hsl(217, 85%, 45%)" radius={[4,4,0,0]} />
                <Bar dataKey="gastos" fill="hsl(0, 72%, 50%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading">Ingresos por Sección</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Gimnasia", icon: Dumbbell, color: "text-accent", members: 87, revenue: "480,000 XAF" },
          { title: "Clínica", icon: Stethoscope, color: "text-primary", members: 124, revenue: "350,000 XAF" },
          { title: "Peluquería", icon: Scissors, color: "text-destructive", members: 65, revenue: "250,000 XAF" },
        ].map(sec => (
          <Card key={sec.title} className="shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <sec.icon className={`h-6 w-6 ${sec.color}`} />
                <h3 className="font-heading font-bold text-lg text-foreground">{sec.title}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Clientes</span>
                  <span className="font-semibold text-foreground">{sec.members}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ingresos</span>
                  <span className="font-semibold text-foreground">{sec.revenue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
