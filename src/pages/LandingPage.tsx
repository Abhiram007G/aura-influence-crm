import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MessageSquare, Target, TrendingUp, Loader2, Star, Zap, Users, Calendar } from "lucide-react";
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
    <div className="min-h-screen bg-premium-gradient overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons Pattern */}
        <div className="absolute top-20 left-10 text-white/10 animate-float">
          <Star className="w-8 h-8" />
        </div>
        <div className="absolute top-32 right-20 text-white/5 animate-float" style={{ animationDelay: "-1s" }}>
          <Zap className="w-12 h-12" />
        </div>
        <div className="absolute top-40 left-1/3 text-white/8 animate-float" style={{ animationDelay: "-3s" }}>
          <Users className="w-6 h-6" />
        </div>
        <div className="absolute bottom-40 right-10 text-white/10 animate-float" style={{ animationDelay: "-2s" }}>
          <Target className="w-10 h-10" />
        </div>
        <div className="absolute bottom-60 left-16 text-white/5 animate-float" style={{ animationDelay: "-4s" }}>
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="absolute top-60 right-1/3 text-white/8 animate-float" style={{ animationDelay: "-1.5s" }}>
          <Brain className="w-7 h-7" />
        </div>
        <div className="absolute bottom-20 left-1/2 text-white/6 animate-float" style={{ animationDelay: "-2.5s" }}>
          <Calendar className="w-9 h-9" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="sm:max-w-[800px] bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-baloo text-2xl text-text-primary">Product Demo</DialogTitle>
          </DialogHeader>
          <div className="relative pt-[56.25%] w-full">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              src="https://www.loom.com/embed/c1aafa99fba54f9bbc50ba4a912f9582?sid=481c5313-119b-423c-8af5-bae471cab6b1"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-baloo font-bold text-white">InfluencerFlow</span>
            </div>
            <div className="hidden md:flex items-center gap-8 animate-slide-down">
              <a href="#features" className="text-white/90 hover:text-white transition-colors hover:scale-105 transform font-andika font-medium">Features</a>
              <a href="#how-it-works" className="text-white/90 hover:text-white transition-colors hover:scale-105 transform font-andika font-medium">How it Works</a>
              <a href="#pricing" className="text-white/90 hover:text-white transition-colors hover:scale-105 transform font-andika font-medium">Pricing</a>
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="btn-secondary"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div 
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 border border-white/30 text-white backdrop-blur-sm transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Brain className="w-5 h-5 animate-glow" />
            <span className="font-glegoo font-medium">AI-Powered Influencer Marketing</span>
          </div>
          <h1 
            className={`text-5xl md:text-7xl font-baloo font-bold text-white transform transition-all duration-700 delay-100 leading-tight ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Scale Your{" "}
            <span className="text-white drop-shadow-lg">
              Influencer Campaigns
            </span>{" "}
            with AI Automation
          </h1>
          <p 
            className={`text-xl text-white/90 max-w-3xl mx-auto font-andika leading-relaxed transform transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Transform your influencer marketing with intelligent automation. From creator discovery to payment tracking, let AI handle the complexity while you focus on building authentic brand relationships.
          </p>
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 transform transition-all duration-700 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="btn-primary w-full sm:w-auto"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              className="btn-secondary w-full sm:w-auto"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-24">
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
              <div className="text-4xl md:text-5xl font-baloo font-bold text-white drop-shadow-lg">{stat.value}</div>
              <div className="text-white/80 mt-2 font-andika">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-baloo font-bold mb-6 text-white">Everything You Need to Scale</h2>
            <p className="text-white/90 max-w-3xl mx-auto text-lg font-andika leading-relaxed">
              Our AI-powered platform handles every aspect of influencer marketing, from discovery to payment, so you can focus on building authentic relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Discovery",
                description: "Match with the right influencers using intelligent recommendations based on audience fit, engagement rates, and brand alignment.",
                gradient: "bg-gradient-to-br from-purple-400 to-pink-400"
              },
              {
                icon: MessageSquare,
                title: "Smart Campaign Management",
                description: "Automate outreach, contracts, and collaboration workflows. Let AI handle the repetitive tasks while you focus on strategy.",
                gradient: "bg-gradient-to-br from-blue-400 to-cyan-400"
              },
              {
                icon: Target,
                title: "Integrated Payments",
                description: "Schedule and track milestone-based influencer payouts. Automated payment releases when deliverables are met.",
                gradient: "bg-gradient-to-br from-green-400 to-emerald-400"
              },
              {
                icon: TrendingUp,
                title: "Performance Insights",
                description: "Understand campaign effectiveness with built-in analytics. Real-time tracking of ROI, engagement, and conversion metrics.",
                gradient: "bg-gradient-to-br from-orange-400 to-red-400"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="card-friendly border-0"
              >
                <CardContent className="p-8 space-y-6">
                  <div className={`w-16 h-16 rounded-2xl ${feature.gradient} flex items-center justify-center shadow-glow`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-baloo font-bold text-text-primary">{feature.title}</h3>
                  <p className="text-text-secondary font-andika leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-baloo font-bold mb-6 text-white">How It Works</h2>
            <p className="text-white/90 max-w-3xl mx-auto text-lg font-andika leading-relaxed">
              Three simple steps to transform your influencer marketing campaigns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Target,
                title: "Discover",
                description: "AI analyzes millions of creators to find perfect matches for your brand",
                color: "bg-white"
              },
              {
                icon: MessageSquare,
                title: "Connect",
                description: "Automated outreach and contract generation streamlines collaboration",
                color: "bg-white"
              },
              {
                icon: TrendingUp,
                title: "Track",
                description: "Monitor performance and automate payments based on milestones",
                color: "bg-white"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mx-auto mb-8 shadow-glow`}>
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-baloo font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-white/90 font-andika text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-baloo font-bold mb-8 text-white">
            Ready to Transform Your Influencer Marketing?
          </h2>
          <p className="text-white/90 mb-12 text-lg font-andika leading-relaxed">
            Join thousands of brands using InfluencerFlow to scale their influencer campaigns
          </p>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="btn-primary text-xl px-12 py-6"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-16 px-4 backdrop-blur-xl bg-white/10 relative z-10">
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
              <h4 className="font-baloo font-bold mb-6 text-white text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-white/80 hover:text-white transition-colors font-andika">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/20 text-center text-white/80">
          <p className="font-andika">© 2025 InfluencerFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
