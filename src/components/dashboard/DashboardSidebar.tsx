import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, TrendingUp, TrendingDown,
  Package, BookOpen, Users, Settings, Dumbbell, Stethoscope,
  Scissors, BarChart3, LogOut
} from "lucide-react";
import logo from "@/assets/logo-eni.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Panel General", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Ventas", icon: ShoppingCart, path: "/dashboard/ventas" },
  { label: "Compras", icon: Package, path: "/dashboard/compras" },
  { label: "Ingresos", icon: TrendingUp, path: "/dashboard/ingresos" },
  { label: "Gastos", icon: TrendingDown, path: "/dashboard/gastos" },
  { label: "Inventario", icon: Package, path: "/dashboard/inventario" },
  { label: "Contabilidad", icon: BookOpen, path: "/dashboard/contabilidad" },
  { label: "Gráficos", icon: BarChart3, path: "/dashboard/graficos" },
];

const sections = [
  { label: "Gimnasia", icon: Dumbbell, path: "/dashboard/gimnasia" },
  { label: "Clínica", icon: Stethoscope, path: "/dashboard/clinica" },
  { label: "Peluquería", icon: Scissors, path: "/dashboard/peluqueria" },
];

const adminItems = [
  { label: "Usuarios", icon: Users, path: "/dashboard/usuarios" },
  { label: "Configuración", icon: Settings, path: "/dashboard/configuracion" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-screen bg-sidebar fixed left-0 top-0 flex flex-col border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <img src={logo} alt="Calbert 72" className="h-9 w-auto" />
        <span className="font-heading font-bold text-sidebar-foreground">Calbert 72</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <div className="space-y-1">
          {navItems.map(item => <NavItem key={item.path} item={item} />)}
        </div>

        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2">Secciones</p>
          <div className="space-y-1">
            {sections.map(item => <NavItem key={item.path} item={item} />)}
          </div>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2">Admin</p>
          <div className="space-y-1">
            {adminItems.map(item => <NavItem key={item.path} item={item} />)}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
