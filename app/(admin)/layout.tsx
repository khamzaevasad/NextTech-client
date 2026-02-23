import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AdminGuard } from "@/lib/guard/AdminGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen w-full m-0 p-0 overflow-x-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-background">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
