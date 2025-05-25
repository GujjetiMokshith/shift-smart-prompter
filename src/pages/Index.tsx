
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Check, Star, Rocket, Shield, Clock } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const handlePromptSubmit = (prompt: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    localStorage.setItem("pendingPrompt", prompt);
    navigate("/workspace");
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Enhancement",
      description: "Transform basic prompts into detailed, effective instructions using advanced AI models."
    },
    {
      icon: Rocket,
      title: "Multi-Model Support",
      description: "Optimize for Llama, Claude, ChatGPT, Mistral and more with model-specific enhancements."
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get enhanced prompts in seconds with our optimized processing pipeline."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your prompts are encrypted and never shared. Complete data privacy guaranteed."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 prompt enhancements per day",
        "Basic AI models",
        "Standard processing speed",
        "Community support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      description: "For power users and professionals",
      features: [
        "Unlimited prompt enhancements",
        "All premium AI models",
        "Priority processing",
        "Custom system prompts",
        "Advanced export options",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="text-center mb-12 space-y-6">
              <div className="inline-block p-3 bg-blue-800/20 rounded-full mb-6 glow-blue-sm">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient-blue animate-fade-in">
                Transform Your Prompts
              </h1>
              <p className="text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Turn basic prompts into detailed, AI-optimized instructions that get better results from any language model.
              </p>
            </div>
            
            <div className="w-full max-w-4xl mx-auto bolt-card p-8 hover-border-glow transition-all duration-300 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <ChatInput
                placeholder="Paste your prompt here to enhance it..."
                onSubmit={handlePromptSubmit}
              />
              <div className="mt-6 text-sm text-white/50 flex justify-between items-center">
                <span>Press enter to enhance • {user ? 'Ready to enhance' : 'Sign in required'}</span>
                <Link to="/workspace" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 hover-glow">
                  Go to workspace <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
              {["Llama 4", "Claude", "ChatGPT", "Mistral"].map((model) => (
                <div 
                  key={model}
                  className="px-6 py-3 bg-[#070C18] rounded-full text-sm text-white/80 hover:text-white cursor-pointer transition-all duration-300 border border-white/10 hover:border-blue-600/50 hover-glow-sm hover-scale"
                >
                  Optimize for {model}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-[#030712]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gradient-blue">Why Choose PromptShift?</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Experience the power of AI-enhanced prompting with our cutting-edge features
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="bolt-card p-6 hover-border-glow hover-scale transition-all duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-12 h-12 bg-blue-800/20 rounded-lg flex items-center justify-center mb-4 glow-blue-sm">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gradient-blue">Simple, Transparent Pricing</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Choose the plan that fits your needs. Upgrade or downgrade at any time.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={plan.name}
                  className={`bolt-card p-8 hover-border-glow hover-scale transition-all duration-300 relative ${
                    plan.popular ? 'border-blue-600/50 glow-blue' : ''
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gradient-blue">{plan.price}</span>
                      <span className="text-white/60">/{plan.period}</span>
                    </div>
                    <p className="text-white/70">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-white/80">
                        <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900' 
                        : 'bg-blue-900/30 hover:bg-blue-900/50'
                    } text-white hover-glow transition-all duration-300`}
                    onClick={() => !user && setShowAuth(true)}
                  >
                    {plan.name === 'Free' ? 'Get Started Free' : `Choose ${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 bg-[#030712]/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-xl font-bold text-gradient-blue">PromptShift</h3>
              </div>
              <p className="text-white/60 leading-relaxed">
                Transform your prompts with AI-powered enhancement for better results across all language models.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link to="/workspace" className="hover:text-blue-400 transition-colors">Workspace</Link></li>
                <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 text-center text-white/40">
            <p>© 2025 PromptShift. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
