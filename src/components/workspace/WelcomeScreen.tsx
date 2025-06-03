
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Target, Zap, Rocket } from 'lucide-react';

interface WelcomeScreenProps {
  onExampleClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  const examples = [
    {
      title: "Creative Writing",
      description: "Write a story about...",
      icon: Sparkles,
      prompt: "Write a compelling short story about a detective who discovers that their own memories have been altered to hide a crime they committed."
    },
    {
      title: "Business Strategy", 
      description: "Create a marketing plan for...",
      icon: Target,
      prompt: "Develop a comprehensive digital marketing strategy for a sustainable fashion startup targeting eco-conscious millennials."
    },
    {
      title: "Technical Guide",
      description: "Explain how to build...",
      icon: Zap,
      prompt: "Create a step-by-step tutorial for building a real-time chat application using React, Socket.io, and Node.js."
    },
    {
      title: "Product Development",
      description: "Design a mobile app for...",
      icon: Rocket,
      prompt: "Design a mobile app that helps users track their carbon footprint and suggests personalized ways to reduce environmental impact."
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Zap className="h-16 w-16 text-blue-500 animate-pulse" />
            <div className="absolute -inset-1 bg-blue-500/20 blur-xl rounded-full"></div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="text-gradient-blue">PromptShift</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl">
          Transform your basic prompts into detailed, professional instructions with AI-powered enhancement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {examples.map((example, index) => {
          const Icon = example.icon;
          return (
            <Card 
              key={index}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              onClick={onExampleClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-white text-lg">{example.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/60 text-sm leading-relaxed">
                  {example.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={onExampleClick}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl hover-glow"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Start New Chat
        </Button>
        <p className="text-white/50 text-sm mt-4">
          Click any example above or start with your own prompt
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
