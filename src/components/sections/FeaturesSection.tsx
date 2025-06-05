import React from "react";
import { Brain, Rocket, Clock, Shield, Target, Users, Check, TrendingUp } from "lucide-react";
import AnimatedText from "@/components/ui/animated-text";

const FeaturesSection: React.FC = () => {
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

  return (
    <section className="py-24 px-4 bg-[#030712]/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <AnimatedText variant="gradient" className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose PromptShift?
          </AnimatedText>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center hover-scale transition-all duration-300">
              <Check className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <span className="text-white/80 text-sm">Optimized AI Prompts</span>
            </div>
            <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center hover-scale transition-all duration-300">
              <Rocket className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <span className="text-white/80 text-sm">Fast Iteration Cycles</span>
            </div>
            <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center hover-scale transition-all duration-300">
              <Shield className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <span className="text-white/80 text-sm">Secure Prompt Storage</span>
            </div>
            <div className="glass border border-white/10 p-4 rounded-lg backdrop-blur-sm text-center hover-scale transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <span className="text-white/80 text-sm">Detailed Analytics</span>
            </div>
          </div>
          
          <AnimatedText delay={300} className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the power of AI-enhanced prompting with cutting-edge features - completely free
          </AnimatedText>
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
  );
};

export default FeaturesSection;