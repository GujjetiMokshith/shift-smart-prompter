import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  eventType: string;
  metadata?: Record<string, any>;
}

class Analytics {
  private userId: string | null = null;
  private maxRetries = 3;
  private initialRetryDelay = 1000; // 1 second

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private async retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt > this.maxRetries) {
        throw error;
      }

      const delay = this.initialRetryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.retryWithExponentialBackoff(operation, attempt + 1);
    }
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

      await this.retryWithExponentialBackoff(async () => {
        const { error } = await supabase
          .from('analytics_events')
          .insert(eventData);

        if (error) {
          throw error;
        }
      });
    } catch (error) {
      console.error('Analytics error after retries:', error);
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

      await this.retryWithExponentialBackoff(async () => {
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
          throw error;
        }
      });
    } catch (error) {
      console.error('Error in trackUserFeedback after retries:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const analytics = new Analytics();