import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Phone, Mail, MessageSquare, Calendar, Loader2, Star, TrendingUp, Clock, User, Mail as MailIcon, Phone as PhoneIcon, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { config } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const ConversationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [outreachData, setOutreachData] = useState<OutreachData | null>(null);
  const [creatorDetails, setCreatorDetails] = useState<CreatorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/api/v1/outreach/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch outreach data');
        }
        
        const data = await response.json();
        setOutreachData(data);

        // Fetch creator details
        const creatorResponse = await fetch(`${config.apiBaseUrl}/api/v1/creators/${data.creator_id}`);
        if (!creatorResponse.ok) {
          throw new Error(`Failed to fetch creator details`);
        }
        const creatorData = await creatorResponse.json();
        setCreatorDetails(creatorData);

        // Fetch call analysis if conversation_id exists
        if (data.conversation_id) {
          const analysisResponse = await fetch(`${config.apiBaseUrl}/api/v1/outreach/call/${data.conversation_id}/analysis`);
          if (analysisResponse.ok) {
            const analysisData = await analysisResponse.json();
            setCallAnalysis(analysisData);
          }
        }

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

  const handleCall = async () => {
    if (!outreachData) return;
    
    setIsCallLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/outreach/call/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outreach_id: outreachData.id,
          phone_number: "+917093458288" // This should be replaced with the actual phone number
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const data = await response.json();
      
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

  const handleEmail = async () => {
    if (!outreachData || !creatorDetails) return;
    
    setIsEmailLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `Follow-up email sent to ${creatorDetails.name}`,
      });
      setIsEmailLoading(false);
    }, 1000);
  };

  const handleAudioFetch = async () => {
    if (!outreachData?.conversation_id) return;
    
    setIsAudioLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/outreach/call/${outreachData.conversation_id}/audio`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      // Create audio element
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      setAudioElement(audio);
    } catch (error) {
      console.error('Error fetching audio:', error);
      toast({
        title: "Error",
        description: "Failed to fetch call recording. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAudioLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioElement) return;
    const newTime = value[0];
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioElement) return;
    const newVolume = value[0];
    audioElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioElement) return;
    if (isMuted) {
      audioElement.volume = volume;
      setIsMuted(false);
    } else {
      audioElement.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePlaybackRateChange = (value: string) => {
    if (!audioElement) return;
    const rate = parseFloat(value);
    audioElement.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading conversation details...</p>
        </div>
      </div>
    );
  }

  if (error || !outreachData || !creatorDetails) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-red-500">{error || "Failed to load conversation details"}</p>
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
            <h1 className="text-3xl font-bold gradient-text">Conversation Details</h1>
            <p className="text-muted-foreground">
              Detailed view of your conversation with {creatorDetails.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCall}
            disabled={isCallLoading}
            className="border-border hover:bg-secondary/20"
          >
            <Phone className="w-4 h-4 mr-2" />
            {isCallLoading ? "Initiating..." : "Call"}
          </Button>
          <Button
            variant="outline"
            onClick={handleEmail}
            disabled={isEmailLoading}
            className="border-border hover:bg-secondary/20"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isEmailLoading ? "Sending..." : "Email"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Profile Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              <Users className="w-5 h-5" />
              Creator Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {creatorDetails.profile_image ? (
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorDetails.name}`}
                    alt={creatorDetails.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-purple flex items-center justify-center text-white">
                    <Users className="w-10 h-10" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{creatorDetails.name}</h3>
                  <p className="text-muted-foreground">{creatorDetails.channel_name}</p>
                  <Badge className="mt-2">{creatorDetails.platform}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Followers</span>
                  </div>
                  <p className="font-medium">{creatorDetails.followers_count}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-4 h-4" />
                    <span>Engagement Rate</span>
                  </div>
                  <p className="font-medium">{creatorDetails.engagement_rate}%</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Avg. Views</span>
                  </div>
                  <p className="font-medium">{creatorDetails.avg_views.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Niche</span>
                  </div>
                  <p className="font-medium">{creatorDetails.niche}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MailIcon className="w-4 h-4" />
                  <span>Contact</span>
                </div>
                <p className="font-medium">{creatorDetails.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PhoneIcon className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">{creatorDetails.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="call-analysis">Call Analysis</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="recording">Call Recording</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Conversation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={outreachData.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {outreachData.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Last Contact</p>
                      <p className="font-medium">{new Date(outreachData.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Channel</p>
                      <p className="font-medium">{outreachData.channel}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Message Type</p>
                      <p className="font-medium">{outreachData.message_type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {callAnalysis && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="gradient-text">Call Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{callAnalysis.summary}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{callAnalysis.duration_seconds} seconds</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">{callAnalysis.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="call-analysis" className="space-y-4">
              {callAnalysis ? (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="gradient-text">Call Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Interest Level</p>
                          <p className="font-medium">{callAnalysis.extracted_data.interest_level}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Collaboration Rate</p>
                          <p className="font-medium">{callAnalysis.extracted_data.collaboration_rate}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Evaluation Results</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {Object.entries(callAnalysis.evaluation_results).map(([key, value]) => (
                            <div key={key} className="bg-secondary/10 p-4 rounded-lg">
                              <p className="font-medium capitalize mb-2">{key.replace(/_/g, ' ')}</p>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Result</p>
                                  <p className="font-medium">{value.result}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Rationale</p>
                                  <p className="text-sm">{value.rationale}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Extracted Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Content Preferences</p>
                            <p className="font-medium">{callAnalysis.extracted_data.content_preferences}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Timeline</p>
                            <p className="font-medium">{callAnalysis.extracted_data.timeline}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Contact Info</p>
                            <p className="font-medium">{callAnalysis.extracted_data.contact_info}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Follow-up Actions</p>
                            <p className="font-medium">{callAnalysis.extracted_data.follow_up_actions}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card">
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No call analysis available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="transcript" className="space-y-4">
              {callAnalysis ? (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="gradient-text">Call Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {callAnalysis.transcript.map((message, index) => (
                        message.message && (
                          <div key={index} className={`p-4 rounded-lg ${
                            message.role === 'agent' ? 'bg-secondary/10' : 'bg-primary/10'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-medium ${
                                message.role === 'agent' ? 'text-blue-400' : 'text-purple-400'
                              }`}>
                                {message.role === 'agent' ? 'Agent' : 'Creator'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {message.time_in_call_secs}s
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card">
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">No transcript available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recording" className="space-y-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="gradient-text">Call Recording</CardTitle>
                </CardHeader>
                <CardContent>
                  {!outreachData?.conversation_id ? (
                    <p className="text-center text-muted-foreground">No call recording available</p>
                  ) : (
                    <div className="space-y-4">
                      {isAudioLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="ml-2">Loading recording...</span>
                        </div>
                      ) : !audioUrl ? (
                        <div className="text-center py-8">
                          <Button
                            onClick={handleAudioFetch}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Load Recording
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 py-4">
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{formatTime(currentTime)}</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                            <Slider
                              value={[currentTime]}
                              max={duration}
                              step={1}
                              onValueChange={handleProgressChange}
                              className="w-full"
                            />
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Button
                                onClick={togglePlayback}
                                className="bg-primary hover:bg-primary/90"
                                size="icon"
                              >
                                {isPlaying ? (
                                  <Pause className="w-5 h-5" />
                                ) : (
                                  <Play className="w-5 h-5" />
                                )}
                              </Button>

                              {/* Volume Control */}
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={toggleMute}
                                  variant="ghost"
                                  size="icon"
                                >
                                  {isMuted ? (
                                    <VolumeX className="w-5 h-5" />
                                  ) : (
                                    <Volume2 className="w-5 h-5" />
                                  )}
                                </Button>
                                <Slider
                                  value={[volume]}
                                  max={1}
                                  step={0.1}
                                  onValueChange={handleVolumeChange}
                                  className="w-24"
                                />
                              </div>
                            </div>

                            {/* Playback Speed */}
                            <Select
                              value={playbackRate.toString()}
                              onValueChange={handlePlaybackRateChange}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Speed" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.5">0.5x</SelectItem>
                                <SelectItem value="1">1x</SelectItem>
                                <SelectItem value="1.5">1.5x</SelectItem>
                                <SelectItem value="2">2x</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetails; 