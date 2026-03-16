import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, ArrowDownCircle, ArrowUpCircle,
  Warehouse, BookOpenCheck, Users, Settings, Dumbbell, Stethoscope,
  Scissors, BarChart4, LogOut, X, Banknote, ClipboardCheck, TrendingDown
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
  { label: "Ventas", icon: ShoppingBag, path: "/dashboard/ventas", page: "ventas" },
  { label: "Compras", icon: ArrowDownCircle, path: "/dashboard/compras", page: "compras" },
  { label: "Ingresos", icon: ArrowUpCircle, path: "/dashboard/ingresos", page: "ingresos" },
  { label: "Gastos", icon: TrendingDown, path: "/dashboard/gastos", page: "gastos" },
  { label: "Inventario", icon: Warehouse, path: "/dashboard/inventario", page: "inventario" },
  { label: "Contabilidad", icon: BookOpenCheck, path: "/dashboard/contabilidad", page: "contabilidad" },
  { label: "Gráficos", icon: BarChart4, path: "/dashboard/graficos", page: "graficos" },
  { label: "Nóminas", icon: Banknote, path: "/dashboard/nominas", page: "nominas" },
];

const sections = [
  { label: "GeQ Sport", icon: Dumbbell, path: "/dashboard/gimnasia", page: "" },
  { label: "Clínica Bitem", icon: Stethoscope, path: "/dashboard/clinica", page: "" },
  { label: "Peluquería Bitem", icon: Scissors, path: "/dashboard/peluqueria", page: "" },
];

const adminItems = [
  { label: "Usuarios", icon: Users, path: "/dashboard/usuarios", page: "usuarios" },
  { label: "Auditoría", icon: ClipboardCheck, path: "/dashboard/auditoria", page: "auditoria" },
  { label: "Configuración", icon: Settings, path: "/dashboard/configuracion", page: "" },
];

const DashboardSidebar = ({ open, onClose }: Props) => {
  const location = useLocation();
  const { signOut, profile, canAccessPage, isAdmin, isSuperAdmin, roles } = useAuth();

  const roleLabel = isSuperAdmin ? "Super Admin" : roles.includes("admin") ? "Admin" : roles.includes("worker") ? "Trabajador" : "Lector";

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    if (item.page && !canAccessPage(item.page)) return null;
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        )}
      >
        <item.icon className={cn("h-5 w-5 shrink-0", active && "drop-shadow-sm")} />
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
          <img src={logo} alt="Bitem Global" className="h-10 w-auto" />
          <div>
            <span className="font-heading font-bold text-sidebar-foreground block text-sm">Bitem Global</span>
            {profile && (
              <div>
                <span className="text-xs text-sidebar-foreground/60">{profile.full_name}</span>
                <span className="text-[10px] text-sidebar-foreground/40 block">{roleLabel}</span>
              </div>
            )}
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

        {isAdmin && (
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
