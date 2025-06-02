import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { analytics } from '@/services/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { user } = useUser();
  
  useEffect(() => {
    analytics.setUserId(user?.id || null);
    
    if (user) {
      analytics.trackSignup('free_service');
    }
  }, [user]);

  return <>{children}</>;
};