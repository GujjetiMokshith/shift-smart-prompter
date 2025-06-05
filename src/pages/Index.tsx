import React from "react";
import Header from "@/components/Header";
import WebGLBackground from "@/components/WebGLBackground";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import SupportSection from "@/components/sections/SupportSection";
import CTASection from "@/components/sections/CTASection";
import EnhancedFooter from "@/components/sections/EnhancedFooter";

const Index = () => {
  const navigate = useNavigate();
  
  const handlePromptSubmit = (prompt: string) => {
    localStorage.setItem("pendingPrompt", prompt);
    navigate("/workspace");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#001f54]/20 to-black text-white relative overflow-hidden">
      <WebGLBackground />
      <Header />
      
      <main className="flex-1">
        <HeroSection onPromptSubmit={handlePromptSubmit} />
        <HowItWorksSection />
        <FeaturesSection />
        <SocialProofSection />
        <SupportSection />
        <CTASection />
      </main>
      
      <EnhancedFooter />
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;