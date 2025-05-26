
import { supabase } from "@/integrations/supabase/client";

// Generate a unique session ID for anonymous users
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Get or create session ID
let sessionId = localStorage.getItem('promptshift_session_id');
if (!sessionId) {
  sessionId = generateSessionId();
  localStorage.setItem('promptshift_session_id', sessionId);
}

// Type definitions to match database enums
type EventType = 
  | 'page_view'
  | 'session_start'
  | 'session_end'
  | 'prompt_edit'
  | 'prompt_save'
  | 'prompt_submit'
  | 'model_selection'
  | 'enhancement_interaction'
  | 'tool_engagement'
  | 'signup'
  | 'upgrade'
  | 'prompt_like'
  | 'prompt_favorite'
  | 'feedback_submit';

type ModelType = 'chatgpt' | 'claude' | 'llama' | 'mistral';
type PlanType = 'free_plan' | 'pro_plan' | 'enterprise_plan';

interface AnalyticsEvent {
  event_type: EventType;
  page_url?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export class AnalyticsService {
  private sessionId: string;
  private userId: string | null = null;
  private sessionStartTime: Date;

  constructor() {
    this.sessionId = sessionId!;
    this.sessionStartTime = new Date();
    this.initializeSession();
    this.setupUnloadListener();
  }

  private async initializeSession() {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    this.userId = user?.id || null;

    // Track session start
    await this.trackSession();
    await this.trackEvent({
      event_type: 'session_start',
      page_url: window.location.href,
      referrer: document.referrer,
      metadata: {
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
  }

  private setupUnloadListener() {
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });

    // Track session duration periodically
    setInterval(() => {
      this.updateSessionDuration();
    }, 30000); // Every 30 seconds
  }

  async trackEvent(event: AnalyticsEvent) {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          session_id: this.sessionId,
          user_id: this.userId,
          event_type: event.event_type,
          page_url: event.page_url || window.location.href,
          referrer: event.referrer || document.referrer,
          user_agent: navigator.userAgent,
          metadata: event.metadata || {}
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async trackPageView(page_url?: string) {
    await this.trackEvent({
      event_type: 'page_view',
      page_url: page_url || window.location.href,
      metadata: {
        timestamp: new Date().toISOString(),
        document_title: document.title
      }
    });

    // Update page views count in session
    this.updatePageViews();
  }

  async trackPromptInteraction(type: 'edit' | 'save' | 'submit' | 'like' | 'favorite', metadata: Record<string, any> = {}) {
    const eventTypeMap: Record<string, EventType> = {
      'edit': 'prompt_edit',
      'save': 'prompt_save',
      'submit': 'prompt_submit',
      'like': 'prompt_like',
      'favorite': 'prompt_favorite'
    };

    const eventType = eventTypeMap[type];

    await this.trackEvent({
      event_type: eventType,
      metadata: {
        interaction_type: type,
        ...metadata
      }
    });

    // Also track in prompt_interactions table for detailed analysis
    if (this.userId) {
      try {
        await supabase
          .from('prompt_interactions')
          .insert({
            user_id: this.userId,
            session_id: this.sessionId,
            prompt_id: metadata.prompt_id || null,
            interaction_type: type,
            model_used: metadata.model_used as ModelType || null,
            original_prompt_length: metadata.original_prompt_length || null,
            enhanced_prompt_length: metadata.enhanced_prompt_length || null,
            enhancement_time_seconds: metadata.enhancement_time_seconds || null,
            metadata: metadata
          });
      } catch (error) {
        console.error('Failed to track prompt interaction:', error);
      }
    }
  }

  async trackModelSelection(model: string) {
    await this.trackEvent({
      event_type: 'model_selection',
      metadata: {
        model_selected: model,
        timestamp: new Date().toISOString()
      }
    });
  }

  async trackToolEngagement(toolName: string, engagementDuration?: number, interactionsCount: number = 1) {
    await this.trackEvent({
      event_type: 'tool_engagement',
      metadata: {
        tool_name: toolName,
        engagement_duration_seconds: engagementDuration,
        interactions_count: interactionsCount
      }
    });

    // Track in tool_engagement table
    try {
      await supabase
        .from('tool_engagement')
        .insert({
          user_id: this.userId,
          session_id: this.sessionId,
          tool_name: toolName,
          engagement_duration_seconds: engagementDuration,
          interactions_count: interactionsCount,
          metadata: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Failed to track tool engagement:', error);
    }
  }

  async trackSignup(planType: PlanType) {
    await this.trackEvent({
      event_type: 'signup',
      metadata: {
        plan_type: planType,
        signup_timestamp: new Date().toISOString()
      }
    });
  }

  async trackUpgrade(fromPlan: string, toPlan: string) {
    await this.trackEvent({
      event_type: 'upgrade',
      metadata: {
        from_plan: fromPlan,
        to_plan: toPlan,
        upgrade_timestamp: new Date().toISOString()
      }
    });
  }

  async trackFeedback(feedbackType: string, rating?: number, message?: string) {
    await this.trackEvent({
      event_type: 'feedback_submit',
      metadata: {
        feedback_type: feedbackType,
        rating,
        message
      }
    });

    // Track in user_feedback table
    try {
      await supabase
        .from('user_feedback')
        .insert({
          user_id: this.userId,
          session_id: this.sessionId,
          feedback_type: feedbackType,
          rating,
          message,
          page_url: window.location.href,
          metadata: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Failed to track feedback:', error);
    }
  }

  private async trackSession() {
    try {
      await supabase
        .from('user_sessions')
        .upsert({
          session_id: this.sessionId,
          user_id: this.userId,
          start_time: this.sessionStartTime.toISOString(),
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          page_views: 1
        });
    } catch (error) {
      console.error('Failed to track session:', error);
    }
  }

  private async updatePageViews() {
    try {
      const { data: session } = await supabase
        .from('user_sessions')
        .select('page_views')
        .eq('session_id', this.sessionId)
        .single();

      if (session) {
        await supabase
          .from('user_sessions')
          .update({ page_views: (session.page_views || 0) + 1 })
          .eq('session_id', this.sessionId);
      }
    } catch (error) {
      console.error('Failed to update page views:', error);
    }
  }

  private async updateSessionDuration() {
    const duration = Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
    
    try {
      await supabase
        .from('user_sessions')
        .update({ duration_seconds: duration })
        .eq('session_id', this.sessionId);
    } catch (error) {
      console.error('Failed to update session duration:', error);
    }
  }

  private async trackSessionEnd() {
    const duration = Math.floor((new Date().getTime() - this.sessionStartTime.getTime()) / 1000);
    
    try {
      await supabase
        .from('user_sessions')
        .update({
          end_time: new Date().toISOString(),
          duration_seconds: duration
        })
        .eq('session_id', this.sessionId);

      await this.trackEvent({
        event_type: 'session_end',
        metadata: {
          session_duration_seconds: duration
        }
      });
    } catch (error) {
      console.error('Failed to track session end:', error);
    }
  }

  // Update user ID when user logs in/out
  setUserId(userId: string | null) {
    this.userId = userId;
  }
}

// Create a singleton instance
export const analytics = new AnalyticsService();
