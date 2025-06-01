
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, ArrowRight, Star } from "lucide-react";

interface Influencer {
  id: string;
  name: string;
  handle: string;
  profileImage: string;
  matchScore: number;
  niche: string;
  followers: string;
  engagementRate: number;
  collaborationRate: number;
  detailedScores: {
    audienceMatch: number;
    contentQuality: number;
    brandAlignment: number;
  };
}

const InfluencerDiscovery = () => {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToIRM, setIsAddingToIRM] = useState(false);

  // Mock data - in real app, this would come from API
  const [influencers] = useState<Influencer[]>([
    {
      id: "inf_1",
      name: "Sarah Johnson",
      handle: "@sarahjohnson",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      matchScore: 95,
      niche: "Fashion",
      followers: "374K",
      engagementRate: 4.2,
      collaborationRate: 85,
      detailedScores: { audienceMatch: 92, contentQuality: 96, brandAlignment: 98 }
    },
    {
      id: "inf_2",
      name: "Mike Chen",
      handle: "@mikechen",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      matchScore: 89,
      niche: "Tech",
      followers: "125K",
      engagementRate: 5.1,
      collaborationRate: 92,
      detailedScores: { audienceMatch: 88, contentQuality: 91, brandAlignment: 88 }
    },
    {
      id: "inf_3",
      name: "Emma Wilson",
      handle: "@emmawilson",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      matchScore: 87,
      niche: "Lifestyle",
      followers: "298K",
      engagementRate: 3.8,
      collaborationRate: 78,
      detailedScores: { audienceMatch: 85, contentQuality: 89, brandAlignment: 87 }
    },
    {
      id: "inf_4",
      name: "Alex Rodriguez",
      handle: "@alexrodriguez",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      matchScore: 82,
      niche: "Fitness",
      followers: "456K",
      engagementRate: 4.7,
      collaborationRate: 81,
      detailedScores: { audienceMatch: 80, contentQuality: 84, brandAlignment: 82 }
    }
  ]);

  useEffect(() => {
    // Simulate loading AI matches
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleSelectInfluencer = (influencerId: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(influencerId)
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedInfluencers(
      selectedInfluencers.length === influencers.length ? [] : influencers.map(inf => inf.id)
    );
  };

  const handleAddToIRM = async () => {
    if (selectedInfluencers.length === 0) return;
    
    setIsAddingToIRM(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Influencers Added to IRM!",
        description: `${selectedInfluencers.length} influencers have been added to your Influencer Relationship Manager.`,
      });
      
      navigate('/irm');
    }, 1500);
  };

  const filteredInfluencers = influencers.filter(inf =>
    inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inf.niche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500/20 text-green-400";
    if (score >= 80) return "bg-yellow-500/20 text-yellow-400";
    return "bg-orange-500/20 text-orange-400";
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-purple rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Finding Perfect Matches</h1>
            <p className="text-muted-foreground">
              Our AI is analyzing thousands of influencers to find the best fits for your campaign
            </p>
          </div>
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Influencer Discovery</h1>
          <p className="text-muted-foreground">
            AI-matched influencers for Campaign #{campaignId?.slice(-6)}
          </p>
        </div>
        <Button
          onClick={handleAddToIRM}
          disabled={selectedInfluencers.length === 0 || isAddingToIRM}
          className="bg-gradient-purple hover:opacity-90 text-white disabled:opacity-50"
        >
          {isAddingToIRM ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding to IRM...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Add Selected to IRM ({selectedInfluencers.length})
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-text">AI-Matched Influencers</CardTitle>
              <CardDescription>
                {filteredInfluencers.length} influencers found based on your campaign criteria
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search influencers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary/20 border-border w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-border">
              <Checkbox
                checked={selectedInfluencers.length === influencers.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                Select All ({influencers.length})
              </span>
            </div>

            <div className="space-y-3">
              {filteredInfluencers.map((influencer) => (
                <div
                  key={influencer.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-border hover:bg-secondary/20 transition-all duration-200"
                >
                  <Checkbox
                    checked={selectedInfluencers.includes(influencer.id)}
                    onCheckedChange={() => handleSelectInfluencer(influencer.id)}
                  />
                  
                  <img
                    src={influencer.profileImage}
                    alt={influencer.name}
                    className="w-12 h-12 rounded-full"
                  />
                  
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="font-medium text-foreground">{influencer.name}</p>
                      <p className="text-sm text-muted-foreground">{influencer.handle}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${getScoreBadgeColor(influencer.matchScore)} font-medium`}>
                        <Star className="w-3 h-3 mr-1" />
                        {influencer.matchScore}%
                      </Badge>
                    </div>
                    
                    <div>
                      <Badge variant="outline" className="border-border">
                        {influencer.niche}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="font-medium text-foreground">{influencer.followers}</p>
                      <p className="text-sm text-muted-foreground">followers</p>
                    </div>
                    
                    <div>
                      <p className="font-medium text-foreground">{influencer.engagementRate}%</p>
                      <p className="text-sm text-muted-foreground">engagement</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>Audience:</span>
                          <span className={getScoreColor(influencer.detailedScores.audienceMatch)}>
                            {influencer.detailedScores.audienceMatch}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>Content:</span>
                          <span className={getScoreColor(influencer.detailedScores.contentQuality)}>
                            {influencer.detailedScores.contentQuality}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>Brand:</span>
                          <span className={getScoreColor(influencer.detailedScores.brandAlignment)}>
                            {influencer.detailedScores.brandAlignment}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerDiscovery;
