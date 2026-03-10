import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import PlaceholderPage from "./pages/dashboard/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="ventas" element={<PlaceholderPage />} />
            <Route path="compras" element={<PlaceholderPage />} />
            <Route path="ingresos" element={<PlaceholderPage />} />
            <Route path="gastos" element={<PlaceholderPage />} />
            <Route path="inventario" element={<PlaceholderPage />} />
            <Route path="contabilidad" element={<PlaceholderPage />} />
            <Route path="graficos" element={<PlaceholderPage />} />
            <Route path="gimnasia" element={<PlaceholderPage />} />
            <Route path="clinica" element={<PlaceholderPage />} />
            <Route path="peluqueria" element={<PlaceholderPage />} />
            <Route path="usuarios" element={<PlaceholderPage />} />
            <Route path="configuracion" element={<PlaceholderPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
