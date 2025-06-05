import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import AnimatedText from "@/components/ui/animated-text";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onPromptSubmit: (prompt: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onPromptSubmit }) => {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-50" />
      <div className="w-full max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-800/20 to-purple-800/20 rounded-full mb-6 glow-blue-sm backdrop-blur-lg border border-white/10">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
          
          <div className="space-y-4">
            <AnimatedText variant="gradient" className="text-7xl md:text-8xl font-black tracking-tight leading-none">
              Unlock the True Power
            </AnimatedText>
            <AnimatedText delay={200} variant="gradient" className="text-5xl md:text-6xl font-bold text-blue-400/90">
              of Your Prompts
            </AnimatedText>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-pulse"></div>
          </div>
          
          <AnimatedText delay={300} className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Boost response quality, accelerate workflows, and elevate AI outcomes effortlessly. 
            <br />Powered by Groq's lightning-fast inference with enterprise-grade security. <strong>Completely free forever!</strong>
          </AnimatedText>
        </div>
        
        <div className="w-full max-w-4xl mx-auto glass border border-white/10 p-8 hover-border-glow transition-all duration-500 animate-fade-in backdrop-blur-xl shadow-2xl" style={{animationDelay: '0.6s'}}>
          <ChatInput
            placeholder="Paste your prompt here to enhance it instantly with AI..."
            onSubmit={onPromptSubmit}
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
        
        <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in" style={{animationDelay: '0.9s'}}>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in" style={{animationDelay: '1.2s'}}>
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
  );
};

export default HeroSection;