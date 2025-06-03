import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TargetService {
  id: string;
  name: string;
  description: string;
  isPrimary?: boolean;
}

interface ModelSelectorProps {
  selectedService: string;
  onSelectService: (serviceId: string) => void;
  className?: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedService,
  onSelectService,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const targetServices: TargetService[] = [
    {
      id: "openai",
      name: "OpenAI",
      description: "Optimize prompt for ChatGPT and GPT-4",
      isPrimary: true,
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Format prompt for Claude and Claude 2",
    },
    {
      id: "general",
      name: "General Purpose",
      description: "Universal prompt format for any AI service",
    },
  ];

  const selectedServiceData = targetServices.find((service) => service.id === selectedService) || targetServices[0];

  return (
    <div className={cn("relative", className)}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#070C18] hover:bg-[#0A1020] border border-white/5 text-sm transition-colors hover-border-glow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col items-start">
          <span className="font-medium text-xs text-white/70">Target Service:</span>
          <span className="text-blue-500">{selectedServiceData.name}</span>
        </div>
        <ChevronDown size={16} className={`text-white/70 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-64 bg-[#070C18] border border-white/5 p-1 z-10 rounded-lg shadow-lg animate-fade-in glow-blue-sm"
        >
          <div className="text-xs text-white/70 px-2 py-1">Select target service</div>
          <div className="space-y-1">
            {targetServices.map((service) => (
              <button
                key={service.id}
                className={`w-full flex items-center justify-between p-2 rounded-md text-left text-sm ${
                  selectedService === service.id
                    ? "bg-blue-700 text-white"
                    : "hover:bg-white/5 text-white"
                } transition-colors`}
                onClick={() => {
                  onSelectService(service.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-1">
                    {service.name}
                    {service.isPrimary && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded">
                        Recommended
                      </span>
                    )}
                  </span>
                  <span className="text-xs opacity-70">{service.description}</span>
                </div>
                {selectedService === service.id && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;