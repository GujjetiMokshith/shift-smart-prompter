
import React from "react";
import Header from "@/components/Header";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import ChatInput from "@/components/ChatInput";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const handlePromptSubmit = (prompt: string) => {
    // Store the prompt in localStorage and navigate to workspace
    localStorage.setItem("pendingPrompt", prompt);
    navigate("/workspace");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-block p-2 bg-blue-700/20 rounded-full mb-4 glow-blue-sm">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gradient-blue animate-fade-in">
              What do you want to build?
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Paste your prompt below to enhance it with AI-optimized instructions.
            </p>
          </div>
          
          <div className="w-full bolt-card p-6 hover-border-glow transition-all duration-300 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <ChatInput
              placeholder="Paste your prompt here to enhance it..."
              onSubmit={handlePromptSubmit}
            />
            <div className="mt-4 text-sm text-white/50 flex justify-between items-center">
              <span>Press enter to continue</span>
              <Link to="/workspace" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Go to workspace <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-in" style={{animationDelay: '0.4s'}}>
            {["Llama 4", "Claude", "ChatGPT", "Mistral"].map((model) => (
              <div 
                key={model}
                className="px-4 py-2 bg-[#070C18] rounded-full text-sm text-white/80 hover:text-white cursor-pointer transition-colors border border-white/10 hover:border-blue-600/50 hover-glow-sm"
              >
                Optimize for {model}
              </div>
            ))}
          </div>
          
          <div className="mt-12 border-t border-white/5 pt-8 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="inline-flex items-center gap-2 p-4 bg-gradient-to-r from-blue-700/20 to-purple-700/20 rounded-xl hover-scale">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-gradient-blue font-medium">
                Upgrade to Pro for unlimited prompts and advanced features
              </span>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-xs text-white/40">
        <p>PromptShift Beta • © 2025 • All rights reserved</p>
      </footer>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
