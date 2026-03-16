import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import SalesPage from "./pages/dashboard/SalesPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import AccountingPage from "./pages/dashboard/AccountingPage";
import ChartsPage from "./pages/dashboard/ChartsPage";
import UsersPage from "./pages/dashboard/UsersPage";
import PayrollPage from "./pages/dashboard/PayrollPage";
import AuditPage from "./pages/dashboard/AuditPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PlaceholderPage from "./pages/dashboard/PlaceholderPage";
import NotFound from "./pages/NotFound";
import PageGuard from "./components/PageGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="ventas" element={<PageGuard page="ventas"><SalesPage /></PageGuard>} />
              <Route path="compras" element={<PageGuard page="compras"><TransactionsPage type="purchases" /></PageGuard>} />
              <Route path="ingresos" element={<PageGuard page="ingresos"><TransactionsPage type="income" /></PageGuard>} />
              <Route path="gastos" element={<PageGuard page="gastos"><TransactionsPage type="expenses" /></PageGuard>} />
              <Route path="inventario" element={<PageGuard page="inventario"><InventoryPage /></PageGuard>} />
              <Route path="contabilidad" element={<PageGuard page="contabilidad"><AccountingPage /></PageGuard>} />
              <Route path="graficos" element={<PageGuard page="graficos"><ChartsPage /></PageGuard>} />
              <Route path="nominas" element={<PageGuard page="nominas"><PayrollPage /></PageGuard>} />
              <Route path="auditoria" element={<PageGuard page="auditoria"><AuditPage /></PageGuard>} />
              <Route path="gimnasia" element={<PlaceholderPage />} />
              <Route path="clinica" element={<PlaceholderPage />} />
              <Route path="peluqueria" element={<PlaceholderPage />} />
              <Route path="usuarios" element={<PageGuard page="usuarios"><UsersPage /></PageGuard>} />
              <Route path="configuracion" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
