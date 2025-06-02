
import React from 'react';
import { Sparkles, Zap, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onExampleClick: (example: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const examples = [
    {
      title: "Write a professional email",
      description: "Draft a follow-up email to a client",
      prompt: "Write a professional follow-up email to a client about a project proposal"
    },
    {
      title: "Create marketing copy",
      description: "Generate compelling product descriptions",
      prompt: "Create marketing copy for a new eco-friendly water bottle"
    },
    {
      title: "Plan a presentation",
      description: "Outline a business presentation structure",
      prompt: "Plan a 15-minute presentation about quarterly sales results"
    },
    {
      title: "Explain complex topics",
      description: "Break down difficult concepts simply",
      prompt: "Explain quantum computing in simple terms for beginners"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-8 w-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-semibold text-white mb-4">
          Transform your prompts with AI
        </h1>
        <p className="text-white/70 text-lg max-w-2xl">
          Turn basic prompts into detailed, optimized instructions that get better results from any AI model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example.prompt)}
            className="group p-6 bg-[#0B1426] border border-white/10 rounded-xl hover:border-blue-500/30 hover:bg-[#0D1A2E] transition-all duration-200 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30 transition-colors">
                <Lightbulb className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-2 group-hover:text-blue-300 transition-colors">
                  {example.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {example.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Try this example</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span>Powered by Groq • Ultra-fast AI inference</span>
      </div>
    </div>
  );
};

export default WelcomeScreen;
