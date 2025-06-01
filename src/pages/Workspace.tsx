
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import InfoPanel from '@/components/InfoPanel';
import OnboardingModal from '@/components/OnboardingModal';
import CustomInstructions from '@/components/CustomInstructions';
import { Toaster } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sessionTracker } from '@/services/sessionTracker';

const Workspace = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkAuthAndOnboarding();
    
    // Track page view
    sessionTracker.trackPageView();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed in workspace:', event);
        if (event === 'SIGNED_OUT') {
          navigate('/');
        } else if (session?.user) {
          setUser(session.user);
          checkOnboardingStatus(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuthAndOnboarding = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      setUser(session.user);
      await checkOnboardingStatus(session.user.id);
    } catch (error) {
      console.error('Error in auth check:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking onboarding status:', error);
        return;
      }

      // Show onboarding if no response found
      setShowOnboarding(!data);
    } catch (error) {
      console.error('Error checking onboarding:', error);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    sessionTracker.trackEvent('onboarding_completed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Loading workspace...</p>
          </div>
        </div>
      </div>
    );
  }

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
