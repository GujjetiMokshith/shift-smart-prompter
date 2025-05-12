
import React from "react";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-gradient-blue">About PromptShift</h1>
          <p className="text-xl text-white/80 mb-8">
            PromptShift is an AI prompt engineering platform that helps you create better prompts
            for various AI models. Our tool analyzes your prompts and suggests improvements to
            get the most out of AI language models.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bolt-card p-6 hover-border-glow hover-scale">
              <h3 className="text-xl font-bold mb-2 text-blue-400">Model-Specific</h3>
              <p className="text-white/70">
                Optimize prompts for specific AI models like Llama, Claude, ChatGPT, and Mistral.
              </p>
            </div>
            
            <div className="bolt-card p-6 hover-border-glow hover-scale">
              <h3 className="text-xl font-bold mb-2 text-blue-400">AI-Powered</h3>
              <p className="text-white/70">
                Our enhancement engine uses state-of-the-art AI to improve your prompts.
              </p>
            </div>
            
            <div className="bolt-card p-6 hover-border-glow hover-scale">
              <h3 className="text-xl font-bold mb-2 text-blue-400">Developer Tools</h3>
              <p className="text-white/70">
                Designed for developers and AI practitioners who want better results.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default About;
