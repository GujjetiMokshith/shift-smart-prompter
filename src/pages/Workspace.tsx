import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import OnboardingModal from '@/components/OnboardingModal';
import Sidebar from '@/components/workspace/Sidebar';
import WelcomeScreen from '@/components/workspace/WelcomeScreen';
import { Toaster } from 'sonner';
import { sessionTracker } from '@/services/sessionTracker';

const Workspace = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    sessionTracker.trackEvent('onboarding_completed');
  };

  const handleNewChat = () => {
    setHasMessages(false);
    setInputValue('');
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

      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Workspace;