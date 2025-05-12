
import React from "react";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-white/5 p-6 hidden md:block">
          <h2 className="text-lg font-bold mb-4 text-gradient-blue">Documentation</h2>
          <nav className="space-y-1">
            {["Getting Started", "Models", "API", "Examples", "Pricing", "FAQ"].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="block py-2 px-3 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-6 text-gradient-blue">Getting Started with PromptShift</h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white/80 mb-6">
                PromptShift helps you create better prompts for AI models. Here's how to get started.
              </p>
              
              <h2 className="text-xl font-bold mt-8 mb-3 text-white">Basic Usage</h2>
              <p className="text-white/80 mb-4">
                Simply paste your prompt in the main input box and select which AI model you want to optimize for. 
                PromptShift will analyze your prompt and suggest improvements specific to that model.
              </p>
              
              <h2 className="text-xl font-bold mt-8 mb-3 text-white">Supported Models</h2>
              <ul className="list-disc pl-5 space-y-2 text-white/80 mb-6">
                <li><strong className="text-blue-400">Llama 4</strong> - Optimized for reasoning and understanding</li>
                <li><strong className="text-blue-400">Claude</strong> - Balanced performance with nuanced responses</li>
                <li><strong className="text-blue-400">ChatGPT</strong> - Great at following structured instructions</li>
                <li><strong className="text-blue-400">Mistral</strong> - Excellent for technical and precise tasks</li>
              </ul>
              
              <h2 className="text-xl font-bold mt-8 mb-3 text-white">Custom Prompts</h2>
              <p className="text-white/80 mb-4">
                You can use the settings menu to define custom system prompts if you want more control over how 
                your prompts are enhanced.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Documentation;
