
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  eventType: string;
  metadata?: Record<string, any>;
}

class Analytics {
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  async trackEvent(eventType: string, metadata?: Record<string, any>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const eventData = {
        event_type: eventType as any, // Type assertion for enum compatibility
        user_id: user?.id || null,
        session_id: this.generateSessionId(),
        metadata: metadata || {},
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(eventData);

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  async trackSignup(source: string = 'direct') {
    await this.trackEvent('signup', {
      source,
      timestamp: new Date().toISOString()
    });
  }

  async trackPromptEnhancement(data: {
    originalPrompt: string;
    enhancedPrompt: string;
    modelUsed: string;
    enhancementTimeMs: number;
  }) {
    await this.trackEvent('enhancement_interaction', {
      model_used: data.modelUsed,
      original_length: data.originalPrompt.length,
      enhanced_length: data.enhancedPrompt.length,
      enhancement_time_ms: data.enhancementTimeMs,
      improvement_ratio: data.enhancedPrompt.length / data.originalPrompt.length
    });
  }

  async trackPageView(page: string) {
    await this.trackEvent('page_view', {
      page,
      timestamp: new Date().toISOString()
    });
  }

  async trackUserFeedback(feedbackType: string, rating?: number, message?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user?.id || null,
          feedback_type: feedbackType,
          rating: rating || null,
          message: message || null,
          page_url: window.location.href,
          metadata: {
            timestamp: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error tracking user feedback:', error);
      }
    } catch (error) {
      console.error('Error in trackUserFeedback:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const analytics = new Analytics();
