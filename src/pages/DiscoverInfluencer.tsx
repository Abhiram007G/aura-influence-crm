import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Users, Loader2, Heart, MessageCircle, Eye } from "lucide-react";
import { useCreators } from "@/hooks/useCreators";
import { CreatorSearchParams } from "@/lib/services/creatorService";
import { debounce } from "lodash";

const DiscoverInfluencer = () => {
  const [searchParams, setSearchParams] = useState<CreatorSearchParams>({
    search: "",
    platform: undefined,
    niche: undefined,
    min_followers: undefined,
    max_followers: undefined,
    country: undefined,
    language: undefined,
    min_engagement: undefined,
    limit: 40,
    offset: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  const { creators, loading, error, fetchCreators } = useCreators();

  // Fetch creators when search params change
  useEffect(() => {
    console.log('Search params changed:', searchParams);
    fetchCreators(searchParams);
  }, [searchParams, fetchCreators]);

  // Add debug log for creators data
  useEffect(() => {
    console.log('Creators data updated:', creators);
  }, [creators]);

  const handleFilterChange = (key: keyof CreatorSearchParams, value: string | number | undefined) => {
    console.log('Filter changed:', key, value);
    
    // Validate and transform the value based on the key
    let processedValue: string | number | undefined = value;
    
    if (value === '') {
      processedValue = undefined;
    } else if (key === 'min_followers' || key === 'max_followers') {
      processedValue = value ? Number(value) : undefined;
      if (processedValue !== undefined && isNaN(processedValue)) {
        console.warn(`Invalid number for ${key}:`, value);
        return;
      }
    } else if (key === 'min_engagement') {
      processedValue = value ? Number(value) : undefined;
      if (processedValue !== undefined && (isNaN(processedValue) || processedValue < 0 || processedValue > 100)) {
        console.warn(`Invalid engagement rate for ${key}:`, value);
        return;
      }
    }

    setSearchParams(prev => {
      const newParams = {
        ...prev,
        [key]: processedValue,
        offset: 0 // Reset pagination when filters change
      };
      console.log('New search params:', newParams);
      return newParams;
    });
  };

  // Add a debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      handleSearch(value);
    }, 300),
    []
  );

  const handleSearch = (value: string) => {
    console.log('Search value changed:', value);
    setSearchParams(prev => ({
      ...prev,
      search: value,
      offset: 0
    }));
  };

  // Add error handling for the API response
  useEffect(() => {
    if (error) {
      console.error('Error fetching creators:', error);
      // You might want to show a toast notification here
    }
  }, [error]);

  // Add loading state handling
  useEffect(() => {
    if (loading) {
      console.log('Loading creators...');
    } else {
      console.log('Loading complete. Creators:', creators);
    }
  }, [loading, creators]);

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (rate >= 3) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    if (rate >= 1) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Discover Influencers</h1>
          <p className="text-muted-foreground">Find and connect with creators that match your brand</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="premium-card">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search influencers by name..."
                    value={searchParams.search || ""}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="pl-10 premium-input"
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="hover-glow"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-700/50">
                  <Select 
                    value={searchParams.platform} 
                    onValueChange={(value) => handleFilterChange('platform', value)}
                  >
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={searchParams.niche}
                    onValueChange={(value) => handleFilterChange('niche', value)}
                  >
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="Niche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={searchParams.language}
                    onValueChange={(value) => handleFilterChange('language', value)}
                  >
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={searchParams.country}
                    onValueChange={(value) => handleFilterChange('country', value)}
                  >
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Min Followers"
                    type="number"
                    min="0"
                    value={searchParams.min_followers || ""}
                    onChange={(e) => handleFilterChange('min_followers', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="premium-input"
                  />

                  <Input
                    placeholder="Max Followers"
                    type="number"
                    min="0"
                    value={searchParams.max_followers || ""}
                    onChange={(e) => handleFilterChange('max_followers', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="premium-input"
                  />

                  <Input
                    placeholder="Min Engagement Rate (%)"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={searchParams.min_engagement || ""}
                    onChange={(e) => handleFilterChange('min_engagement', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="premium-input"
                  />

                  <Select 
                    value={searchParams.limit?.toString()}
                    onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
                  >
                    <SelectTrigger className="premium-input">
                      <SelectValue placeholder="Results per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Creator Discovery Results
          </CardTitle>
          <CardDescription>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching creators...
              </span>
            ) : error ? (
              <span className="text-red-500">Error loading creators: {error.message}</span>
            ) : (
              <span>Found {creators?.creators?.length || 0} creators matching your criteria</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="w-16"></TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading creators...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-red-500">
                      Error loading creators: {error.message}
                    </TableCell>
                  </TableRow>
                ) : !creators?.creators || creators.creators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No creators found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  creators.creators.map((creator) => {
                    // Add console log to debug each creator
                    console.log('Rendering creator:', creator);
                    
                    return (
                      <TableRow 
                        key={creator.id} 
                        className="border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                      >
                        <TableCell>
                          <img
                            src={creator.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=6366f1&color=fff`}
                            alt={creator.name}
                            className="w-10 h-10 rounded-full border-2 border-slate-600 shadow-lg"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{creator.name}</div>
                            <div className="text-sm text-muted-foreground">@{creator.channel_name || creator.handle || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 capitalize">
                            {creator.platform || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600">
                            {creator.niche || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {creator.followers_count}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getEngagementColor(creator.engagement_rate || 0)} text-white shadow-lg`}>
                            {(creator.engagement_rate || 0).toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {creator.country || 'N/A'}
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverInfluencer;
