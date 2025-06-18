
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
    url: "/dashboard",
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
    <Sidebar className="border-r border-white/20 bg-white/95 backdrop-blur-xl shadow-card">
      <SidebarHeader className="p-6 border-b border-white/20" onClick={() => navigate("/")}>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-baloo font-bold text-text-primary">InfluencerFlow</h1>
            <p className="text-sm text-text-secondary font-andika">AI Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-glegoo font-medium text-text-secondary uppercase tracking-wider px-3 py-2">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-secondary/30 data-[active=true]:bg-gradient-primary data-[active=true]:text-white data-[active=true]:shadow-glow transition-all duration-200 rounded-xl"
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 font-andika font-medium"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
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
