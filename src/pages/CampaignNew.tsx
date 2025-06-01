import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Megaphone, Sparkles } from "lucide-react";
import { createCampaign, CampaignCreate } from "@/lib/services/campaignService";
import { useToast } from "@/hooks/use-toast";

const CampaignNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert form data to API format
      const campaignData: CampaignCreate = {
        product_name: formData.productName,
        brand_name: formData.brandName,
        product_description: formData.productDescription || undefined,
        target_audience: formData.targetAudience || undefined,
        key_use_cases: formData.keyUseCases || undefined,
        campaign_goal: formData.campaignGoal || undefined,
        product_niche: formData.productNiche || undefined,
        total_budget: parseFloat(formData.totalBudget)
      };

      // Create campaign
      const response = await createCampaign(campaignData);
      
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });

      // Navigate to campaign details page
      navigate(`/campaigns/${response.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.productName && formData.brandName && formData.totalBudget;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold gradient-text flex items-center justify-center gap-3">
          <Megaphone className="w-8 h-8" />
          Create New Campaign
        </h1>
        <p className="text-muted-foreground text-lg">
          Let our AI find the perfect influencers for your brand
        </p>
      </div>

      <Card className="premium-card shadow-premium">
        <CardHeader className="text-center border-b border-slate-700/30">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Campaign Details
          </CardTitle>
          <CardDescription>
            Provide information about your product and campaign goals
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-foreground font-medium">
                  Product Name *
                </Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                  placeholder="Enter your product name"
                  className="premium-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-foreground font-medium">
                  Brand Name *
                </Label>
                <Input
                  id="brandName"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange("brandName", e.target.value)}
                  placeholder="Enter your brand name"
                  className="premium-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription" className="text-foreground font-medium">
                Product Description
              </Label>
              <Textarea
                id="productDescription"
                value={formData.productDescription}
                onChange={(e) => handleInputChange("productDescription", e.target.value)}
                placeholder="Describe your product, its features, and benefits"
                className="premium-input min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-foreground font-medium">
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  placeholder="e.g., Young professionals, fitness enthusiasts"
                  className="premium-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productNiche" className="text-foreground font-medium">
                  Product Niche
                </Label>
                <Input
                  id="productNiche"
                  value={formData.productNiche}
                  onChange={(e) => handleInputChange("productNiche", e.target.value)}
                  placeholder="e.g., Fitness, Beauty, Tech, Lifestyle"
                  className="premium-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyUseCases" className="text-foreground font-medium">
                Key Use Cases
              </Label>
              <Textarea
                id="keyUseCases"
                value={formData.keyUseCases}
                onChange={(e) => handleInputChange("keyUseCases", e.target.value)}
                placeholder="How do customers use your product? What problems does it solve?"
                className="premium-input"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="campaignGoal" className="text-foreground font-medium">
                  Campaign Goal
                </Label>
                <Input
                  id="campaignGoal"
                  value={formData.campaignGoal}
                  onChange={(e) => handleInputChange("campaignGoal", e.target.value)}
                  placeholder="e.g., Brand awareness, Product launch, Sales"
                  className="premium-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalBudget" className="text-foreground font-medium">
                  Total Budget * (USD)
                </Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={formData.totalBudget}
                  onChange={(e) => handleInputChange("totalBudget", e.target.value)}
                  placeholder="10000"
                  className="premium-input"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="premium-button px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Campaign
                  </>
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
