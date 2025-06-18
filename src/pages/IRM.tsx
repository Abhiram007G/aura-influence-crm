import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, Phone, Mail, MessageSquare, Calendar } from "lucide-react";
import { getOutreachEntries, initiateCall, sendEmail, OutreachResponse } from "@/lib/services/outreachService";
import { useNavigate } from "react-router-dom";
import SectionCard from "@/components/ui/SectionCard";

interface IRMEntry {
  id: string;
  influencer: {
    name: string;
    handle: string;
    profileImage: string;
  };
  campaign: {
    name: string;
    id: string;
  };
  status: "contacted" | "responded" | "negotiating" | "signed" | "declined";
  lastContact: string;
  conversations: {
    type: "call" | "email";
    date: string;
    summary: string;
    sentiment: "positive" | "neutral" | "negative";
  }[];
}

const IRM = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<IRMEntry | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [irmEntries, setIrmEntries] = useState<IRMEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getOutreachEntries();
        
        // Transform API data to match IRMEntry interface
        const transformedEntries: IRMEntry[] = await Promise.all(data.map(async (entry: OutreachResponse) => {
          // Fetch creator details
          const creatorResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/creators/${entry.creator_id}`);
          const creatorData = await creatorResponse.json();
          
          // Fetch campaign details
          const campaignResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/campaigns/${entry.campaign_id}`);
          const campaignData = await campaignResponse.json();
          
          return {
            id: entry.id,
            influencer: {
              name: creatorData.name,
              handle: creatorData.handle || `@${creatorData.name.toLowerCase().replace(/\s+/g, '')}`,
              profileImage: creatorData.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorData.name}`
            },
            campaign: {
              name: campaignData.product_name,
              id: campaignData.id
            },
            status: entry.status,
            lastContact: entry.last_contact,
            conversations: entry.conversations
          };
        }));
        
        setIrmEntries(transformedEntries);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
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
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contacted": return "bg-yellow-500/20 text-yellow-400";
      case "responded": return "bg-blue-500/20 text-blue-400";
      case "negotiating": return "bg-purple-500/20 text-purple-400";
      case "signed": return "bg-green-500/20 text-green-400";
      case "declined": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-400";
      case "negative": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const handleCall = async (entry: IRMEntry) => {
    setIsCallLoading(true);
    try {
      const response = await initiateCall(entry.id, "+917093458288"); // Replace with actual phone number
      toast({
        title: "Call Initiated",
        description: response.message || `Calling ${entry.influencer.name}...`,
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

  const handleEmail = async (entry: IRMEntry) => {
    setIsEmailLoading(true);
    try {
      const response = await sendEmail(entry.id);
      toast({
        title: "Email Sent",
        description: response.message || `Follow-up email sent to ${entry.influencer.name}`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const filteredEntries = irmEntries.filter(entry =>
    entry.influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading outreach data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Influencer Relationship Manager</h1>
          <p className="text-muted-foreground">
            Track and manage your influencer outreach and conversations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search influencers or campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary/20 border-border w-80"
            />
          </div>
        </div>
      </div>

      <SectionCard title="Active Outreach">
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(`/conversation/${entry.id}`)}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-border hover:bg-secondary/20 transition-all duration-200 cursor-pointer"
            >
              <img
                src={entry.influencer.profileImage}
                alt={entry.influencer.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium">{entry.influencer.name}</h4>
                <p className="text-sm text-muted-foreground">{entry.influencer.handle}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">{entry.status}</p>
                <p className="text-xs text-muted-foreground">{entry.lastContact}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default IRM;
