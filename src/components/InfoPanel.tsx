
import React from "react";
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  className?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ className }) => {
  return (
    <div className={cn("neo-blur p-6", className)}>
      <h3 className="text-lg font-medium mb-4">How PromptShift Works</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-400">1. Enter Your Prompt</h4>
          <p className="text-xs text-white/70">
            Simply paste your existing prompt into the chat area.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-400">2. Select Target Model</h4>
          <p className="text-xs text-white/70">
            Choose which AI model you're optimizing for from the dropdown menu.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-400">3. Get Enhanced Results</h4>
          <p className="text-xs text-white/70">
            Our AI analyzes and enhances your prompt to work better with the selected model.
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-400">4. Copy & Use</h4>
          <p className="text-xs text-white/70">
            Copy the enhanced prompt with a single click and use it with your chosen AI model.
          </p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium mb-2">Example Prompt Enhancement</h4>
        <div className="space-y-2">
          <div className="neo-blur p-2 rounded-lg">
            <div className="text-[10px] uppercase text-white/50 mb-1">Original</div>
            <p className="text-xs">Generate a social media post about sustainable fashion.</p>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/30 p-2 rounded-lg">
            <div className="text-[10px] uppercase text-blue-400 mb-1">Enhanced</div>
            <p className="text-xs">
              Compose an engaging Instagram caption promoting sustainable fashion brands. Emphasize eco-friendly materials, ethical labor practices, and include a call-to-action encouraging followers to share their favorite green fashion tips. Include 2-3 sample hashtags and maintain a conversational tone suitable for Gen Z audiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
