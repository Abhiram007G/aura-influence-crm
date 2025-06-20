import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Users, Phone, Mail, MessageSquare, Calendar, Loader2 } from "lucide-react";
import { config } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import SectionCard from "@/components/ui/SectionCard";

interface CreatorDetails {
  id: string;
  name: string;
  email: string;
  platform: string;
  followers_count: string;
  followers_count_numeric: number;
  engagement_rate: number;
  niche: string;
  language: string;
  country: string;
  avg_views: number;
  collaboration_rate: number;
  rating: number;
  match_percentage: number;
  profile_image: string;
  about: string;
  channel_name: string;
  created_at: string;
  updated_at: string;
}

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  category: string;
  target_audience: string;
  price_range: string;
  key_features: string[];
  brand_guidelines: string;
}

interface BrandDetails {
  id: string;
  name: string;
  industry: string;
  mission: string;
  values: string[];
  target_market: string;
  brand_voice: string;
  logo_url: string;
}

interface OutreachData {
  id: string;
  campaign_id: string;
  creator_id: string;
  channel: string;
  message_type: string;
  content: Record<string, any>;
  status: string;
  timestamp: string;
  conversation_id: string | null;
  twilio_call_sid: string | null;
  call_duration_seconds: number | null;
  call_successful: boolean | null;
  transcript_summary: string | null;
  full_transcript: string | null;
  interest_assessment_result: string | null;
  interest_assessment_rationale: string | null;
  communication_quality_result: string | null;
  communication_quality_rationale: string | null;
  interest_level: string | null;
  collaboration_rate: string | null;
  preferred_content_types: string[] | null;
  timeline_availability: string | null;
  contact_preferences: string | null;
  audience_demographics: Record<string, any> | null;
  brand_restrictions: string[] | null;
  follow_up_actions: string[] | null;
}

interface CallAnalysis {
  conversation_id: string;
  status: string;
  duration_seconds: number;
  call_successful: string;
  summary: string;
  evaluation_results: {
    interest_assessment: {
      criteria_id: string;
      result: string;
      rationale: string;
    };
    communication_quality: {
      criteria_id: string;
      result: string;
      rationale: string;
    };
    information_gathering: {
      criteria_id: string;
      result: string;
      rationale: string;
    };
    next_steps: {
      criteria_id: string;
      result: string;
      rationale: string;
    };
  };
  extracted_data: {
    interest_level: string;
    collaboration_rate: string;
    content_preferences: string;
    timeline: string;
    contact_info: string;
    follow_up_actions: string;
  };
  transcript: Array<{
    role: string;
    message: string | null;
    time_in_call_secs: number;
  }>;
}

