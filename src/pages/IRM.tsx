
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, Phone, Mail, MessageSquare, Calendar } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<IRMEntry | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Mock data
  const [irmEntries] = useState<IRMEntry[]>([
    {
      id: "irm_1",
      influencer: {
        name: "Sarah Johnson",
        handle: "@sarahjohnson",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      },
      campaign: {
        name: "Summer Collection Launch",
        id: "camp_1"
      },
      status: "responded",
      lastContact: "2024-06-01",
      conversations: [
        {
          type: "email",
          date: "2024-05-30",
          summary: "Initial outreach email sent with campaign details and collaboration proposal.",
          sentiment: "neutral"
        },
        {
          type: "email",
          date: "2024-06-01",
          summary: "Sarah responded positively, interested in collaboration. Requested more details about compensation.",
          sentiment: "positive"
        }
      ]
    },
    {
      id: "irm_2",
      influencer: {
        name: "Mike Chen",
        handle: "@mikechen",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
      },
      campaign: {
        name: "Tech Product Review",
        id: "camp_2"
      },
      status: "contacted",
      lastContact: "2024-05-28",
      conversations: [
        {
          type: "call",
          date: "2024-05-28",
          summary: "Initial call to introduce the brand and discuss potential collaboration. Mike seemed interested but needs to review his schedule.",
          sentiment: "positive"
        }
      ]
    },
    {
      id: "irm_3",
      influencer: {
        name: "Emma Wilson",
        handle: "@emmawilson",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
      },
      campaign: {
        name: "Lifestyle Brand Partnership",
        id: "camp_3"
      },
      status: "negotiating",
      lastContact: "2024-06-02",
      conversations: [
        {
          type: "email",
          date: "2024-05-25",
          summary: "Initial outreach with collaboration proposal.",
          sentiment: "neutral"
        },
        {
          type: "call",
          date: "2024-06-02",
          summary: "Discussed terms and deliverables. Emma requested higher compensation and additional usage rights.",
          sentiment: "neutral"
        }
      ]
    }
  ]);

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
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Call Initiated",
        description: `Calling ${entry.influencer.name}...`,
      });
      setIsCallLoading(false);
    }, 1000);
  };

  const handleEmail = async (entry: IRMEntry) => {
    setIsEmailLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `Follow-up email sent to ${entry.influencer.name}`,
      });
      setIsEmailLoading(false);
    }, 1000);
  };

  const filteredEntries = irmEntries.filter(entry =>
    entry.influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="gradient-text flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active Outreach
              </CardTitle>
              <CardDescription>
                {filteredEntries.length} influencers in your pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-border hover:bg-secondary/20 transition-all duration-200 cursor-pointer"
                  >
                    <img
                      src={entry.influencer.profileImage}
                      alt={entry.influencer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">{entry.influencer.name}</p>
                          <p className="text-sm text-muted-foreground">{entry.influencer.handle}</p>
                        </div>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{entry.campaign.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last contact: {new Date(entry.lastContact).toLocaleDateString()}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedEntry ? (
            <Card className="glass-card sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedEntry.influencer.profileImage}
                    alt={selectedEntry.influencer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{selectedEntry.influencer.name}</CardTitle>
                    <CardDescription>{selectedEntry.influencer.handle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Campaign</h4>
                  <p className="text-sm text-muted-foreground">{selectedEntry.campaign.name}</p>
                  <Badge className={`${getStatusColor(selectedEntry.status)} mt-2`}>
                    {selectedEntry.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Conversation History
                  </h4>
                  <div className="space-y-3">
                    {selectedEntry.conversations.map((conversation, index) => (
                      <div key={index} className="p-3 rounded-lg bg-secondary/10 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {conversation.type === "call" ? (
                              <Phone className="w-3 h-3 text-blue-400" />
                            ) : (
                              <Mail className="w-3 h-3 text-purple-400" />
                            )}
                            <span className="text-xs font-medium capitalize">{conversation.type}</span>
                            <span className={`text-xs ${getSentimentColor(conversation.sentiment)}`}>
                              {conversation.sentiment}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conversation.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{conversation.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleCall(selectedEntry)}
                    disabled={isCallLoading}
                    className="w-full bg-gradient-blue hover:opacity-90 text-white"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {isCallLoading ? "Calling..." : "Initiate Call"}
                  </Button>
                  <Button
                    onClick={() => handleEmail(selectedEntry)}
                    disabled={isEmailLoading}
                    variant="outline"
                    className="w-full border-border hover:bg-secondary/20"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isEmailLoading ? "Sending..." : "Send Email"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Select an influencer to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IRM;
