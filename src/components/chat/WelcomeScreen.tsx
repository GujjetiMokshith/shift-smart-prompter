
import React from 'react';
import { Sparkles, MessageSquare, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    "what is web 3?",
    "where is airfield?", 
    "when is ww2 start?"
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 max-w-3xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-8">
        <Sparkles className="h-8 w-8 text-blue-400" />
      </div>
      
      <h1 className="text-4xl font-semibold mb-4 text-white">
        How Can I Assist You?
      </h1>
      
      <p className="text-white/60 mb-8 text-lg">
        Quickly find answers, get assistance, and explore AI-powered insights—all in one place
      </p>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSuggestionClick(suggestion)}
            className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Prompt Enhancement</h3>
          <p className="text-white/60 text-sm">
            Transform basic prompts into detailed, AI-optimized instructions for better results.
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
          <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Smart Conversations</h3>
          <p className="text-white/60 text-sm">
            Engage in seamless, natural conversations with AI. From answering questions to generating creative content.
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-white/5 border border-white/10">
          <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
            <Plus className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Multiple Models</h3>
          <p className="text-white/60 text-sm">
            Choose from various AI models including Llama, Mixtral, and Gemma for different tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
