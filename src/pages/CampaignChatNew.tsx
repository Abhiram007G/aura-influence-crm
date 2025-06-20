import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createCampaign, CampaignCreate } from "@/lib/services/campaignService";
import { config } from "@/lib/config";
import { Groq } from "groq-sdk";
import { Textarea } from "@/components/ui/textarea";

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
  const userName = "Abhiram"; // You can make this dynamic if you have user context

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
    <div className="flex flex-col items-center justify-center min-h-[100vh] w-full bg-background font-outfit">
      {/* Greeting Section */}
      <div className="flex flex-col items-center mb-8 mt-8">
        <span className="text-4xl md:text-5xl font-serif font-semibold bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end bg-clip-text text-transparent flex items-center gap-2">
          <span className="text-primary">✳️</span> How was your day, {userName}?
        </span>
        <span className="mt-2 text-lg md:text-xl text-muted-foreground text-center max-w-xl font-outfit">
          Ready to launch your next influencer campaign? Describe your brief below and let our AI do the rest!
        </span>
      </div>
      {/* Main Card */}
      <Card className="w-full max-w-2xl shadow-premium rounded-3xl border-0 bg-gradient-primary">
        <CardHeader className="text-center border-b border-border pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end bg-clip-text text-transparent font-outfit">AI Campaign Brief</CardTitle>
          <CardDescription className="font-outfit">
            Type your campaign brief in natural language. Our AI will extract all the details!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 py-8">
            <Textarea
              className="premium-input text-lg py-7 px-5 text-center rounded-2xl shadow-md border-2 border-primary focus:border-secondary bg-background placeholder:text-muted-foreground font-outfit min-h-[120px] resize-y"
              placeholder="Describe your campaign like you would to ChatGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              autoFocus
              required
              rows={6}
            />
            <Button
              type="submit"
              className="premium-button px-10 py-4 text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-purple-gradient-start to-purple-gradient-end text-white hover:from-primary hover:to-secondary transition-all duration-200 font-outfit"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? "Thinking..." : "Generate & Create Campaign"}
            </Button>
          </form>
          {error && (
            <div className="mt-4 text-center text-destructive text-lg font-medium animate-pulse bg-rose-950/60 rounded-xl p-4 border border-destructive font-outfit">
              {error}
            </div>
          )}
          {parsed && !error && (
            <div className="mt-8 bg-background rounded-xl p-6 text-left text-base shadow-inner border border-border font-outfit">
              <div className="font-semibold mb-2 text-primary">Extracted Campaign Details:</div>
              <pre className="whitespace-pre-wrap break-words text-foreground text-sm md:text-base font-outfit">{JSON.stringify(parsed, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 