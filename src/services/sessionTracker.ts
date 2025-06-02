class SessionTracker {
  private sessionId: string;
  private startTime: Date;
  private sessionData: {
    sessionId: string;
    startTime: Date;
    lastActivity: Date;
    pageViews: number;
  };
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.sessionData = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      lastActivity: new Date(),
      pageViews: 0
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public trackEvent(eventType: string, metadata?: Record<string, any>) {
    this.sessionData.lastActivity = new Date();
    console.log('Event tracked:', {
      sessionId: this.sessionId,
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  public trackPageView() {
    this.sessionData.pageViews++;
    this.trackEvent('page_view', {
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getSessionData() {
    return { ...this.sessionData };
  }

  public getSessionDuration(): number {
    return Date.now() - this.startTime.getTime();
  }
}

export const sessionTracker = new SessionTracker();