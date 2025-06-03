
import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import Sidebar from '@/components/workspace/Sidebar';
import WelcomeScreen from '@/components/workspace/WelcomeScreen';
import { Toaster } from 'sonner';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

const Workspace = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
      messages: []
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChat(newChat);
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
    }
  };

  const handleUpdateChatTitle = (chatId: string, newTitle: string) => {
    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle }
          : chat
      )
    );
    
    if (activeChat?.id === chatId) {
      setActiveChat(prev => prev ? { ...prev, title: newTitle } : null);
    }
  };

  const handleAddMessage = (message: { type: 'user' | 'assistant'; content: string }) => {
    if (!activeChat) return;

    const newMessage = {
      id: Date.now().toString(),
      type: message.type,
      content: message.content,
      timestamp: new Date()
    };

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      title: activeChat.title === 'New Chat' && message.type === 'user' 
        ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
        : activeChat.title
    };

    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      )
    );
    
    setActiveChat(updatedChat);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-[#050A14] text-white">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          showSidebarToggle={true}
          onToggleSidebar={handleToggleSidebar}
        />
        
        <main className="flex-1 flex">
          {!activeChat ? (
            <WelcomeScreen onExampleClick={handleNewChat} />
          ) : (
            <div className="flex-1">
              <ChatContainer 
                chat={activeChat}
                onAddMessage={handleAddMessage}
                onUpdateTitle={handleUpdateChatTitle}
              />
            </div>
          )}
        </main>
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Workspace;
