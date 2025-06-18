
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="flex-1 flex flex-col bg-white">
      <header className="border-b border-white/20 bg-white/90 backdrop-blur-xl sticky top-0 z-40 shadow-card">
        <div className="flex items-center justify-between p-6">
          <SidebarTrigger className="text-text-secondary hover:text-text-primary transition-colors rounded-xl p-2 hover:bg-secondary/20" />
          <div className="flex items-center gap-4">
            <div className="text-sm text-text-secondary font-andika">
              Welcome back to <span className="font-glegoo font-medium text-text-link">InfluencerFlow</span>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 p-8 bg-gradient-to-br from-white to-secondary/5">
        {children}
      </div>
    </main>
  );
}
