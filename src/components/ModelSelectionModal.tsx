import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchIcon, Check } from 'lucide-react';
import { Button } from './ui/button';

interface Model {
  id: string;
  name: string;
  description: string;
  isPrimary?: boolean;
}

interface ModelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (modelId: string) => void;
  currentModel: string;
}

const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectModel,
  currentModel
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const models: Model[] = [
    {
      id: "llama-3.3-70b-versatile",
      name: "Llama 3.3",
      description: "Versatile model optimized for reasoning and understanding",
      isPrimary: true,
    },
    {
      id: "mixtral-8x7b-32768",
      name: "Mixtral 8x7B",
      description: "High-performance model with extended context window",
    },
    {
      id: "gemma2-9b-it",
      name: "Gemma 2",
      description: "Efficient model for instruction following and generation",
    },
  ];

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#030712] border border-white/5 text-white w-full max-w-md p-0 overflow-hidden glow-blue">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-gradient-blue">Select AI Model</DialogTitle>
          <p className="text-sm text-white/70 mt-1">Choose which AI model to optimize your prompt for</p>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input 
              placeholder="Search models..." 
              className="pl-10 bg-[#060B16] border-white/5 text-white placeholder:text-white/30 hover-border-glow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="px-4 pb-4 max-h-[300px] overflow-y-auto prompt-chat-scrollbar">
          <div className="grid gap-2">
            {filteredModels.map(model => (
              <button
                key={model.id}
                className={`flex items-center justify-between p-3 rounded-lg border hover-scale ${
                  currentModel === model.id 
                    ? "bg-blue-900/20 border-blue-800 glow-blue-sm" 
                    : "bg-[#060B16] border-transparent hover:bg-[#080E1A]"
                } transition-all duration-300`}
                onClick={() => onSelectModel(model.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium flex items-center gap-1">
                    {model.name}
                    {model.isPrimary && (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded">
                        Primary
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-white/70 mt-1">{model.description}</span>
                </div>
                {currentModel === model.id && <Check size={16} className="text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5 flex justify-end">
          <Button 
            className="bg-blue-900 hover:bg-blue-800 text-white hover-glow"
            onClick={() => onSelectModel(currentModel)}
          >
            Continue with {models.find(m => m.id === currentModel)?.name || 'Selected Model'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelSelectionModal;