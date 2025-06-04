import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, HelpCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  isCollapsed: boolean;
  onNewChat: () => void;
  chatHistory: ChatHistoryItem[];
  activeChat: ChatHistoryItem | null;
  onSelectChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onNewChat, 
  chatHistory, 
  activeChat, 
  onSelectChat 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSaveSettings = () => {
    // Save settings logic here
    toast.success("Settings saved successfully!");
    setShowSettings(false);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#0B1426] border-r border-white/10 flex flex-col items-center py-4 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
          title="New Chat"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-64 bg-[#0B1426] border-r border-white/10 flex flex-col">
        <div className="p-4">
          <Button
            onClick={onNewChat}
            className="w-full bg-transparent border border-white/10 text-white hover:bg-white/5 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>
        
        <div className="flex-1 px-4 overflow-y-auto">
          {chatHistory.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wide mb-2">Recent Chats</h3>
              {chatHistory.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full justify-start text-white/70 hover:text-white hover:bg-white/10 h-auto py-2 px-3 ${
                    activeChat?.id === chat.id ? 'bg-white/10 text-white' : ''
                  }`}
                >
                  <div className="flex items-start gap-2 w-full">
                    <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-sm truncate w-full text-left">{chat.title}</span>
                      <span className="text-xs text-white/40 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {chat.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <Separator className="bg-white/10" />
        
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>
      </div>

      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent side="left" className="bg-[#030712] border-r border-white/5 text-white">
          <SheetHeader>
            <SheetTitle className="text-gradient-blue">Settings</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="custom-prompt" className="text-white">Use Custom System Prompt</Label>
                <Switch
                  id="custom-prompt"
                  checked={isCustomPrompt}
                  onCheckedChange={setIsCustomPrompt}
                  className="data-[state=checked]:bg-blue-800"
                />
              </div>
              <p className="text-xs text-white/60">
                Toggle to use your own system prompt instead of the default ones.
              </p>
            </div>
            
            {isCustomPrompt && (
              <div className="space-y-2">
                <Label htmlFor="prompt-text" className="text-white">Custom System Prompt</Label>
                <Textarea
                  id="prompt-text"
                  placeholder="Enter your custom system prompt here..."
                  className="bg-[#060B16] border-white/5 min-h-[200px] text-white placeholder:text-white/30"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                <p className="text-xs text-white/60">
                  This will replace the default system prompt used for enhancement.
                </p>
              </div>
            )}
            
            <Button 
              className="w-full bg-blue-900 hover:bg-blue-800 text-white hover-glow" 
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;