const CampaignIRM = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [outreachData, setOutreachData] = useState<OutreachData[]>([]);
  const [creatorDetails, setCreatorDetails] = useState<Record<string, CreatorDetails>>({});
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [brandDetails, setBrandDetails] = useState<BrandDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<OutreachData | null>(null);
  const [callLoadingId, setCallLoadingId] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch outreach data
        const outreachResponse = await fetch(`${config.apiBaseUrl}/api/v1/outreach/campaign/${id}`);
        if (!outreachResponse.ok) throw new Error('Failed to fetch outreach data');
        const outreachData = await outreachResponse.json();
        setOutreachData(outreachData);

        // Fetch product details
        // const productResponse = await fetch(`${config.apiBaseUrl}/api/v1/campaigns/${id}`);
        // if (productResponse.ok) {
        //   const productData = await productResponse.json();
        //   setProductDetails(productData);
        // }

        // Fetch brand details
        const brandResponse = await fetch(`${config.apiBaseUrl}/api/v1/brands/${id}`);
        if (brandResponse.ok) {
          const brandData = await brandResponse.json();
          setBrandDetails(brandData);
        }

        // Fetch creator details
        const uniqueCreatorIds = [...new Set(outreachData.map((entry: OutreachData) => entry.creator_id))];
        const creatorDetailsPromises = uniqueCreatorIds.map(async (creatorId) => {
          try {
            const creatorResponse = await fetch(`${config.apiBaseUrl}/api/v1/creators/${creatorId}`);
            if (!creatorResponse.ok) throw new Error(`Failed to fetch creator ${creatorId}`);
            const creatorData = await creatorResponse.json();
            return [creatorId, creatorData];
          } catch (error) {
            console.error(`Error fetching creator ${creatorId}:`, error);
            return [creatorId, null];
          }
        });

        const creatorResults = await Promise.all(creatorDetailsPromises);
        const creatorDetailsMap = Object.fromEntries(
          creatorResults.filter(([_, data]) => data !== null)
        );
        setCreatorDetails(creatorDetailsMap);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initialized": return "bg-yellow-500/20 text-yellow-400";
      case "in_progress": return "bg-blue-500/20 text-blue-400";
      case "completed": return "bg-green-500/20 text-green-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleCall = async (entry: OutreachData) => {
    setCallLoadingId(entry.id);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/outreach/call/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outreach_id: entry.id,
          phone_number: "+917093458288" // This should be replaced with the actual phone number
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const data = await response.json();
      
      // Update the selected entry with the new conversation_id
      if (data.conversation_id) {
        setSelectedEntry(prev => prev ? {
          ...prev,
          conversation_id: data.conversation_id
        } : null);
      }
      
      toast({
        title: "Call Initiated",
        description: data.message || "Call has been initiated successfully",
      });
    } catch (error) {
      console.error('Error initiating call:', error);
      toast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCallLoadingId(null);
    }
  };

  const handleEmail = async (entry: OutreachData) => {
    setIsEmailLoading(true);
    const creator = creatorDetails[entry.creator_id];
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `Follow-up email sent to ${creator?.name || `Creator ${entry.creator_id}`}`,
      });
      setIsEmailLoading(false);
    }, 1000);
  };

  const fetchCallAnalysis = async (conversationId: string) => {
    if (!conversationId) return;
    
    setIsAnalysisLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/outreach/call/${conversationId}/analysis`);
      if (!response.ok) {
        throw new Error('Failed to fetch call analysis');
      }
      const data = await response.json();
      setCallAnalysis(data);
    } catch (error) {
      console.error('Error fetching call analysis:', error);
      toast({
        title: "Error",
        description: "Failed to fetch call analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEntry?.conversation_id) {
      fetchCallAnalysis(selectedEntry.conversation_id);
    } else {
      setCallAnalysis(null);
    }
  }, [selectedEntry?.conversation_id]);

  const filteredEntries = outreachData.filter(entry => {
    const creator = creatorDetails[entry.creator_id];
    const searchLower = searchTerm.toLowerCase();
    return (
      (creator?.name?.toLowerCase().includes(searchLower) || false) ||
      (creator?.channel_name?.toLowerCase().includes(searchLower) || false) ||
      entry.status.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading outreach data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-200 text-text-primary hover:bg-secondary/20 hover:border-primary transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{productDetails?.name || 'Campaign Outreach Management'}</h1>
            <p className="text-muted-foreground">
              Track and manage your influencer outreach and conversations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search creators or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/20 border-border w-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product and Brand Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {productDetails && (
          <SectionCard title="Product Details">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{productDetails.name}</h3>
                <p className="text-muted-foreground">{productDetails.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{productDetails.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="font-medium">{productDetails.price_range}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Audience</p>
                  <p className="font-medium">{productDetails.target_audience}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {productDetails.key_features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {brandDetails && (
          <SectionCard title="Brand Details">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {brandDetails.logo_url && (
                  <img
                    src={brandDetails.logo_url}
                    alt={brandDetails.name}
                    className="w-16 h-16 rounded-lg object-contain"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{brandDetails.name}</h3>
                  <p className="text-muted-foreground">{brandDetails.industry}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mission</p>
                <p className="mt-1">{brandDetails.mission}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Brand Values</p>
                <div className="flex flex-wrap gap-2">
                  {brandDetails.values.map((value, index) => (
                    <Badge key={index} variant="secondary">{value}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Target Market</p>
                  <p className="font-medium">{brandDetails.target_market}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Brand Voice</p>
                  <p className="font-medium">{brandDetails.brand_voice}</p>
                </div>
              </div>
            </div>
          </SectionCard>
        )}
      </div>

      {/* Outreach List */}
      <SectionCard title="Active Outreach">
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const creator = creatorDetails[entry.creator_id];
            return (
              <div
                key={entry.id}
                onClick={() => navigate(`/conversation/${entry.id}`)}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-border hover:bg-secondary/20 transition-all duration-200 cursor-pointer group"
              >
                {creator?.profile_image ? (
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Mike${encodeURIComponent(creator.name)}&background=6366f1&color=fff`}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center text-white">
                    <Users className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{creator?.name}</h4>
                  <p className="text-sm text-muted-foreground">{creator?.niche}</p>
                </div>
                <div className="ml-auto text-right flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(entry);
                      }}
                      disabled={callLoadingId === entry.id}
                      className="h-8 w-8 p-0 border-border hover:bg-secondary/20"
                    >
                      {callLoadingId === entry.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Phone className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.status}</p>
                  <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

export default CampaignIRM; 