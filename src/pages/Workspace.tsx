
import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import OnboardingModal from '@/components/OnboardingModal';
import { Toaster } from 'sonner';
import { sessionTracker } from '@/services/sessionTracker';

const Workspace = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    sessionTracker.trackEvent('onboarding_completed');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      
      <main className="flex-1 flex">
        <div className="flex-1">
          <ChatContainer />
        </div>
      </main>

      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Workspace;
