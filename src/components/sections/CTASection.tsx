import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedText from "@/components/ui/animated-text";

const CTASection: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass border border-white/10 p-12 hover-border-glow backdrop-blur-xl relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-blue-400/30 animate-gradient-x"></div>
          </div>
          
          <div className="relative z-10">
            <AnimatedText variant="gradient" className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Start PromptShifting Today
              </span>
            </AnimatedText>
            
            <AnimatedText delay={300} className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Craft smarter prompts. Get better AI results. Instantly.
              <br />Join thousands of professionals transforming their AI workflow.
            </AnimatedText>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white hover-glow px-8 transition-all duration-300 hover:scale-105"
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
                className="border-white/20 text-white hover:bg-white/5 hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;