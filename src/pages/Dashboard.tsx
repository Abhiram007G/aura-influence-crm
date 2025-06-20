import { useEffect, useState } from "react";
import { BarChart3, Megaphone, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCampaigns } from "@/lib/services/campaignService";
import { getOutreachEntries } from "@/lib/services/outreachService";
import SectionCard from "@/components/ui/SectionCard";

const Dashboard = () => {
  const navigate = useNavigate();

  // State for real data
  const [campaigns, setCampaigns] = useState([]);
  const [outreachEntries, setOutreachEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [campaignsData, outreachData] = await Promise.all([
          getCampaigns(),
          getOutreachEntries()
        ]);
        setCampaigns(campaignsData);
        setOutreachEntries(outreachData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats
  const activeCampaigns = campaigns.length;
  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);
  const influencersContacted = outreachEntries.length;
  const roi = "25K";

  const stats = [
    {
      title: "Active Campaigns",
      value: activeCampaigns,
      change: `Total` ,
      icon: Megaphone,
      color: "text-purple-400"
    },
    {
      title: "Influencers Contacted",
      value: influencersContacted,
      change: `Total`,
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Response Rate",
      value: "200%",
      change: "20%",
      icon: TrendingUp,
      color: "text-cyan-400"
    },
    {
      title: "Total ROI",
      value: `$${roi.toLocaleString()}`,
      change: `Completed Campaigns`,
      icon: BarChart3,
      color: "text-green-400"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionCard  className="!mb-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your influencer marketing campaigns and performance
            </p>
          </div>
          <Button 
            onClick={() => navigate('/campaigns/new')}
            className="bg-gradient-purple hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover-glow"
          >
            Create Campaign
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Stats">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover-glow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Recent Campaigns">
          <div className="space-y-4">
            {recentCampaigns.map((campaign, index) => (
              <div onClick={() => navigate(`/campaigns/${campaign.id}`)} key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border">
                <div>
                  <p className="font-medium text-foreground">{campaign.product_name}</p>
                  <p className="text-sm text-muted-foreground">Budget: ${campaign.total_budget}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  campaign.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions">
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/campaigns/new')}
              className="w-full bg-gradient-purple hover:opacity-90 text-white"
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
            <Button 
              onClick={() => navigate('/irm')}
              className="w-full btn-tertiary"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Influencers
            </Button>
            <Button 
              onClick={() => navigate('/campaigns')}
              className="w-full btn-tertiary"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Dashboard;
