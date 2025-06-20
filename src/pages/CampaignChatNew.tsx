import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createCampaign, CampaignCreate } from "@/lib/services/campaignService";
import { config } from "@/lib/config";
import { Groq } from "groq-sdk";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2 } from "lucide-react";

const SYSTEM_PROMPT = `
You are an intelligent assistant that converts influencer marketing campaign briefs written in natural language into a structured JSON format. The campaign briefs are given by brand or agency teams and may include product info, deliverables, influencer requirements, and budgets.
Your job is to extract the relevant details and output clean, professional JSON using the exact structure below:
{
  "product_name": "",
  "brand_name": "",
  "product_description": "",
  "target_audience": "",
  "key_use_cases": "",
  "campaign_goal": "",
  "product_niche": "",
  "total_budget": ""
}

🧠 Instructions:
1. Accurately extract information from the brief into the corresponding JSON fields.
2. Infer details intelligently from context where necessary (e.g., tone, use-case, audience intent).
3. Leave fields blank ("") only if the required information is not present in the input.
4. Use professional, brand-ready language—write like a marketer.
5. Ensure the budget is calculated in total if per-influencer cost and quantity are given.
6. Follow tone and standards used in marketing teams (e.g., audience segmentation, value-based messaging).

💡 Field-Level Clarification:
* product_name: Specific product being promoted (e.g., "Heineken Beer").
* brand_name: Brand or company name (e.g., "Heineken").
* product_description: Short, polished marketing description of the product. Include lifestyle or category references if given or implied.
* target_audience: Intended demographic or influencer criteria (age, interests, follower range, etc.).
* key_use_cases: Content or deliverables required (e.g., event attendance, Instagram Reel, Story).
* campaign_goal: The core business or brand objective of the campaign (e.g., awareness, association, launch support).
* product_niche: Category or positioning of the product (e.g., "Premium Beer", "Lifestyle", "Wellness").
* total_budget: The full expected spend (either given or derived by multiplying per-profile cost × number of profiles, keep the higher end if range is given).

🧪 Sample Input:
Brand - Heineken  
Brief - Heineken is looking for influencers to attend the red carpet F1 Movie Screening Event for them.  
Date - 23rd June  
Location - Palladium, Lower Parel, Mumbai  
Deliverables:  
1) Event Attendance  
2) 1 Event Highlight IG Collab Reel  
3) 1 IG Video Story  
Requirement:  
- Premium Lifestyle Influencers (100K-300K followers), Age 25+, interest in F1 and Beer  
- 8–10 profiles  
Budget: ₹70K–80K per profile  
Shoot and edit by influencer (professionally shot)

✅ Sample Output:
{
  "product_name": "Heineken Beer",
  "brand_name": "Heineken",
  "product_description": "A globally recognized premium lager known for its crisp taste and strong association with high-energy lifestyle experiences like Formula 1.",
  "target_audience": "Urban, premium lifestyle audiences aged 25+, with an interest in motorsports, beer culture, and aspirational events.",
  "key_use_cases": "Brand visibility at red carpet event, Instagram Reel and Story content, influencer-led aspirational lifestyle marketing.",
  "campaign_goal": "Drive awareness and aspirational appeal for Heineken by leveraging influencers to highlight its presence at the F1 Movie Screening Event.",
  "product_niche": "Premium Beer, Lifestyle & Motorsport Integration",
  "total_budget": "640000"
}
`

const REQUIRED_FIELDS = [
  "product_name",
  "brand_name",
  "product_description",
  "target_audience",
  "key_use_cases",
  "campaign_goal",
  "product_niche",
  "total_budget"
];

const fieldLabels: Record<string, string> = {
  product_name: "Product Name",
  brand_name: "Brand Name",
  product_description: "Product Description",
  target_audience: "Target Audience",
  key_use_cases: "Key Use Cases",
  campaign_goal: "Campaign Goal",
  product_niche: "Product Niche",
  total_budget: "Total Budget"
};

