import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="min-h-screen">
        <div className="page-wrap">{children}</div>
        <MobileNav />
      </main>
    </div>
  );
}