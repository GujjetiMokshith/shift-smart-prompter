
import { useEffect } from 'react';
import { analytics } from '@/services/analytics';
import { enhancedAnalytics } from '@/services/enhancedAnalytics';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  return {
    trackPromptEdit: (metadata?: Record<string, any>) => 
      analytics.trackEvent('prompt_edit', metadata),
    
    trackPromptSave: (metadata?: Record<string, any>) => 
      analytics.trackEvent('prompt_save', metadata),
    
    trackPromptSubmit: (metadata?: Record<string, any>) => 
      analytics.trackEvent('prompt_submit', metadata),
    
    trackPromptLike: (metadata?: Record<string, any>) => 
      analytics.trackEvent('prompt_like', metadata),
    
    trackPromptFavorite: (metadata?: Record<string, any>) => 
      analytics.trackEvent('prompt_favorite', metadata),
    
    trackModelSelection: (model: string) => 
      enhancedAnalytics.trackModelSelection(model),
    
    trackToolEngagement: (toolName: string, duration?: number, interactions?: number) => 
      enhancedAnalytics.trackToolEngagement(toolName, duration || 0, interactions || 1),
    
    trackFeedback: (type: string, rating?: number, message?: string) => 
      analytics.trackUserFeedback(type, rating, message),
    
    trackPromptEnhancement: (data: {
      originalPrompt: string;
      enhancedPrompt: string;
      modelUsed: string;
      enhancementTimeMs: number;
    }) => enhancedAnalytics.trackPromptEnhancement(data)
  };
};
