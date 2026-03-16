import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "./DashboardSidebar";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import { useAuth } from "@/hooks/useAuth";
import WelcomePage from "@/pages/dashboard/WelcomePage";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, hasRole, profile } = useAuth();
  useAutoLogout();

  // Check if user has no permissions at all (new user waiting for admin)
  const hasNoPermissions = !isAdmin && !hasRole("worker") && 
    (!profile?.allowed_pages || profile.allowed_pages.length === 0) &&
    (!profile?.allowed_sections || profile.allowed_sections.length === 0);

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <header className="lg:hidden sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-heading font-bold text-foreground">Bitem Global</span>
        </header>

        <main className="p-4 md:p-8">
          {hasNoPermissions ? <WelcomePage /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
