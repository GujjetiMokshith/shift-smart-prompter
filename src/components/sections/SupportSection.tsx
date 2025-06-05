import React from "react";
import { Coffee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedText from "@/components/ui/animated-text";

const SupportSection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-[#030712]/50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass border border-white/10 p-12 hover-border-glow backdrop-blur-xl relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600/30 to-orange-600/30 rounded-full flex items-center justify-center mb-6 mx-auto glow-amber-sm border border-amber-400/20 hover:scale-110 transition-all duration-300">
              <Coffee className="h-10 w-10 text-amber-400" />
            </div>
            
            <AnimatedText variant="gradient" className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Support Our Mission 💙
              </span>
            </AnimatedText>
            
            <AnimatedText delay={300} className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Help us democratize AI excellence for everyone—developers, creators, and dreamers alike. 
              PromptShift is completely free to use, and your support keeps it that way.
            </AnimatedText>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white hover-glow px-8 transition-all duration-300 hover:scale-105"
                onClick={() => window.open('https://buymeacoffee.com/promptshift', '_blank')}
              >
                <Coffee className="mr-2 h-5 w-5" />
                Buy Us a Coffee
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link to="/workspace">
                  Start Using Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-white/50 animate-fade-in" style={{animationDelay: '0.6s'}}>
              Your support helps us maintain servers, improve AI models, and add new features
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;