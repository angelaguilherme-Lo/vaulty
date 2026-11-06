import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { AiHelper } from "@/components/ai-helper";
import { WorkspaceBoundary } from "@/components/workspace-boundary";
import { OnboardingTour } from "@/components/onboarding-tour";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceBoundary><div className="app-layout">
      <Sidebar />
      <main className="min-h-screen">
        <div className="page-wrap">{children}</div>
        <MobileNav />
        <AiHelper />
        <OnboardingTour />
      </main>
    </div></WorkspaceBoundary>
  );
}