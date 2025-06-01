
import { supabase } from '@/integrations/supabase/client';

interface SessionData {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  isActive: boolean;
}

type EventType = 'page_view' | 'session_start' | 'session_end' | 'prompt_edit' | 'prompt_save' | 'prompt_submit' | 'model_selection' | 'enhancement_interaction' | 'tool_engagement' | 'signup' | 'upgrade' | 'prompt_like' | 'prompt_favorite' | 'feedback_submit' | 'prompt_enhancement' | 'onboarding_completed';

class SessionTracker {
  private sessionData: SessionData | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private readonly ACTIVITY_TIMEOUT = 30000; // 30 seconds of inactivity
  private readonly SESSION_UPDATE_INTERVAL = 60000; // Update every minute

  constructor() {
    this.initializeSession();
    this.setupActivityListeners();
    this.setupPeriodicUpdates();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeSession() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      this.sessionData = {
        sessionId: this.generateSessionId(),
        startTime: new Date(),
        lastActivity: new Date(),
        pageViews: 1,
        isActive: true
      };

      // Create session record in database
      await this.createSessionRecord(user?.id);
      
      console.log('Session initialized:', this.sessionData.sessionId);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  }

  private async createSessionRecord(userId?: string) {
    if (!this.sessionData) return;

    try {
      const sessionRecord = {
        session_id: this.sessionData.sessionId,
        user_id: userId || null,
        start_time: this.sessionData.startTime.toISOString(),
        page_views: 1,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        ip_address: null, // Will be filled by server if needed
        country_code: null,
        city: null,
        is_bounce: false
      };

      const { error } = await supabase
        .from('user_sessions')
        .insert(sessionRecord);

      if (error) {
        console.error('Failed to create session record:', error);
      }
    } catch (error) {
      console.error('Error creating session record:', error);
    }
  }

  private setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.recordActivity(), { passive: true });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });

    // Track beforeunload for session end
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private recordActivity() {
    if (!this.sessionData) return;

    this.sessionData.lastActivity = new Date();
    this.sessionData.isActive = true;

    // Reset activity timer
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    // Set new timeout for inactivity detection
    this.activityTimer = setTimeout(() => {
      this.markInactive();
    }, this.ACTIVITY_TIMEOUT);
  }

  private markInactive() {
    if (this.sessionData) {
      this.sessionData.isActive = false;
      console.log('Session marked as inactive');
    }
  }

  private pauseSession() {
    if (this.sessionData) {
      this.sessionData.isActive = false;
      this.updateSessionInDatabase();
    }
  }

  private resumeSession() {
    if (this.sessionData) {
      this.sessionData.isActive = true;
      this.sessionData.lastActivity = new Date();
      this.recordActivity();
    }
  }

  private setupPeriodicUpdates() {
    setInterval(() => {
      this.updateSessionInDatabase();
    }, this.SESSION_UPDATE_INTERVAL);
  }

  private async updateSessionInDatabase() {
    if (!this.sessionData) return;

    try {
      const now = new Date();
      const durationSeconds = Math.floor((now.getTime() - this.sessionData.startTime.getTime()) / 1000);

      const updates = {
        duration_seconds: durationSeconds,
        page_views: this.sessionData.pageViews,
        end_time: this.sessionData.isActive ? null : now.toISOString()
      };

      const { error } = await supabase
        .from('user_sessions')
        .update(updates)
        .eq('session_id', this.sessionData.sessionId);

      if (error) {
        console.error('Failed to update session:', error);
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  public trackPageView() {
    if (this.sessionData) {
      this.sessionData.pageViews++;
      this.recordActivity();
      console.log('Page view tracked, total:', this.sessionData.pageViews);
    }
  }

  public async trackEvent(eventType: EventType, metadata?: Record<string, any>) {
    if (!this.sessionData) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const eventRecord = {
        session_id: this.sessionData.sessionId,
        user_id: user?.id || null,
        event_type: eventType,
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        metadata: metadata || {},
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(eventRecord);

      if (error) {
        console.error('Failed to track event:', error);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  private async endSession() {
    if (!this.sessionData) return;

    try {
      const endTime = new Date();
      const durationSeconds = Math.floor((endTime.getTime() - this.sessionData.startTime.getTime()) / 1000);

      const updates = {
        end_time: endTime.toISOString(),
        duration_seconds: durationSeconds,
        page_views: this.sessionData.pageViews,
        is_bounce: this.sessionData.pageViews <= 1 && durationSeconds < 30
      };

      const { error } = await supabase
        .from('user_sessions')
        .update(updates)
        .eq('session_id', this.sessionData.sessionId);

      if (error) {
        console.error('Failed to end session:', error);
      }

      console.log('Session ended:', this.sessionData.sessionId, 'Duration:', durationSeconds, 'seconds');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  public getSessionData(): SessionData | null {
    return this.sessionData;
  }

  public getSessionDuration(): number {
    if (!this.sessionData) return 0;
    return Math.floor((new Date().getTime() - this.sessionData.startTime.getTime()) / 1000);
  }
}

// Create and export singleton instance
export const sessionTracker = new SessionTracker();
