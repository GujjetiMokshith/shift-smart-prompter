
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
    // Analytics tracking disabled in production
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
    await this.trackEvent('user_feedback', {
      feedbackType,
      rating,
      message,
      page: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const analytics = new Analytics();
