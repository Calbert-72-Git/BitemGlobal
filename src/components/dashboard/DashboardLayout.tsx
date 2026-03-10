import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
