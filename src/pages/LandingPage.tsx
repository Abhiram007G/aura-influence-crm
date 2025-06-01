import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageSquare, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">InfluencerFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              <Button onClick={() => navigate("/login")} className="premium-button">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Brain className="w-4 h-4" />
            AI-Powered Influencer Marketing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">
            Scale Your{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Influencer Campaigns
            </span>{" "}
            with AI Automation
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Transform your influencer marketing with intelligent automation. From creator discovery to payment tracking, let AI handle the complexity while you focus on building authentic brand relationships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button onClick={() => navigate("/signup")} className="premium-button w-full sm:w-auto text-lg px-8 py-6">
              Start Free Trial
            </Button>
            <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-slate-700 hover:bg-slate-800/50">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">10x</div>
            <div className="text-slate-400 mt-2">Faster Creator Discovery</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">85%</div>
            <div className="text-slate-400 mt-2">Time Saved on Admin</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">300%</div>
            <div className="text-slate-400 mt-2">Better Campaign ROI</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text">50K+</div>
            <div className="text-slate-400 mt-2">Verified Creators</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our AI-powered platform handles every aspect of influencer marketing, from discovery to payment, so you can focus on building authentic relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card hover-glow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Discovery</h3>
                <p className="text-slate-400">
                  Match with the right influencers using intelligent recommendations based on audience fit, engagement rates, and brand alignment.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Smart Campaign Management</h3>
                <p className="text-slate-400">
                  Automate outreach, contracts, and collaboration workflows. Let AI handle the repetitive tasks while you focus on strategy.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Integrated Payments</h3>
                <p className="text-slate-400">
                  Schedule and track milestone-based influencer payouts. Automated payment releases when deliverables are met.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Performance Insights</h3>
                <p className="text-slate-400">
                  Understand campaign effectiveness with built-in analytics. Real-time tracking of ROI, engagement, and conversion metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Three simple steps to transform your influencer marketing campaigns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover</h3>
              <p className="text-slate-400">
                AI analyzes millions of creators to find perfect matches for your brand
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-slate-400">
                Automated outreach and contract generation streamlines collaboration
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track</h3>
              <p className="text-slate-400">
                Monitor performance and automate payments based on milestones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Influencer Marketing?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of brands using InfluencerFlow to scale their influencer campaigns
          </p>
          <Button onClick={() => navigate("/signup")} className="premium-button text-lg px-8 py-6">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">API Reference</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-400">
          <p>© 2025 InfluencerFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;