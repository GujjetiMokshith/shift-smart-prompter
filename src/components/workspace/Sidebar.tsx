
import React from 'react';
import { Plus, MessageSquare, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isCollapsed: boolean;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onNewChat }) => {
  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#0B1426] border-r border-white/10 flex flex-col items-center py-4 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
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
          className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
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
      
      <div className="flex-1 px-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Recent Prompts
          </Button>
        </div>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
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
  );
};

export default Sidebar;
