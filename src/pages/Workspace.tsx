
import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import ChatContainer from '@/components/ChatContainer';
import OnboardingModal from '@/components/OnboardingModal';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import { sessionTracker } from '@/services/sessionTracker';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Workspace = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useUser();

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    sessionTracker.trackEvent('onboarding_completed');
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    sessionTracker.trackEvent('onboarding_skipped');
  };

  const handleNewChat = () => {
    setActiveChat(null);
  };

  return (
    <div className="min-h-screen flex bg-[#050A14] text-white">
      <SignedOut>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gradient-blue">Welcome to PromptShift</h1>
            <p className="text-white/70 mb-8">Sign in to start enhancing your prompts</p>
            <SignInButton mode="modal">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNewChat={handleNewChat}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-14 border-b border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </header>

          {/* Chat Area */}
          <main className="flex-1">
            <ChatContainer />
          </main>
        </div>

        {/* Onboarding Modal */}
        <OnboardingModal 
          isOpen={showOnboarding} 
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      </SignedIn>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Workspace;
