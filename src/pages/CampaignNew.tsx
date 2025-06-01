
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, ArrowRight } from "lucide-react";

const CampaignNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    brandName: "",
    productDescription: "",
    targetAudience: "",
    keyUseCases: "",
    campaignGoal: "",
    productNiche: "",
    totalBudget: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Campaign Created!",
        description: "Your campaign has been created successfully. Finding matching influencers...",
      });
      
      // Simulate campaign ID and navigate to influencer discovery
      const campaignId = "camp_" + Math.random().toString(36).substr(2, 9);
      navigate(`/campaigns/${campaignId}/influencers`);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.productName && formData.brandName && formData.totalBudget;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-purple rounded-2xl flex items-center justify-center mx-auto">
          <Megaphone className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Create New Campaign</h1>
          <p className="text-muted-foreground">
            Tell us about your product and goals to find the perfect influencers
          </p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Campaign Details</CardTitle>
          <CardDescription>
            Provide information about your product and campaign objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-sm font-medium">
                  Product Name *
                </Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  placeholder="Enter product name"
                  className="bg-secondary/20 border-border focus:border-purple-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-sm font-medium">
                  Brand Name *
                </Label>
                <Input
                  id="brandName"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  placeholder="Enter brand name"
                  className="bg-secondary/20 border-border focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription" className="text-sm font-medium">
                Product Description
              </Label>
              <Textarea
                id="productDescription"
                value={formData.productDescription}
                onChange={(e) => handleInputChange('productDescription', e.target.value)}
                placeholder="Describe your product in detail..."
                className="bg-secondary/20 border-border focus:border-purple-500 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium">
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="e.g., Young professionals, 25-35"
                  className="bg-secondary/20 border-border focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productNiche" className="text-sm font-medium">
                  Product Niche
                </Label>
                <Input
                  id="productNiche"
                  value={formData.productNiche}
                  onChange={(e) => handleInputChange('productNiche', e.target.value)}
                  placeholder="e.g., Fashion, Tech, Beauty"
                  className="bg-secondary/20 border-border focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyUseCases" className="text-sm font-medium">
                Key Use Cases
              </Label>
              <Textarea
                id="keyUseCases"
                value={formData.keyUseCases}
                onChange={(e) => handleInputChange('keyUseCases', e.target.value)}
                placeholder="How do customers use your product?"
                className="bg-secondary/20 border-border focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaignGoal" className="text-sm font-medium">
                  Campaign Goal
                </Label>
                <Input
                  id="campaignGoal"
                  value={formData.campaignGoal}
                  onChange={(e) => handleInputChange('campaignGoal', e.target.value)}
                  placeholder="e.g., Brand awareness, Sales"
                  className="bg-secondary/20 border-border focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalBudget" className="text-sm font-medium">
                  Total Budget *
                </Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => handleInputChange('totalBudget', e.target.value)}
                  placeholder="Enter budget amount"
                  className="bg-secondary/20 border-border focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/campaigns')}
                className="flex-1 border-border hover:bg-secondary/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="flex-1 bg-gradient-purple hover:opacity-90 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Campaign...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create & Find Influencers
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignNew;
