import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Users, Loader2 } from "lucide-react";
import { useCreators } from "@/hooks/useCreators";
import { CreatorSearchParams } from "@/lib/services/creatorService";

const InfluencerDiscovery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<CreatorSearchParams>({
    search: "",
    limit: 20,
    offset: 0
  });

  const { creators, loading, error, fetchCreators } = useCreators();

  // Fetch creators when search params change
  useEffect(() => {
    fetchCreators(searchParams);
  }, [searchParams, fetchCreators]);

  const handleSelectInfluencer = (influencerId: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(influencerId) 
        ? prev.filter(id => id !== influencerId)
        : [...prev, influencerId]
    );
  };

  const handleSelectAll = () => {
    if (!creators?.items) return;
    
    if (selectedInfluencers.length === creators.items.length) {
      setSelectedInfluencers([]);
    } else {
      setSelectedInfluencers(creators.items.map(inf => inf.id));
    }
  };

  const handleAddToIRM = () => {
    // TODO: API call to add selected influencers to IRM
    console.log("Adding to IRM:", selectedInfluencers);
    navigate("/irm");
  };

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: value,
      offset: 0 // Reset offset when searching
    }));
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
                  value={searchParams.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
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
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading influencers...
              </div>
            ) : error ? (
              <div className="text-red-500">Error loading influencers: {error.message}</div>
            ) : (
              `Found ${creators?.items?.length || 0} influencers matching your criteria`
            )}
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
                      checked={creators?.items && selectedInfluencers.length === creators.items.length}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading influencers...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-red-500">
                      Error loading influencers: {error.message}
                    </TableCell>
                  </TableRow>
                ) : creators?.items?.map((influencer) => (
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
                      <Badge className={`${getMatchScoreColor(influencer.match_score)} text-white shadow-lg`}>
                        {influencer.match_score}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600">
                        {influencer.niche}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{influencer.followers_count}</TableCell>
                    <TableCell className="font-medium">{influencer.engagement_rate}%</TableCell>
                    <TableCell className="font-medium">${influencer.collaboration_rate}</TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>Audience: {influencer.audience_match}%</div>
                        <div>Content: {influencer.content_quality}%</div>
                        <div>Engagement: {influencer.engagement_quality}%</div>
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
