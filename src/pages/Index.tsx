
import React from "react";
import Header from "@/components/Header";
import ChatContainer from "@/components/ChatContainer";
import { Toaster } from "sonner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bolt-dark text-white">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">What do you want to build?</h1>
            <p className="text-xl text-white/70">Prompt, enhance, and deploy AI-optimized prompts.</p>
          </div>
          
          <div className="w-full bolt-card overflow-hidden">
            <ChatContainer />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Llama 4", "Claude", "ChatGPT", "Mistral"].map((model) => (
              <div 
                key={model}
                className="px-4 py-2 bg-bolt-card rounded-full text-sm text-white/80 hover:text-white cursor-pointer transition-colors border border-white/10"
              >
                Optimize for {model}
              </div>
            ))}
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
