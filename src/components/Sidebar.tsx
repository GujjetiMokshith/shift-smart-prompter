
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';

interface Chat {
  id: string;
  title: string;
  updated_at: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat: () => void;
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onNewChat,
  activeChat,
  onSelectChat
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('enhanced_prompts')
        .select('id, original_prompt, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedChats = data?.map(prompt => ({
        id: prompt.id,
        title: prompt.original_prompt.slice(0, 50) + '...',
        updated_at: prompt.created_at
      })) || [];

      setChats(formattedChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-[#0A0F1C] border-r border-white/10 transition-all duration-300",
      collapsed ? "w-12" : "w-64"
    )}>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span className="font-semibold text-white">PromptShift</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full bg-white/10 hover:bg-white/20 text-white border border-white/20",
            collapsed && "px-0"
          )}
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="ml-2">New Chat</span>}
        </Button>
      </div>

      {/* Chat History */}
      {!collapsed && (
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
              Recent Chats
            </div>
            {chats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full justify-start text-left h-auto p-3 text-white/70 hover:text-white hover:bg-white/10",
                  activeChat === chat.id && "bg-white/10 text-white"
                )}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate text-sm">{chat.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Settings */}
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-white/60 hover:text-white hover:bg-white/10",
            collapsed ? "px-0" : "justify-start"
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Settings</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
