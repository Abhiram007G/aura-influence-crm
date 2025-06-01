
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
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
