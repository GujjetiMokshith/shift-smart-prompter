
import React, { useState } from "react";
import Header from "@/components/Header";
import ChatContainer from "@/components/ChatContainer";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Folder, Plus, Settings, Sparkles } from "lucide-react";

const Workspace = () => {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  
  const savedPrompts = [
    { id: "1", name: "Product Description", date: "May 10" },
    { id: "2", name: "Blog Outline", date: "May 8" },
    { id: "3", name: "Email Campaign", date: "May 5" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gradient-blue">Workspace</h2>
            <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/5">
              <Settings className="h-4 w-4 text-white/70" />
            </Button>
          </div>
          
          <Button 
            className="w-full bg-blue-700 hover:bg-blue-800 text-white mb-6 hover-glow"
          >
            <Plus className="h-4 w-4 mr-2" /> New Prompt
          </Button>
          
          <div className="space-y-1 flex-1 overflow-y-auto prompt-chat-scrollbar">
            {savedPrompts.map(prompt => (
              <button
                key={prompt.id}
                className={`w-full text-left p-2 rounded-md hover:bg-white/5 transition-colors flex items-center justify-between group ${
                  activePrompt === prompt.id ? "bg-blue-700/20 text-blue-400" : "text-white/70"
                }`}
                onClick={() => setActivePrompt(prompt.id)}
              >
                <div className="flex items-center">
                  <Folder className="h-4 w-4 mr-2 opacity-70" />
                  <span>{prompt.name}</span>
                </div>
                <span className="text-xs opacity-50 group-hover:opacity-100">{prompt.date}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Prompt Enhancer</h1>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white hover-glow">
                <Sparkles className="h-4 w-4 mr-2" /> Upgrade
              </Button>
            </div>
            
            <div className="bolt-card overflow-hidden">
              <ChatContainer />
            </div>
          </div>
        </div>
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Workspace;
