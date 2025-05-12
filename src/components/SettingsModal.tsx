import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface SettingsModalProps {
  isCustomPrompt: boolean;
  customPrompt: string;
  onToggleCustomPrompt: (value: boolean) => void;
  onUpdateCustomPrompt: (prompt: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isCustomPrompt,
  customPrompt,
  onToggleCustomPrompt,
  onUpdateCustomPrompt
}) => {
  const [localPrompt, setLocalPrompt] = useState(customPrompt);
  const [localIsCustom, setLocalIsCustom] = useState(isCustomPrompt);
  
  const handleSave = () => {
    onToggleCustomPrompt(localIsCustom);
    onUpdateCustomPrompt(localPrompt);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="fixed bottom-4 left-4 z-20">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-blue-700/20 hover:bg-blue-700/30 hover-glow-sm"
          >
            <Settings className="h-5 w-5 text-blue-500" />
            <span className="sr-only">Settings</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#070C18] border-r border-white/5 text-white">
          <SheetHeader>
            <SheetTitle className="text-gradient-blue">Settings</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="custom-prompt" className="text-white">Use Custom System Prompt</Label>
                <Switch
                  id="custom-prompt"
                  checked={localIsCustom}
                  onCheckedChange={setLocalIsCustom}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              <p className="text-xs text-white/60">
                Toggle to use your own system prompt instead of the default ones.
              </p>
            </div>
            
            {localIsCustom && (
              <div className="space-y-2">
                <Label htmlFor="prompt-text" className="text-white">Custom System Prompt</Label>
                <Textarea
                  id="prompt-text"
                  placeholder="Enter your custom system prompt here..."
                  className="bg-[#0A1020] border-white/5 min-h-[200px] text-white placeholder:text-white/30"
                  value={localPrompt}
                  onChange={(e) => setLocalPrompt(e.target.value)}
                />
                <p className="text-xs text-white/60">
                  This will replace the default system prompt used for enhancement.
                </p>
              </div>
            )}
            
            <Button 
              className="w-full bg-blue-700 hover:bg-blue-800 text-white hover-glow" 
              onClick={handleSave}
            >
              Save Settings
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SettingsModal;