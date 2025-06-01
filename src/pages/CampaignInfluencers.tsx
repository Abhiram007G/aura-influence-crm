import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Loader2, Heart, MessageCircle, Target, Users2, TrendingUp, DollarSign, Check } from "lucide-react";
import { CampaignSimilarityResponse } from "@/lib/services/campaignService";
import { config } from "@/lib/config";
import { Checkbox } from "@/components/ui/checkbox";

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

interface DetailedScores {
  niche_match: string;
  audience_match: string;
  engagement_score: string;
  budget_fit: string;
}

interface InfluencerMatch {
  id: string;
  influencer_name: string;
  match_score: string;
  niche: string;
  followers: string;
  engagement: string;
  collaboration_rate: string;
  detailed_scores: DetailedScores;
}

interface SimilarInfluencersResponse {
  matches: InfluencerMatch[];
  total_matches: number;
  search_parameters: {
    campaign_id: string;
    campaign_name: string;
    match_threshold: number;
    match_count: number;
  };
}

const CampaignInfluencers = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarInfluencers, setSimilarInfluencers] = useState<SimilarInfluencersResponse | null>(null);
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [isOutreachLoading, setIsOutreachLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch campaign details
        const campaignResponse = await fetch(`${config.apiBaseUrl}/api/v1/campaigns/${id}`);
        if (!campaignResponse.ok) {
          throw new Error('Failed to fetch campaign details');
        }
        const campaignData = await campaignResponse.json();
        setCampaign(campaignData);

        // Get the similar influencers data from localStorage
        const storedData = localStorage.getItem('similarInfluencers');
        if (storedData) {
          const data = JSON.parse(storedData);
          setSimilarInfluencers(data);
        } else {
          setError('No influencer data found');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getMatchScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return "bg-green-500/20 text-green-400";
    if (numScore >= 60) return "bg-blue-500/20 text-blue-400";
    if (numScore >= 40) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const getDetailedScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return "text-green-400";
    if (numScore >= 60) return "text-blue-400";
    if (numScore >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const handleCheckboxChange = (influencerId: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(influencerId)
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
  };

  const handleOutreach = async () => {
    if (!selectedInfluencers.length || !id) return;
    
    setIsOutreachLoading(true);
    try {
      // Make API calls for each selected influencer
      const outreachPromises = selectedInfluencers.map(influencerId =>
        fetch(`${config.apiBaseUrl}/api/v1/outreach/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaign_id: id,
            creator_id: influencerId
          })
        })
      );

      await Promise.all(outreachPromises);
      navigate(`/campaign/${id}/irm`); // Navigate to campaign-specific IRM page
    } catch (error) {
      console.error('Error during outreach:', error);
      setError('Failed to initiate outreach');
    } finally {
      setIsOutreachLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading influencers...</p>
        </div>
      </div>
    );
  }

  if (error || !similarInfluencers) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-500">{error || 'Failed to load influencers'}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate(`/campaigns/${id}`)}
          >
            Back to Campaign
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/campaigns/${id}`)}
            className="border-border hover:bg-secondary/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Similar Influencers</h1>
            {campaign && (
              <div className="text-muted-foreground">
                <p>Campaign: {campaign.product_name} by {campaign.brand_name}</p>
                <p>Found {similarInfluencers.total_matches} influencers matching your campaign</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Matching Influencers
              </CardTitle>
              <CardDescription>
                These influencers have been selected based on their relevance to your campaign
              </CardDescription>
            </div>
            {selectedInfluencers.length > 0 && (
              <Button 
                onClick={handleOutreach}
                disabled={isOutreachLoading}
                className="premium-button"
              >
                {isOutreachLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initiating Outreach...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Outreach ({selectedInfluencers.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedInfluencers.length === similarInfluencers?.matches.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInfluencers(similarInfluencers?.matches.map(m => m.id) || []);
                        } else {
                          setSelectedInfluencers([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Match Score</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Collaboration Rate</TableHead>
                  <TableHead>Detailed Scores</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {similarInfluencers.matches.map((influencer) => (
                  <TableRow 
                    key={influencer.id}
                    className="border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedInfluencers.includes(influencer.id)}
                        onCheckedChange={() => handleCheckboxChange(influencer.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{influencer.influencer_name}</div>
                        <div className="text-sm text-muted-foreground">ID: {influencer.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMatchScoreColor(influencer.match_score)}>
                        {influencer.match_score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600">
                        {influencer.niche}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {influencer.followers}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        {influencer.engagement}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600">
                        {influencer.collaboration_rate}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Target className="w-3 h-3" />
                          <span className={getDetailedScoreColor(influencer.detailed_scores.niche_match)}>
                            Niche: {influencer.detailed_scores.niche_match}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users2 className="w-3 h-3" />
                          <span className={getDetailedScoreColor(influencer.detailed_scores.audience_match)}>
                            Audience: {influencer.detailed_scores.audience_match}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="w-3 h-3" />
                          <span className={getDetailedScoreColor(influencer.detailed_scores.engagement_score)}>
                            Engagement: {influencer.detailed_scores.engagement_score}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="w-3 h-3" />
                          <span className={getDetailedScoreColor(influencer.detailed_scores.budget_fit)}>
                            Budget: {influencer.detailed_scores.budget_fit}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="hover-glow">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="premium-button">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignInfluencers; 