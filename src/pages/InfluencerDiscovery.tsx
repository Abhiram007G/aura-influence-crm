
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Users } from "lucide-react";

// Mock data for influencers
const mockInfluencers = [
  {
    id: "inf_1",
    name: "Sarah Johnson",
    handle: "@sarahjohnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
    matchScore: 92,
    niche: "Lifestyle",
    followers: "374K",
    engagementRate: "4.2%",
    collaborationRate: "$2.5K",
    detailedScores: {
      audienceMatch: 95,
      contentQuality: 88,
      engagementQuality: 94
    }
  },
  {
    id: "inf_2",
    name: "Mike Chen",
    handle: "@mikechen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    matchScore: 88,
    niche: "Tech",
    followers: "156K",
    engagementRate: "6.1%",
    collaborationRate: "$1.8K",
    detailedScores: {
      audienceMatch: 90,
      contentQuality: 85,
      engagementQuality: 89
    }
  },
  {
    id: "inf_3",
    name: "Emma Rodriguez",
    handle: "@emmarodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    matchScore: 85,
    niche: "Fashion",
    followers: "289K",
    engagementRate: "3.8%",
    collaborationRate: "$3.2K",
    detailedScores: {
      audienceMatch: 82,
      contentQuality: 92,
      engagementQuality: 81
    }
  }
];

const InfluencerDiscovery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectInfluencer = (influencerId: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(influencerId) 
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInfluencers.length === mockInfluencers.length) {
      setSelectedInfluencers([]);
    } else {
      setSelectedInfluencers(mockInfluencers.map(inf => inf.id));
    }
  };

  const handleAddToIRM = () => {
    // TODO: API call to add selected influencers to IRM
    console.log("Adding to IRM:", selectedInfluencers);
    navigate("/irm");
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (score >= 70) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Influencer Discovery</h1>
          <p className="text-muted-foreground">Campaign ID: {id}</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search influencers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 premium-input"
                />
              </div>
              <Button variant="outline" className="hover-glow">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            AI-Matched Influencers
          </CardTitle>
          <CardDescription>
            Found {mockInfluencers.length} influencers matching your campaign criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedInfluencers.length > 0 && (
            <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {selectedInfluencers.length} influencer(s) selected
                </span>
                <Button 
                  onClick={handleAddToIRM}
                  className="premium-button"
                >
                  Add Selected to IRM
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedInfluencers.length === mockInfluencers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16"></TableHead>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Match Score</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Scores</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInfluencers.map((influencer) => (
                  <TableRow 
                    key={influencer.id} 
                    className="border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedInfluencers.includes(influencer.id)}
                        onCheckedChange={() => handleSelectInfluencer(influencer.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="w-10 h-10 rounded-full border-2 border-slate-600 shadow-lg"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">{influencer.name}</div>
                        <div className="text-sm text-muted-foreground">{influencer.handle}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getMatchScoreColor(influencer.matchScore)} text-white shadow-lg`}>
                        {influencer.matchScore}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600">
                        {influencer.niche}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{influencer.followers}</TableCell>
                    <TableCell className="font-medium">{influencer.engagementRate}</TableCell>
                    <TableCell className="font-medium">{influencer.collaborationRate}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>Audience: {influencer.detailedScores.audienceMatch}%</div>
                        <div>Content: {influencer.detailedScores.contentQuality}%</div>
                        <div>Engagement: {influencer.detailedScores.engagementQuality}%</div>
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

export default InfluencerDiscovery;
