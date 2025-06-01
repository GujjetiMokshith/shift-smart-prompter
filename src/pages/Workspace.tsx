import React, { useState } from 'react';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import InfoPanel from '@/components/InfoPanel';
import OnboardingModal from '@/components/OnboardingModal';
import CustomInstructions from '@/components/CustomInstructions';
import { Toaster } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <div className="border-b border-white/10 px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="instructions" className="data-[state=active]:bg-blue-600">
                  Custom Instructions
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-1 flex m-0">
              <div className="flex-1">
                <ChatContainer />
              </div>
              <InfoPanel />
            </TabsContent>
            
            <TabsContent value="instructions" className="flex-1 m-0 p-6">
              <CustomInstructions />
            </TabsContent>
          </Tabs>
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