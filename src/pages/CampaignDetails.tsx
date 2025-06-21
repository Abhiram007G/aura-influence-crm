import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, DollarSign, Target, Users, Briefcase, FileText, Loader2, Bot } from "lucide-react";
import { config } from "@/lib/config";
import { findSimilarInfluencers, CampaignSimilarityResponse } from "@/lib/services/campaignService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import SectionCard from "@/components/ui/SectionCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLogContext } from "@/lib/LogContext";
import { Skeleton } from "@/components/ui/skeleton";

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

// Animated Ellipsis component
const AnimatedEllipsis = () => {
  return (
    <span className="inline-block text-3xl font-bold text-gray-500" style={{ letterSpacing: '2px' }}>
      <span className="dot-anim">.</span>
      <span className="dot-anim">.</span>
      <span className="dot-anim">.</span>
    </span>
  );
};

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [findingInfluencers, setFindingInfluencers] = useState(false);
  const [isAutoPilotOpen, setIsAutoPilotOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);

  // Use global log context
  const { getLogs, startLogStream } = useLogContext();
  const { logs, isStreaming, streamError } = getLogs(id || "");

  const phases = [
    {
      title: "Matching Phase",
      description: "🔍 Scanning the creator universe for your perfect matches...",
    },
    {
      title: "Finding Phase",
      description: "📍 Locked onto target influencers, initiating contact protocol...",
    },
    {
      title: "Calling Phase",
      description: "📞 Establishing communication channels with selected creators...",
    },
    {
      title: "Negotiating Phase",
      description: "🤝 Working our AI magic to craft irresistible partnership deals...",
    },
  ];

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

  useEffect(() => {
    if (isAutoPilotOpen) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentPhase((phase) => (phase + 1) % phases.length);
            return 0;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAutoPilotOpen]);

  // Helper to parse stream lines
  const parseStreamLine = (line: string) => {
    try {
      if (line.startsWith('data: ')) {
        return JSON.parse(line.replace('data: ', ''));
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  // Open log sheet and trigger auto-pilot if needed
  const handleAutoPilot = () => {
    setIsAutoPilotOpen(true);
    setIsLogSheetOpen(true);
    if (id) startLogStream(id);
  };
  const handleLogsClick = () => {
    setIsLogSheetOpen(true);
  };

  // Helper to format time in IST
  const formatIST = (utcString: string) => {
    const date = new Date(utcString);
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60; // in minutes
    const localTime = new Date(date.getTime() + (istOffset * 60 * 1000));
    return localTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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

  // Helper to check if execution is completed
  const isExecutionCompleted = logs.some(
    (log) => log.status === 'completed' || log.progress === 100
  );

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
      <SectionCard className="!mb-0">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/campaigns')}
              className="bg-white border border-slate-200 text-text-primary hover:bg-secondary/20 hover:border-primary transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{campaign.product_name}</h1>
              <p className="text-muted-foreground">{campaign.brand_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
                onClick={handleAutoPilot}
              >
                <Bot className="w-4 h-4 mr-2" />
                Auto Co-Pilot
              </Button>
              <Button
                variant="ghost"
                className="p-2"
                onClick={handleLogsClick}
                aria-label="Show Logs"
              >
                <FileText className="w-5 h-5 text-primary" />
              </Button>
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status}
              </Badge>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Logs Bottom Sheet */}
      <Sheet open={isLogSheetOpen} onOpenChange={setIsLogSheetOpen}>
        <SheetContent side="bottom" className="max-h-[70vh] overflow-y-auto rounded-t-2xl p-0 sm:p-0">
          <SheetHeader className="sticky top-0 z-10 bg-background p-4 border-b flex flex-row items-center justify-between">
            <SheetTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Campaign Agent Logs
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-2 min-h-[200px] max-h-[60vh] overflow-y-auto">
            {streamError && (
              <div className="text-red-500 text-center">{streamError}</div>
            )}
            {logs.length === 0 && isStreaming && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                Connecting to agent...
              </div>
            )}
            {logs.map((log, idx) => {
              const isLatest = idx === logs.length - 1 && isStreaming;
              return (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-2 text-sm">
                    <div className={isLatest ? "shimmer-container" : undefined}>
                      <span className={`font-medium${isLatest ? " shimmer-text" : ""}`}>
                        {log.message}
                      </span>
                      {log.progress !== undefined && (
                        <span className="ml-2 text-xs text-muted-foreground">({log.progress}%)</span>
                      )}
                      <div className="text-xs text-muted-foreground">{formatIST(log.timestamp)} IST</div>
                    </div>
                  </div>
                  {/* Show creator details below the creators_found log */}
                  {log.status === 'creators_found' && log.data && Array.isArray(log.data.creator_details) && log.data.creator_details.length > 0 && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {log.data.creator_details.map((creator: any, cidx: number) => (
                        <div key={creator.id || cidx} className="flex flex-wrap items-center gap-3 text-xs bg-muted/50 rounded px-2 py-1">
                          <span className="font-semibold">👤 {creator.name}</span>
                          <span>🏷️ {creator.niche}</span>
                          <span>👥 {creator.followers.toLocaleString()} followers</span>
                          <span>💰 ₹{creator.typical_rate}</span>
                          <span>⭐ {Math.round(creator.match_score * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {isExecutionCompleted && (
              <div className="text-center text-green-600 font-semibold pt-2">Agent finished execution.</div>
            )}
          </div>
          {/* Animated ellipsis at the bottom when streaming */}
          {isStreaming && !isExecutionCompleted && (
              <Skeleton className="h-4 w-[250px]" />
          )}
        </SheetContent>
      </Sheet>

      {/* Auto Pilot Dialog */}
      <Dialog open={isAutoPilotOpen} onOpenChange={setIsAutoPilotOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold gradient-text">
              Auto Co-Pilot in Action
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* <div className="space-y-2">
              <h3 className="text-lg font-semibold text-center">
                {phases[currentPhase].title}
              </h3>
              <p className="text-center text-muted-foreground">
                {phases[currentPhase].description}
              </p>
            </div>
            
            <Progress value={progress} className="h-2" /> */}
            
            <div className="flex justify-center">
              <img 
                src="https://media1.tenor.com/m/1YXq17YXn98AAAAd/chill-dude-chill.gif" 
                alt="Loading" 
                className="w-32 h-32 rounded-lg"
              />
            </div>
            
            <p className="text-center text-sm text-muted-foreground italic">
              Our AI agents are working on your task. You can close this and come back later - we'll keep the magic happening in the background! ✨
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Campaign Overview">
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
          </SectionCard>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <SectionCard title="Campaign Stats">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-purple rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="font-semibold text-foreground">₹{campaign.total_budget.toLocaleString()}</p>
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
          </SectionCard>

          <SectionCard title="Actions">
            <div className="space-y-3">
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
                className="w-full bg-white border border-slate-200 text-text-primary hover:bg-secondary/20 hover:border-primary transition"
                onClick={() => navigate(`/campaign/${id}/irm`)}
              >
                View Influencers
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
