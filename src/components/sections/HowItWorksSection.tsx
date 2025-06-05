import React from "react";
import { Layers, Cpu, TrendingUp } from "lucide-react";
import AnimatedText from "@/components/ui/animated-text";

const HowItWorksSection: React.FC = () => {
  const processSteps = [
    {
      step: "01",
      title: "Input Your Prompt",
      description: "Paste your basic prompt or idea into our intuitive interface",
      icon: Layers
    },
    {
      step: "02", 
      title: "AI Enhancement",
      description: "Our advanced AI analyzes and enhances your prompt with detailed specifications",
      icon: Cpu
    },
    {
      step: "03",
      title: "Get Results",
      description: "Receive a comprehensive, optimized prompt ready for any AI model",
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-24 px-4 bg-[#030712]/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <AnimatedText variant="gradient" className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </AnimatedText>
          <AnimatedText delay={300} className="text-xl text-white/70 max-w-3xl mx-auto">
            Transform your prompts in three simple steps with our AI-powered enhancement engine
          </AnimatedText>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <div 
              key={step.step}
              className="glass border border-white/10 p-8 hover-border-glow hover-scale transition-all duration-500 group relative backdrop-blur-xl"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse">
                  {step.step}
                </div>
              </div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-2xl flex items-center justify-center mb-6 glow-blue-sm group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/10">
                <step.icon className="h-8 w-8 text-blue-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-white/70 leading-relaxed">{step.description}</p>
              
              {/* Connection line for desktop */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;