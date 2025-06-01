import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageSquare, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-premium-gradient overflow-hidden">
      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Product Demo</DialogTitle>
          </DialogHeader>
          <div className="relative pt-[56.25%] w-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={import.meta.env.VITE_LOOM_LINK}
              
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 animate-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">InfluencerFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8 animate-slide-down">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors hover:scale-105 transform">Features</a>
              <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors hover:scale-105 transform">How it Works</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors hover:scale-105 transform">Pricing</a>
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center relative">
        <div className="max-w-4xl mx-auto space-y-6">
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Brain className="w-4 h-4 animate-glow" />
            AI-Powered Influencer Marketing
          </div>
          <h1 
            className={`text-4xl md:text-6xl font-bold transform transition-all duration-700 delay-100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Scale Your{" "}
            <span className="text-gradient animate-glow">
              Influencer Campaigns
            </span>{" "}
            with AI Automation
          </h1>
          <p 
            className={`text-xl text-slate-400 max-w-2xl mx-auto transform transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Transform your influencer marketing with intelligent automation. From creator discovery to payment tracking, let AI handle the complexity while you focus on building authentic brand relationships.
          </p>
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 transform transition-all duration-700 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 w-full sm:w-auto text-lg px-8 py-6 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto text-lg px-8 py-6 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300"
              onClick={() => setIsVideoModalOpen(true)}
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
          {[
            { value: "10x", label: "Faster Creator Discovery" },
            { value: "85%", label: "Time Saved on Admin" },
            { value: "300%", label: "Better Campaign ROI" },
            { value: "50K+", label: "Verified Creators" }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`text-center transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="text-4xl font-bold text-gradient animate-glow">{stat.value}</div>
              <div className="text-slate-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Everything You Need to Scale</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our AI-powered platform handles every aspect of influencer marketing, from discovery to payment, so you can focus on building authentic relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Discovery",
                description: "Match with the right influencers using intelligent recommendations based on audience fit, engagement rates, and brand alignment.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: MessageSquare,
                title: "Smart Campaign Management",
                description: "Automate outreach, contracts, and collaboration workflows. Let AI handle the repetitive tasks while you focus on strategy.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Target,
                title: "Integrated Payments",
                description: "Schedule and track milestone-based influencer payouts. Automated payment releases when deliverables are met.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: TrendingUp,
                title: "Performance Insights",
                description: "Understand campaign effectiveness with built-in analytics. Real-time tracking of ROI, engagement, and conversion metrics.",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="bg-card-gradient backdrop-blur-xl border-slate-700/50 hover-card-glow"
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center animate-glow`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Three simple steps to transform your influencer marketing campaigns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Discover",
                description: "AI analyzes millions of creators to find perfect matches for your brand",
                color: "bg-blue-500"
              },
              {
                icon: MessageSquare,
                title: "Connect",
                description: "Automated outreach and contract generation streamlines collaboration",
                color: "bg-purple-500"
              },
              {
                icon: TrendingUp,
                title: "Track",
                description: "Monitor performance and automate payments based on milestones",
                color: "bg-pink-500"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6 animate-glow`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Ready to Transform Your Influencer Marketing?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of brands using InfluencerFlow to scale their influencer campaigns
          </p>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-8 py-6 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Case Studies"]
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers"]
            },
            {
              title: "Resources",
              links: ["Documentation", "Help Center", "API Reference"]
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
            }
          ].map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-400">
          <p>© 2025 InfluencerFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;