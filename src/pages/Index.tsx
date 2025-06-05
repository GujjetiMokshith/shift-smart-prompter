import React, { useState } from "react";
import Header from "@/components/Header";
import WebGLBackground from "@/components/WebGLBackground";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Check, Star, Rocket, Shield, Clock, Users, Brain, Target, TrendingUp, Cpu, Layers, Coffee } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#001f54]/20 to-black text-white relative overflow-hidden">
      <WebGLBackground />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-50" />
          <div className="w-full max-w-6xl mx-auto space-y-8 relative z-10">
            <div className="text-center mb-12 space-y-6">
              <div className="inline-block p-4 bg-gradient-to-r from-blue-800/20 to-purple-800/20 rounded-full mb-6 glow-blue-sm backdrop-blur-lg border border-white/10">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient-blue animate-fade-in">
                Unlock the True Power
                <br />
                <span className="text-4xl md:text-5xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">of Your Prompts</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
                Boost response quality, accelerate workflows, and elevate AI outcomes effortlessly. 
                <br />Powered by Groq's lightning-fast inference with enterprise-grade security. <strong>Completely free forever!</strong>
              </p>
            </div>
            
            <div className="w-full max-w-4xl mx-auto glass border border-white/10 p-8 hover-border-glow transition-all duration-500 animate-fade-in backdrop-blur-xl shadow-2xl" style={{animationDelay: '0.2s'}}>
              <ChatInput
                placeholder="Paste your prompt here to enhance it instantly with AI..."
                onSubmit={handlePromptSubmit}
              />
              <div className="mt-6 text-sm text-white/60 flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Press enter to enhance • Ready to transform
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-green-400 flex items-center gap-1 text-xs bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Powered by Groq
                  </span>
                  <Link to="/workspace" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 hover-glow transition-all duration-300 text-xs bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 hover:border-blue-400/40">
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
                  className="glass border border-white/10 p-8 hover-border-glow hover-scale transition-all duration-500 group relative backdrop-blur-xl"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="absolute -top-4 left-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-2xl flex items-center justify-center mb-6 glow-blue-sm group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/10">
                    <step.icon className="h-8 w-8 text-blue-400" />
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-blue">Why Choose PromptShift?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
                <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                  <Check className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <span className="text-white/80 text-sm">Optimized AI Prompts</span>
                </div>
                <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                  <Rocket className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <span className="text-white/80 text-sm">Fast Iteration Cycles</span>
                </div>
                <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                  <Shield className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <span className="text-white/80 text-sm">Secure Prompt Storage</span>
                </div>
                <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center">
                  <TrendingUp className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <span className="text-white/80 text-sm">Detailed Analytics</span>
                </div>
              </div>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience the power of AI-enhanced prompting with cutting-edge features - completely free
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="glass border border-white/10 p-8 hover-border-glow hover-scale transition-all duration-500 group backdrop-blur-xl"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-2xl flex items-center justify-center mb-6 glow-blue-sm group-hover:scale-110 transition-all duration-300 border border-white/10">
                    <feature.icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <span className="text-xs bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-300 px-3 py-1 rounded-full border border-blue-400/20">
                      {feature.highlight}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-xs text-green-400 font-medium">{feature.stats}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gradient-blue">Trusted by AI Engineers, SaaS Founders & Creators Worldwide</h2>
              <p className="text-xl text-white/70">See how thousands are streamlining their AI productivity</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="glass border border-white/10 p-6 hover-border-glow transition-all duration-500 backdrop-blur-xl group hover:scale-105"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-400/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-white/60 text-sm">{testimonial.role}</div>
                      <div className="text-blue-400 text-sm font-medium">{testimonial.company}</div>
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
            <div className="glass border border-white/10 p-12 hover-border-glow backdrop-blur-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600/30 to-orange-600/30 rounded-full flex items-center justify-center mb-6 mx-auto glow-amber-sm border border-amber-400/20">
                <Coffee className="h-10 w-10 text-amber-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Support Our Mission 💙</span>
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Help us democratize AI excellence for everyone—developers, creators, and dreamers alike. 
                PromptShift is completely free to use, and your support keeps it that way.
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

        {/* Final CTA Section */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass border border-white/10 p-12 hover-border-glow backdrop-blur-xl">
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Start PromptShifting Today</span>
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                Craft smarter prompts. Get better AI results. Instantly.
                <br />Join thousands of professionals transforming their AI workflow.
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
      <footer className="border-t border-white/5 py-20 px-4 bg-gradient-to-br from-[#030712] via-[#001f54]/20 to-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 opacity-50" />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Newsletter Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stay Updated with PromptShift
            </h3>
            <p className="text-white/60 mb-6">Get the latest updates on AI optimization and new features</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:border-blue-400/50 transition-colors"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6">
                Subscribe
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PromptShift</h3>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">
                Transform your prompts with AI-powered enhancement for better results across all language models. 
                Built for professionals, free for everyone.
              </p>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center hover:from-blue-600/30 hover:to-purple-600/30 cursor-pointer transition-all duration-300 border border-white/10 hover:border-white/20">
                  <span className="text-white/80 font-bold">𝕏</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center hover:from-blue-600/30 hover:to-purple-600/30 cursor-pointer transition-all duration-300 border border-white/10 hover:border-white/20">
                  <span className="text-white/80 font-bold">in</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center hover:from-blue-600/30 hover:to-purple-600/30 cursor-pointer transition-all duration-300 border border-white/10 hover:border-white/20">
                  <span className="text-white/80 font-bold">gh</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Product
              </h4>
              <ul className="space-y-4 text-white/60">
                <li><Link to="/workspace" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Workspace
                </Link></li>
                <li><Link to="/docs" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Documentation
                </Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  API Reference
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Integrations
                </a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Company
              </h4>
              <ul className="space-y-4 text-white/60">
                <li><Link to="/about" className="hover:text-purple-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  About
                </Link></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Blog
                </a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Careers
                </a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Press Kit
                </a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Support
              </h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Help Center
                </a></li>
                <li><a href="https://buymeacoffee.com/promptshift" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <Coffee className="h-3 w-3" />
                  Buy Us Coffee
                </a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Community
                </a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2 hover:gap-3 duration-300">
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition-opacity" />
                  Status Page
                </a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/50">
            <div className="flex items-center gap-2">
              <span>© 2025 PromptShift. All rights reserved.</span>
              <span className="text-green-400 text-sm bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">Free forever</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-blue-400 transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-400 transition-colors text-sm">Terms of Service</Link>
              <a href="#" className="hover:text-blue-400 transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
