import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Users, Phone, Mail, MessageSquare, Calendar, Loader2 } from "lucide-react";
import { config } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<OutreachData | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  useEffect(() => {
    const fetchOutreachData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/api/v1/outreach/campaign/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch outreach data');
        }
        
        const data = await response.json();
        setOutreachData(data);
        setError(null);

        // Fetch creator details for each unique creator
        const uniqueCreatorIds = [...new Set(data.map((entry: OutreachData) => entry.creator_id))];
        const creatorDetailsPromises = uniqueCreatorIds.map(async (creatorId) => {
          try {
            const creatorResponse = await fetch(`${config.apiBaseUrl}/api/v1/creators/${creatorId}`);
            if (!creatorResponse.ok) {
              throw new Error(`Failed to fetch creator ${creatorId}`);
            }
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
      } catch (err) {
        setError('Failed to fetch outreach data. Please try again later.');
        console.error('Error fetching outreach data:', err);
        toast({
          title: "Error",
          description: "Failed to fetch outreach data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOutreachData();
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
    setIsCallLoading(true);
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
      setIsCallLoading(false);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="border-border hover:bg-secondary/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Campaign Outreach Management</h1>
            <p className="text-muted-foreground">
              Track and manage your influencer outreach and conversations
            </p>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Outreach
              </CardTitle>
              <CardDescription>
                {filteredEntries.length} creators in your pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredEntries.map((entry) => {
                  const creator = creatorDetails[entry.creator_id];
                  return (
                    <div
                      key={entry.id}
                      onClick={() => navigate(`/conversation/${entry.id}`)}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-border hover:bg-secondary/20 transition-all duration-200 cursor-pointer"
                    >
                      {creator?.profile_image ? (
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.name}`}
                          alt={creator.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center text-white">
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">
                              {creator?.name || `Creator ${entry.creator_id}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {creator?.channel_name || entry.channel}
                            </p>
                          </div>
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{entry.message_type}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Last contact: {new Date(entry.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCall(entry);
                              }}
                              disabled={isCallLoading}
                              className="h-8 w-8 p-0 border-border hover:bg-secondary/20"
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmail(entry);
                              }}
                              disabled={isEmailLoading}
                              className="h-8 w-8 p-0 border-border hover:bg-secondary/20"
                            >
                              <Mail className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEntry ? (
                <div className="space-y-4">
                  {creatorDetails[selectedEntry.creator_id] && (
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        {creatorDetails[selectedEntry.creator_id].profile_image ? (
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedEntry.creator_id}`}
                            alt={creatorDetails[selectedEntry.creator_id].name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center text-white">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{creatorDetails[selectedEntry.creator_id].name}</p>
                          <p className="text-sm text-muted-foreground">
                            {creatorDetails[selectedEntry.creator_id].channel_name}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Followers</p>
                          <p className="font-medium">{creatorDetails[selectedEntry.creator_id].followers_count}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement Rate</p>
                          <p className="font-medium">{creatorDetails[selectedEntry.creator_id].engagement_rate}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAnalysisLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Loading call analysis...</span>
                    </div>
                  ) : callAnalysis ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Call Summary</p>
                        <p className="text-sm mt-1">{callAnalysis.summary}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Call Duration</p>
                        <p className="text-sm mt-1">{callAnalysis.duration_seconds} seconds</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Call Status</p>
                        <p className="text-sm mt-1">{callAnalysis.status}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Interest Level</p>
                        <p className="text-sm mt-1">{callAnalysis.extracted_data.interest_level}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Collaboration Rate</p>
                        <p className="text-sm mt-1">{callAnalysis.extracted_data.collaboration_rate}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Contact Info</p>
                        <p className="text-sm mt-1">{callAnalysis.extracted_data.contact_info}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Follow-up Actions</p>
                        <p className="text-sm mt-1">{callAnalysis.extracted_data.follow_up_actions}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Evaluation Results</p>
                        <div className="space-y-2">
                          {Object.entries(callAnalysis.evaluation_results).map(([key, value]) => (
                            <div key={key} className="bg-secondary/10 p-3 rounded-lg">
                              <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                              <p className="text-sm mt-1">Result: {value.result}</p>
                              <p className="text-sm mt-1 text-muted-foreground">{value.rationale}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Call Transcript</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {callAnalysis.transcript.map((message, index) => (
                            message.message && (
                              <div key={index} className={`p-2 rounded-lg ${
                                message.role === 'agent' ? 'bg-secondary/10' : 'bg-primary/10'
                              }`}>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {message.role === 'agent' ? 'Agent' : 'Creator'} • {message.time_in_call_secs}s
                                </p>
                                <p className="text-sm">{message.message}</p>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No call analysis available
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Select a creator to view conversation details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignIRM; 