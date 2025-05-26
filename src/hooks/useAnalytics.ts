
import { useEffect } from 'react';
import { analytics } from '@/services/analytics';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView();
  }, [location.pathname]);

  return {
    trackPromptEdit: (metadata?: Record<string, any>) => 
      analytics.trackPromptInteraction('edit', metadata),
    
    trackPromptSave: (metadata?: Record<string, any>) => 
      analytics.trackPromptInteraction('save', metadata),
    
    trackPromptSubmit: (metadata?: Record<string, any>) => 
      analytics.trackPromptInteraction('submit', metadata),
    
    trackPromptLike: (metadata?: Record<string, any>) => 
      analytics.trackPromptInteraction('like', metadata),
    
    trackPromptFavorite: (metadata?: Record<string, any>) => 
      analytics.trackPromptInteraction('favorite', metadata),
    
    trackModelSelection: (model: string) => 
      analytics.trackModelSelection(model),
    
    trackToolEngagement: (toolName: string, duration?: number, interactions?: number) => 
      analytics.trackToolEngagement(toolName, duration, interactions),
    
    trackFeedback: (type: string, rating?: number, message?: string) => 
      analytics.trackFeedback(type, rating, message),
    
    trackSignup: (planType: 'free_plan' | 'pro_plan' | 'enterprise_plan') => 
      analytics.trackSignup(planType),
    
    trackUpgrade: (fromPlan: string, toPlan: string) => 
      analytics.trackUpgrade(fromPlan, toPlan)
  };
};
