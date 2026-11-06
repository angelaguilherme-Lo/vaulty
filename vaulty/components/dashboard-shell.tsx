import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { WorkspaceBoundary } from "@/components/workspace-boundary";
import { OnboardingTour } from "@/components/onboarding-tour";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceBoundary><div className="app-layout">
      <Sidebar />
      <main className="workspace-main">
        <div className="workspace-scroll"><div className="page-wrap">{children}</div></div>
        <MobileNav />
      </main>
      <OnboardingTour />
    </div></WorkspaceBoundary>
  );
}