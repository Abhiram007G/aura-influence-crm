
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Users, Calendar, TrendingUp } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  brand: string;
  status: "active" | "planning" | "completed" | "paused";
  budget: number;
  influencersCount: number;
  startDate: string;
  endDate?: string;
  performance: {
    reach: number;
    engagement: number;
    conversions: number;
  };
}

const Campaigns = () => {
  const navigate = useNavigate();

  // Mock data
  const [campaigns] = useState<Campaign[]>([
    {
      id: "camp_1",
      name: "Summer Collection Launch",
      brand: "FashionCo",
      status: "active",
      budget: 50000,
      influencersCount: 15,
      startDate: "2024-05-15",
      endDate: "2024-07-15",
      performance: {
        reach: 2400000,
        engagement: 180000,
        conversions: 1250
      }
    },
    {
      id: "camp_2",
      name: "Tech Product Review",
      brand: "TechBrand",
      status: "planning",
      budget: 25000,
      influencersCount: 8,
      startDate: "2024-06-01",
      performance: {
        reach: 0,
        engagement: 0,
        conversions: 0
      }
    },
    {
      id: "camp_3",
      name: "Holiday Sale Campaign",
      brand: "RetailPlus",
      status: "completed",
      budget: 75000,
      influencersCount: 22,
      startDate: "2024-03-01",
      endDate: "2024-04-30",
      performance: {
        reach: 3200000,
        engagement: 240000,
        conversions: 1800
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "planning": return "bg-yellow-500/20 text-yellow-400";
      case "completed": return "bg-blue-500/20 text-blue-400";
      case "paused": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and track your influencer marketing campaigns
          </p>
        </div>
        <Button
          onClick={() => navigate('/campaigns/new')}
          className="bg-gradient-purple hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="glass-card hover-glow cursor-pointer transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <div>
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <CardDescription>{campaign.brand}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium text-foreground">${campaign.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Influencers</p>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {campaign.influencersCount}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Timeline</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{new Date(campaign.startDate).toLocaleDateString()}</span>
                  {campaign.endDate && (
                    <>
                      <span className="text-muted-foreground">-</span>
                      <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>

              {campaign.status !== "planning" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Performance
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 rounded bg-secondary/10">
                      <p className="font-medium text-foreground">{formatNumber(campaign.performance.reach)}</p>
                      <p className="text-muted-foreground">Reach</p>
                    </div>
                    <div className="text-center p-2 rounded bg-secondary/10">
                      <p className="font-medium text-foreground">{formatNumber(campaign.performance.engagement)}</p>
                      <p className="text-muted-foreground">Engagement</p>
                    </div>
                    <div className="text-center p-2 rounded bg-secondary/10">
                      <p className="font-medium text-foreground">{formatNumber(campaign.performance.conversions)}</p>
                      <p className="text-muted-foreground">Conversions</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border hover:bg-secondary/20"
                  onClick={() => navigate(`/campaigns/${campaign.id}/influencers`)}
                >
                  View Details
                </Button>
                {campaign.status === "planning" && (
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-blue hover:opacity-90 text-white"
                    onClick={() => navigate(`/campaigns/${campaign.id}/influencers`)}
                  >
                    Find Influencers
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
