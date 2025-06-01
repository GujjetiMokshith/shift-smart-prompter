
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/services/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  useEffect(() => {
    // Listen for auth state changes to update analytics user ID
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      analytics.setUserId(session?.user?.id || null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        analytics.trackSignup('free_service'); // Track as free service signup
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};
