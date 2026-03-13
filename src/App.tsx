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
import PlaceholderPage from "./pages/dashboard/PlaceholderPage";
import NotFound from "./pages/NotFound";

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
              <Route path="ventas" element={<SalesPage />} />
              <Route path="compras" element={<TransactionsPage type="purchases" />} />
              <Route path="ingresos" element={<TransactionsPage type="income" />} />
              <Route path="gastos" element={<TransactionsPage type="expenses" />} />
              <Route path="inventario" element={<InventoryPage />} />
              <Route path="contabilidad" element={<AccountingPage />} />
              <Route path="graficos" element={<ChartsPage />} />
              <Route path="gimnasia" element={<PlaceholderPage />} />
              <Route path="clinica" element={<PlaceholderPage />} />
              <Route path="peluqueria" element={<PlaceholderPage />} />
              <Route path="usuarios" element={<UsersPage />} />
              <Route path="configuracion" element={<PlaceholderPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
