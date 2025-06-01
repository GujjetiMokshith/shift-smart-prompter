class SessionTracker {
  private sessionId: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public trackEvent(eventType: string, metadata?: Record<string, any>) {
    console.log('Event tracked:', {
      sessionId: this.sessionId,
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  public trackPageView() {
    this.trackEvent('page_view', {
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  public getSessionId(): string {
    return this.sessionId;
  }
}

export const sessionTracker = new SessionTracker();