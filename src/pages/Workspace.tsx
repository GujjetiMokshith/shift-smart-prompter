
import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import Sidebar from '@/components/workspace/Sidebar';
import WelcomeScreen from '@/components/workspace/WelcomeScreen';
import { Toaster } from 'sonner';

const Workspace = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, title: string, timestamp: Date}>>([]);

  const handleNewChat = () => {
    setHasMessages(false);
    setInputValue('');
    
    // Add current chat to history if it has content
    if (hasMessages) {
      const newChat = {
        id: Date.now().toString(),
        title: inputValue.slice(0, 50) + (inputValue.length > 50 ? '...' : ''),
        timestamp: new Date()
      };
      setChatHistory(prev => [newChat, ...prev]);
    }
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
    setHasMessages(true);
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
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          showSidebarToggle={true}
          onToggleSidebar={handleToggleSidebar}
        />
        
        <main className="flex-1 flex">
          {!hasMessages ? (
            <WelcomeScreen onExampleClick={handleExampleClick} />
          ) : (
            <div className="flex-1">
              <ChatContainer 
                initialInput={inputValue}
                onMessageSent={() => setHasMessages(true)}
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
