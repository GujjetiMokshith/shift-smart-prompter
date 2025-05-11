
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Model {
  id: string;
  name: string;
  description: string;
  isPrimary?: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  className?: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const models: Model[] = [
    {
      id: "llama-4",
      name: "Gruq Llama 4",
      description: "Primary AI model for enhanced prompting",
      isPrimary: true,
    },
    {
      id: "claude",
      name: "Claude",
      description: "Alternative model with different capabilities",
    },
    {
      id: "chatgpt",
      name: "ChatGPT",
      description: "OpenAI's GPT model for varied enhancement",
    },
    {
      id: "mistral",
      name: "Mistral AI",
      description: "Open source model for specialized tasks",
    },
  ];

  const selectedModelData = models.find((model) => model.id === selectedModel) || models[0];

  return (
    <div className={cn("relative", className)}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 text-sm transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col items-start">
          <span className="font-medium text-xs text-white">Optimizing for:</span>
          <span className="text-promptshift-accent">{selectedModelData.name}</span>
        </div>
        <ChevronDown size={16} className={`text-white/70 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full mt-1 w-64 glass p-1 z-10 animate-fade-in"
        >
          <div className="text-xs text-white/70 px-2 py-1">Select target model</div>
          <div className="space-y-1">
            {models.map((model) => (
              <button
                key={model.id}
                className={`w-full flex items-center justify-between p-2 rounded-md text-left text-sm ${
                  selectedModel === model.id
                    ? "bg-promptshift-primary text-white"
                    : "hover:bg-white/5 text-white"
                } transition-colors`}
                onClick={() => {
                  onSelectModel(model.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-1">
                    {model.name}
                    {model.isPrimary && (
                      <span className="text-[10px] bg-promptshift-success/20 text-promptshift-success px-1 rounded">
                        Primary
                      </span>
                    )}
                  </span>
                  <span className="text-xs opacity-70">{model.description}</span>
                </div>
                {selectedModel === model.id && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
