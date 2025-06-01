import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Users, Calendar, TrendingUp } from "lucide-react";

// API Response type
interface CampaignResponse {
  id: string;
  product_name: string;
  brand_name: string;
  product_description: string | null;
  target_audience: string | null;
  key_use_cases: string | null;
  campaign_goal: string | null;
  product_niche: string | null;
  total_budget: number;
  status: "active" | "planning" | "completed" | "paused";
  influencer_count: number;
  campaign_code: string | null;
  created_at: string;
  updated_at: string;
}

// UI Campaign type (transformed from API response)
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

interface CampaignFilters {
  status?: string;
  limit?: number;
  offset?: number;
}

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CampaignFilters>({
    limit: 20,
    offset: 0
  });

  const buildQueryString = (filters: CampaignFilters): string => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    return params.toString();
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const queryString = buildQueryString(filters);
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/campaigns/${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        
        const data: CampaignResponse[] = await response.json();
        
        // Transform API response to UI format
        const transformedCampaigns: Campaign[] = data.map(campaign => ({
          id: campaign.id,
          name: campaign.product_name,
          brand: campaign.brand_name,
          status: campaign.status,
          budget: campaign.total_budget,
          influencersCount: campaign.influencer_count,
          startDate: campaign.created_at,
          performance: {
            reach: 1050000, // These would come from analytics API
            engagement: 1500000,
            conversions: 10000
          }
        }));

        setCampaigns(transformedCampaigns);
        setError(null);
      } catch (err) {
        setError('Failed to fetch campaigns. Please try again later.');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [filters]);

  const handleStatusFilter = (status: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      status,
      offset: 0 // Reset offset when changing filters
    }));
  };

  const handleLoadMore = () => {
    setFilters(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 20)
    }));
  };

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

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

      {/* Status Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={!filters.status ? "default" : "outline"}
          onClick={() => handleStatusFilter(undefined)}
        >
          All
        </Button>
        <Button
          variant={filters.status === "active" ? "default" : "outline"}
          onClick={() => handleStatusFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filters.status === "planning" ? "default" : "outline"}
          onClick={() => handleStatusFilter("planning")}
        >
          Planning
        </Button>
        <Button
          variant={filters.status === "completed" ? "default" : "outline"}
          onClick={() => handleStatusFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={filters.status === "paused" ? "default" : "outline"}
          onClick={() => handleStatusFilter("paused")}
        >
          Paused
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No campaigns found</p>
          <Button
            onClick={() => navigate('/campaigns/new')}
            className="bg-gradient-purple hover:opacity-90 text-white"
          >
            Create Your First Campaign
          </Button>
        </div>
      ) : (
        <>
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
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
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

          {/* Load More Button */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Campaigns;
