
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import ChatContainer from "@/components/ChatContainer";
import InfoPanel from "@/components/InfoPanel";

const Index = () => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  useEffect(() => {
    // Listen for the custom event to open API key input
    const handleOpenApiKeyInput = () => {
      setShowApiKeyInput(true);
    };
    
    window.addEventListener("openApiKeyInput", handleOpenApiKeyInput);
    
    return () => {
      window.removeEventListener("openApiKeyInput", handleOpenApiKeyInput);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-promptshift-secondary to-black">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)]">
          <div className="flex-1 flex flex-col min-h-[60vh]">
            <ChatContainer />
          </div>
          
          <div className="md:w-80 order-first md:order-last mb-6 md:mb-0">
            <InfoPanel />
          </div>
        </div>
      </main>
      
      <footer className="py-4 border-t border-white/5 text-center text-xs text-white/40">
        <p>PromptShift Beta • © 2025 • All rights reserved</p>
      </footer>
    </div>
  );
};

export default Index;