export default function CampaignChatNew() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [parsed, setParsed] = useState<any | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const userName = "Abhiram";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMissingFields([]);
    setParsed(null);
    setIsLoading(true);
    try {
      const groq = new Groq({ apiKey: config.groqApiKey,dangerouslyAllowBrowser: true });
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input }
        ],
        model: "deepseek-r1-distill-llama-70b",
        temperature: 0.6,
        max_completion_tokens: 4096,
        top_p: 0.95,
        stream: false,
        response_format: { type: "json_object" },
        stop: null
      });
      const result = chatCompletion.choices?.[0]?.message?.content
        ? JSON.parse(chatCompletion.choices[0].message.content)
        : chatCompletion;
      setParsed(result);
      console.log(result);
      // Check for missing fields
      const missing = REQUIRED_FIELDS.filter(
        (field) => !result[field] || result[field].toString().trim() === ""
      );
      // Special check for total_budget validity
      let parsedBudget = null;
      if (!missing.includes("total_budget")) {
        parsedBudget = parseFloat(result.total_budget);
        if (isNaN(parsedBudget) || parsedBudget <= 0) {
          missing.push("total_budget");
        }
      }
      if (missing.length > 0) {
        setMissingFields(missing);
        setError(
          `✨ Oops! Looks like your brief is missing: ${missing
            .map((f) => fieldLabels[f] || f)
            .join(", ")}.\nPlease add these details to your brief for a complete campaign setup!`
        );
        setIsLoading(false);
        return;
      }
      // All fields present and valid, create campaign
      const campaignData: CampaignCreate = {
        product_name: result.product_name,
        brand_name: result.brand_name,
        product_description: result.product_description,
        target_audience: result.target_audience,
        key_use_cases: result.key_use_cases,
        campaign_goal: result.campaign_goal,
        product_niche: result.product_niche,
        total_budget: parsedBudget as number
      };
      const response = await createCampaign(campaignData);
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });
      navigate(`/campaigns/${response.id}`);
    } catch (err: any) {
      setError(
        err?.message ||
          "Something went wrong while processing your brief. Please try again!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30 flex flex-col">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-baloo font-bold text-slate-800">
              Campaign Brief AI
            </h1>
          </div>
          <p className="text-lg text-slate-600 font-andika max-w-2xl mx-auto">
            Hello {userName}! Describe your campaign in natural language and I'll extract all the details to create your campaign.
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 pb-8">
        <div className="space-y-6">
          {/* Input Area */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    className="min-h-[140px] resize-none border-2 border-slate-200 rounded-xl px-4 py-3 text-base placeholder:text-slate-500 focus:border-primary focus:ring-0 font-andika bg-white"
                    placeholder="Describe your campaign brief here... Include details about your product, target audience, budget, deliverables, and goals."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-500 font-andika">
                    {input.length > 0 && `${input.length} characters`}
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end hover:from-purple-600 hover:to-purple-700 text-white px-8 py-2.5 rounded-xl font-baloo font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Generate Campaign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end rounded-full flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div>
                    <div className="font-baloo font-semibold text-slate-800 mb-1">
                      Analyzing your campaign brief...
                    </div>
                    <div className="text-sm text-slate-600 font-andika">
                      Extracting product details, audience, budget, and goals
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-0 shadow-lg bg-red-50 border-l-4 border-l-red-400">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <div>
                    <div className="font-baloo font-semibold text-red-800 mb-2">
                      Missing Information
                    </div>
                    <div className="text-sm text-red-700 font-andika whitespace-pre-line">
                      {error}
                    </div>
                    {missingFields.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {missingFields.map((field) => (
                          <span
                            key={field}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {fieldLabels[field] || field}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success State */}
          {parsed && !error && (
            <Card className="border-0 shadow-lg bg-green-50 border-l-4 border-l-green-400">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-baloo font-semibold text-green-800 mb-2">
                      Campaign Details Extracted Successfully!
                    </div>
                    <div className="text-sm text-green-700 font-andika mb-4">
                      Here's what I found in your brief:
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {Object.entries(parsed).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="font-medium text-slate-700 font-glegoo">
                              {fieldLabels[key] || key}:
                            </div>
                            <div className="text-slate-600 font-andika">
                              {typeof value === 'string' ? value : JSON.stringify(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl mx-auto px-6 py-4">
        <div className="text-center text-sm text-slate-500 font-andika">
          Powered by AI • Describe your campaign naturally and let our AI do the rest
        </div>
      </div>
    </div>
  );
}
