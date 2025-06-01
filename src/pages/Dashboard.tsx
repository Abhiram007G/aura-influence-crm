
import { BarChart3, Megaphone, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      change: "+2 this week",
      icon: Megaphone,
      color: "text-purple-400"
    },
    {
      title: "Influencers Contacted",
      value: "284",
      change: "+12% from last month",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Response Rate",
      value: "68%",
      change: "+5% from last month",
      icon: TrendingUp,
      color: "text-cyan-400"
    },
    {
      title: "Total ROI",
      value: "$24.5K",
      change: "+18% from last month",
      icon: BarChart3,
      color: "text-green-400"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your influencer marketing campaigns and performance
          </p>
        </div>
        <Button 
          onClick={() => navigate('/campaigns/new')}
          className="bg-gradient-purple hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover-glow"
        >
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Recent Campaigns</CardTitle>
            <CardDescription>
              Your latest influencer marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Summer Collection Launch", status: "Active", influencers: 15 },
                { name: "Brand Awareness Q4", status: "Planning", influencers: 8 },
                { name: "Product Review Campaign", status: "Completed", influencers: 22 }
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border">
                  <div>
                    <p className="font-medium text-foreground">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">{campaign.influencers} influencers</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    campaign.status === 'Planning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {campaign.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Quick Actions</CardTitle>
            <CardDescription>
              Get started with your influencer campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/campaigns/new')}
              className="w-full bg-gradient-purple hover:opacity-90 text-white"
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
            <Button 
              onClick={() => navigate('/irm')}
              variant="outline" 
              className="w-full border-border hover:bg-secondary/20"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Influencers
            </Button>
            <Button 
              onClick={() => navigate('/campaigns')}
              variant="outline" 
              className="w-full border-border hover:bg-secondary/20"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
