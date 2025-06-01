
import { BarChart3, Megaphone, Users, Calendar, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Megaphone,
  },
  {
    title: "Discover Influencers",
    url: "/discover",
    icon: Search,
  },
  {
    title: "Influencer Manager",
    url: "/irm",
    icon: Users,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-black/20">
      <SidebarHeader className="p-6 border-b border-slate-700/30" onClick={() => navigate("/")}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold gradient-text">InfluencerFlow</h1>
            <p className="text-xs text-muted-foreground">AI Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-slate-800/60 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600/80 data-[active=true]:to-purple-600/80 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-purple-500/20 transition-all duration-200"
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
