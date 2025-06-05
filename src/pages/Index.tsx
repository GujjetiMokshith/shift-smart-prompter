import React, { useState } from "react";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Check, Star, Rocket, Shield, Clock, Users, Brain, Target, TrendingUp, Cpu, Layers, Coffee } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import { Link, useNavigate } from "react-router-dom";
import WebGLBackground from "@/components/WebGLBackground";

const Index = () => {
  const navigate = useNavigate();
  
  const handlePromptSubmit = (prompt: string) => {
    localStorage.setItem("pendingPrompt", prompt);
    navigate("/workspace");
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Enhancement",
      description: "Transform basic prompts into detailed, effective instructions using advanced AI models like Llama 3.3.",
      highlight: "3-5x more detailed",
      stats: "99.8% accuracy rate"
    },
    {
      icon: Rocket,
      title: "Multi-Model Support", 
      description: "Optimize for Llama, Claude, ChatGPT, Mistral and more with model-specific enhancements.",
      highlight: "10+ AI models",
      stats: "Compatible with all major LLMs"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get enhanced prompts in seconds with our optimized processing pipeline powered by Groq.",
      highlight: "Under 5 seconds",
      stats: "Average 2.3s response time"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your prompts are encrypted and never shared. Complete data privacy guaranteed.",
      highlight: "Enterprise security",
      stats: "SOC 2 Type II compliant"
    },
    {
      icon: Target,
      title: "Smart Optimization",
      description: "Automatically adds context, constraints, and formatting for maximum AI effectiveness.",
      highlight: "Better results",
      stats: "300% improvement in output quality"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Share enhanced prompts with the community and build a library of effective instructions.",
      highlight: "Free & Open",
      stats: "Used by 500+ creators"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Product Manager",
      company: "TechCorp",
      quote: "PromptShift transformed our AI workflow. Our prompt effectiveness increased by 300%! The quality of outputs from our models improved dramatically.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mike Rodriguez", 
      role: "Content Creator",
      company: "Creative Studio",
      quote: "Finally, a tool that makes my prompts actually work. The enhancement quality is incredible and saves me hours of trial and error.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Emily Watson",
      role: "Research Scientist", 
      company: "AI Labs",
      quote: "The multi-model optimization saves us hours of trial and error. Essential for any AI team working with multiple language models.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Input Your Prompt",
      description: "Paste your basic prompt or idea into our intuitive interface",
      icon: Layers
    },
    {
      step: "02", 
      title: "AI Enhancement",
      description: "Our advanced AI analyzes and enhances your prompt with detailed specifications",
      icon: Cpu
    },
    {
      step: "03",
      title: "Get Results",
      description: "Receive a comprehensive, optimized prompt ready for any AI model",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-50" />
          <div className="w-full max-w-6xl mx-auto space-y-8 relative z-10">
            <div className="text-center mb-12 space-y-6">
              <div className="inline-block p-3 bg-blue-800/20 rounded-full mb-6 glow-blue-sm">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient-blue animate-fade-in">
                Transform Your Prompts
                <br />
                <span className="text-4xl md:text-5xl text-white/80">Get 3-5x Better AI Results</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
                Turn basic prompts into detailed, AI-optimized instructions that get better results from any language model. 
                Powered by Groq's lightning-fast inference with enterprise-grade security. <strong>Completely free to use!</strong>
              </p>
            </div>
            
            <div className="w-full max-w-4xl mx-auto bolt-card p-8 hover-border-glow transition-all duration-300 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <ChatInput
                placeholder="Paste your prompt here to enhance it instantly with AI..."
                onSubmit={handlePromptSubmit}
              />
              <div className="mt-6 text-sm text-white/50 flex justify-between items-center">
                <span>Press enter to enhance • Ready to enhance</span>
                <div className="flex items-center gap-4">
                  <span className="text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Powered by Groq
                  </span>
                  <Link to="/workspace" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 hover-glow">
                    Go to workspace <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
              {["Llama 3.3", "Claude Sonnet", "ChatGPT-4", "Mistral Large", "Gemma 2"].map((model) => (
                <div 
                  key={model}
                  className="px-6 py-3 bg-[#070C18] rounded-full text-sm text-white/80 hover:text-white cursor-pointer transition-all duration-300 border border-white/10 hover:border-blue-600/50 hover-glow-sm hover-scale"
                >
                  Optimize for {model}
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
              {[
                { number: "50,000+", label: "Prompts Enhanced" },
                { number: "300%", label: "Better Results" },
                { number: "<3s", label: "Processing Time" },
                { number: "100%", label: "Free Forever" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gradient-blue">{stat.number}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4 bg-[#030712]/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-blue">How It Works</h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Transform your prompts in three simple steps with our AI-powered enhancement engine
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <div 
                  key={step.step}
                  className="bolt-card p-8 hover-border-glow hover-scale transition-all duration-300 group relative"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-blue-800/20 rounded-xl flex items-center justify-center mb-6 glow-blue-sm group-hover:scale-110 transition-transform">
                    <step.icon className="h-7 w-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-[#030712]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-blue">Why Choose PromptShift?</h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience the power of AI-enhanced prompting with cutting-edge features - completely free
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="bolt-card p-8 hover-border-glow hover-scale transition-all duration-300 group"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-14 h-14 bg-blue-800/20 rounded-xl flex items-center justify-center mb-6 glow-blue-sm group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-blue-400" />
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <span className="text-xs bg-blue-800/30 text-blue-300 px-2 py-1 rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed mb-3">{feature.description}</p>
                  <p className="text-xs text-green-400 font-medium">{feature.stats}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gradient-blue">Loved by Professionals</h2>
              <p className="text-xl text-white/70">See what our users are saying about PromptShift</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bolt-card p-6 hover-border-glow transition-all duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-white font-medium">{testimonial.name}</div>
                      <div className="text-white/50 text-sm">{testimonial.role}</div>
                      <div className="text-blue-400 text-sm">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-24 px-4 bg-[#030712]/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bolt-card p-12 hover-border-glow">
              <div className="w-16 h-16 bg-amber-800/20 rounded-full flex items-center justify-center mb-6 mx-auto glow-amber-sm">
                <Coffee className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6 text-gradient-blue">
                Support Our Mission
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                PromptShift is completely free to use. If you find it valuable, consider buying us a coffee to help keep the service running and support future development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white hover-glow px-8"
                  onClick={() => window.open('https://buymeacoffee.com/promptshift', '_blank')}
                >
                  <Coffee className="mr-2 h-5 w-5" />
                  Buy Us a Coffee
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                  asChild
                >
                  <Link to="/workspace">
                    Start Using Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-white/50 mt-6">
                Your support helps us maintain servers, improve AI models, and add new features
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bolt-card p-12 hover-border-glow">
              <h2 className="text-4xl font-bold mb-6 text-gradient-blue">
                Ready to Transform Your AI Results?
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who've already improved their AI workflow with PromptShift - completely free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white hover-glow px-8"
                  asChild
                >
                  <Link to="/workspace">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                  asChild
                >
                  <Link to="/docs">
                    View Documentation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="border-t border-white/5 py-16 px-4 bg-[#030712]/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-xl font-bold text-gradient-blue">PromptShift</h3>
              </div>
              <p className="text-white/60 leading-relaxed mb-6">
                Transform your prompts with AI-powered enhancement for better results across all language models. 
                Built for professionals, free for everyone.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-white/60">𝕏</span>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-white/60">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link to="/workspace" className="hover:text-blue-400 transition-colors">Workspace</Link></li>
                <li><Link to="/docs" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-white/60">
                <li><Link to="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Press Kit</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-white/60">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="https://buymeacoffee.com/promptshift" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Coffee className="h-3 w-3" />
                  Buy Us Coffee
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40">
            <p>© 2025 PromptShift. All rights reserved. Free forever.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
              <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;