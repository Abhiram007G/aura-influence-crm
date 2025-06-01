import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, Target, Users, Briefcase, FileText, Loader2 } from "lucide-react";
import { config } from "@/lib/config";
import { findSimilarInfluencers, CampaignSimilarityResponse } from "@/lib/services/campaignService";
import { useToast } from "@/hooks/use-toast";

interface CampaignDetails {
  id: string;
  product_name: string;
  brand_name: string;
  product_description?: string;
  target_audience?: string;
  key_use_cases?: string;
  campaign_goal?: string;
  product_niche?: string;
  total_budget: number;
  status: "active" | "planning" | "completed" | "paused";
  influencer_count: number;
  campaign_code?: string;
  created_at: string;
  updated_at: string;
}

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [findingInfluencers, setFindingInfluencers] = useState(false);

  const fetchOutreachCount = async (campaignId: string) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/outreach/campaign/${campaignId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch outreach count');
      }
      const data = await response.json();
      return data.length;
    } catch (error) {
      console.error('Error fetching outreach count:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/api/v1/campaigns/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaign details');
        }
        
        const data = await response.json();
        
        // Fetch outreach count and update the campaign data
        const outreachCount = await fetchOutreachCount(id);
        setCampaign({
          ...data,
          influencer_count: outreachCount
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch campaign details. Please try again later.');
        console.error('Error fetching campaign details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "planning": return "bg-yellow-500/20 text-yellow-400";
      case "completed": return "bg-blue-500/20 text-blue-400";
      case "paused": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleFindInfluencers = async () => {
    if (!id) return;
    
    try {
      setFindingInfluencers(true);
      const response = await findSimilarInfluencers(id);
      
      // Store the results in localStorage to pass to the influencers page
      localStorage.setItem('similarInfluencers', JSON.stringify(response));
      
      // Update the influencer count based on the response
      if (campaign && response.matches) {
        setCampaign({
          ...campaign,
          influencer_count: response.matches.length
        });
      }
      
      // Navigate to the influencers page
      navigate(`/campaigns/${id}/influencers`);
    } catch (error) {
      console.error('Error finding similar influencers:', error);
      toast({
        title: "Error",
        description: "Failed to find similar influencers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFindingInfluencers(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-500">{error || 'Campaign not found'}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/campaigns')}
          >
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/campaigns')}
          className="border-border hover:bg-secondary/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{campaign.product_name}</h1>
            <p className="text-muted-foreground">{campaign.brand_name}</p>
          </div>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Campaign Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaign.product_description && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Product Description</h4>
                  <p className="text-muted-foreground">{campaign.product_description}</p>
                </div>
              )}
              
              {campaign.campaign_goal && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Campaign Goal</h4>
                  <p className="text-muted-foreground">{campaign.campaign_goal}</p>
                </div>
              )}

              {campaign.target_audience && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Target Audience</h4>
                  <p className="text-muted-foreground">{campaign.target_audience}</p>
                </div>
              )}

              {campaign.key_use_cases && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key Use Cases</h4>
                  <p className="text-muted-foreground">{campaign.key_use_cases}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Campaign Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="font-semibold text-foreground">${campaign.total_budget.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Influencers</p>
                  <p className="font-semibold text-foreground">{campaign.influencer_count}</p>
                </div>
              </div>

              {campaign.product_niche && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-cyan rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Niche</p>
                    <p className="font-semibold text-foreground">{campaign.product_niche}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-pink rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold text-foreground">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {campaign.campaign_code && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Campaign Code</p>
                    <p className="font-semibold text-foreground">{campaign.campaign_code}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-gradient-purple hover:opacity-90 text-white"
                onClick={handleFindInfluencers}
                disabled={findingInfluencers}
              >
                {findingInfluencers ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finding Influencers...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    AI Influencer Match
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-border hover:bg-secondary/20"
                onClick={() => navigate(`/campaign/${id}/irm`)}
              >
                View Influencers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
