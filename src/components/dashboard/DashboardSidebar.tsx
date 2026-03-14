import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, TrendingUp, TrendingDown,
  Package, BookOpen, Users, Settings, Dumbbell, Stethoscope,
  Scissors, BarChart3, LogOut, X, Wallet
} from "lucide-react";
import logo from "@/assets/logo-eni.png";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Panel General", icon: LayoutDashboard, path: "/dashboard", page: "" },
  { label: "Ventas", icon: ShoppingCart, path: "/dashboard/ventas", page: "ventas" },
  { label: "Compras", icon: Package, path: "/dashboard/compras", page: "compras" },
  { label: "Ingresos", icon: TrendingUp, path: "/dashboard/ingresos", page: "ingresos" },
  { label: "Gastos", icon: TrendingDown, path: "/dashboard/gastos", page: "gastos" },
  { label: "Inventario", icon: Package, path: "/dashboard/inventario", page: "inventario" },
  { label: "Contabilidad", icon: BookOpen, path: "/dashboard/contabilidad", page: "contabilidad" },
  { label: "Gráficos", icon: BarChart3, path: "/dashboard/graficos", page: "graficos" },
  { label: "Nóminas", icon: Wallet, path: "/dashboard/nominas", page: "nominas" },
];

const sections = [
  { label: "GeQ Sport", icon: Dumbbell, path: "/dashboard/gimnasia", page: "" },
  { label: "Clínica Bitem", icon: Stethoscope, path: "/dashboard/clinica", page: "" },
  { label: "Peluquería Bitem", icon: Scissors, path: "/dashboard/peluqueria", page: "" },
];

const adminItems = [
  { label: "Usuarios", icon: Users, path: "/dashboard/usuarios", page: "usuarios" },
  { label: "Configuración", icon: Settings, path: "/dashboard/configuracion", page: "" },
];

const DashboardSidebar = ({ open, onClose }: Props) => {
  const location = useLocation();
  const { signOut, profile, canAccessPage, hasRole } = useAuth();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    // Hide items user can't access (except Panel General which is always visible)
    if (item.page && !canAccessPage(item.page)) return null;
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={onClose}
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
    <aside
      className={cn(
        "w-64 h-screen bg-sidebar fixed left-0 top-0 flex flex-col border-r border-sidebar-border z-50 transition-transform duration-300",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Bitem Global" className="h-9 w-auto" />
          <div>
            <span className="font-heading font-bold text-sidebar-foreground block text-sm">Bitem Global</span>
            {profile && <span className="text-xs text-sidebar-foreground/50">{profile.full_name}</span>}
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground">
          <X className="h-5 w-5" />
        </button>
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

        {hasRole("admin") && (
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-2">Admin</p>
            <div className="space-y-1">
              {adminItems.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
