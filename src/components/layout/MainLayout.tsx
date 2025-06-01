
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome back to InfluencerFlow
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 p-6">
        {children}
      </div>
    </main>
  );
}
