import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CampaignNew from "./pages/CampaignNew";
import CampaignDetails from "./pages/CampaignDetails";
import InfluencerDiscovery from "./pages/InfluencerDiscovery";
import DiscoverInfluencer from "./pages/DiscoverInfluencer";
import IRM from "./pages/IRM";
import NotFound from "./pages/NotFound";
import CampaignInfluencers from "./pages/CampaignInfluencers";
import CampaignIRM from "./pages/CampaignIRM";
import ConversationDetails from "./pages/ConversationDetails";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = false; // Replace with actual auth logic

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated ? (
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <MainLayout>
                  <Routes>
                    <Route path="/\" element={<Dashboard />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/campaigns/:id" element={<CampaignDetails />} />
                    <Route path="/campaigns/new" element={<CampaignNew />} />
                    <Route path="/campaigns/:id/influencers" element={<CampaignInfluencers />} />
                    <Route path="/campaign/:id/irm" element={<CampaignIRM />} />
                    <Route path="/conversation/:id" element={<ConversationDetails />} />
                    <Route path="/discover" element={<DiscoverInfluencer />} />
                    <Route path="/irm" element={<IRM />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </div>
            </SidebarProvider>
          ) : (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;