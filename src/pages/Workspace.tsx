
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import OnboardingModal from '@/components/OnboardingModal';
import Sidebar from '@/components/workspace/Sidebar';
import WelcomeScreen from '@/components/workspace/WelcomeScreen';
import { Toaster } from 'sonner';
import { sessionTracker } from '@/services/sessionTracker';

const Workspace = () => {
  const { user, isLoaded } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isLoaded, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (user) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050A14]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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

      {user && (
        <OnboardingModal 
          isOpen={showOnboarding} 
          onComplete={handleOnboardingComplete} 
        />
      )}
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Workspace;
