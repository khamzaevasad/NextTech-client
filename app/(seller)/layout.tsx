import { ReactNode } from "react";
import { SellerGuard } from "@/app/auth/SellerGuard";
import { Sidebar } from "@/components/seller/Sidebar";
import { DashboardHeader } from "@/components/seller/DashboardHeader";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <SellerGuard>
      <div className="flex min-h-screen w-full m-0 p-0 overflow-x-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-background">{children}</main>
        </div>
      </div>
    </SellerGuard>
  );
}
