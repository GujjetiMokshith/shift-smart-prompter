import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchIcon, Check } from 'lucide-react';
import { Button } from './ui/button';

interface TargetService {
  id: string;
  name: string;
  description: string;
  isPrimary?: boolean;
}

interface ModelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceId: string) => void;
  currentService: string;
}

const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  currentService
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredServices = targetServices.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#030712] border border-white/5 text-white w-full max-w-md p-0 overflow-hidden glow-blue">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-gradient-blue">Select Target Service</DialogTitle>
          <p className="text-sm text-white/70 mt-1">Choose which AI service to optimize your prompt for</p>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input 
              placeholder="Search services..." 
              className="pl-10 bg-[#060B16] border-white/5 text-white placeholder:text-white/30 hover-border-glow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="px-4 pb-4 max-h-[300px] overflow-y-auto prompt-chat-scrollbar">
          <div className="grid gap-2">
            {filteredServices.map(service => (
              <button
                key={service.id}
                className={`flex items-center justify-between p-3 rounded-lg border hover-scale ${
                  currentService === service.id 
                    ? "bg-blue-900/20 border-blue-800 glow-blue-sm" 
                    : "bg-[#060B16] border-transparent hover:bg-[#080E1A]"
                } transition-all duration-300`}
                onClick={() => onSelectService(service.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium flex items-center gap-1">
                    {service.name}
                    {service.isPrimary && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded">
                        Recommended
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-white/70 mt-1">{service.description}</span>
                </div>
                {currentService === service.id && <Check size={16} className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5 flex justify-end">
          <Button 
            className="bg-blue-900 hover:bg-blue-800 text-white hover-glow"
            onClick={() => onSelectService(currentService)}
          >
            Continue with {targetServices.find(s => s.id === currentService)?.name || 'Selected Service'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelSelectionModal;