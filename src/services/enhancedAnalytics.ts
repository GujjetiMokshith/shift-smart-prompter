
import { supabase } from '@/integrations/supabase/client';
import { sessionTracker } from './sessionTracker';

export class EnhancedAnalytics {
  private static instance: EnhancedAnalytics;
  
  public static getInstance(): EnhancedAnalytics {
    if (!EnhancedAnalytics.instance) {
      EnhancedAnalytics.instance = new EnhancedAnalytics();
    }
    return EnhancedAnalytics.instance;
  }

  // Track prompt enhancement with detailed metrics
  async trackPromptEnhancement(data: {
    originalPrompt: string;
    enhancedPrompt: string;
    modelUsed: string;
    enhancementTimeMs: number;
    userId?: string;
  }) {
    try {
      const sessionData = sessionTracker.getSessionData();
      
      // Store enhanced prompt
      const { error: promptError } = await supabase
        .from('enhanced_prompts')
        .insert({
          user_id: data.userId || null,
          original_prompt: data.originalPrompt,
          enhanced_prompt: data.enhancedPrompt,
          model_used: data.modelUsed
        });

      if (promptError) {
        console.error('Error storing enhanced prompt:', promptError);
      }

      // Track interaction
      await sessionTracker.trackEvent('enhancement_interaction', {
        model_used: data.modelUsed,
        original_length: data.originalPrompt.length,
        enhanced_length: data.enhancedPrompt.length,
        enhancement_time_ms: data.enhancementTimeMs,
        improvement_ratio: data.enhancedPrompt.length / data.originalPrompt.length
      });

      // Update user prompt usage if user is logged in
      if (data.userId) {
        // Use a simple update instead of raw SQL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            prompts_used: 1, // This will be handled by a database function
            updated_at: new Date().toISOString()
          })
          .eq('id', data.userId);

        if (updateError) {
          console.error('Error updating user prompt count:', updateError);
        }
      }

    } catch (error) {
      console.error('Error tracking prompt enhancement:', error);
    }
  }

  // Track user engagement with tools
  async trackToolEngagement(toolName: string, durationSeconds: number, interactionCount: number = 1) {
    try {
      const sessionData = sessionTracker.getSessionData();
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('tool_engagement')
        .insert({
          session_id: sessionData?.sessionId || 'unknown',
          user_id: user?.id || null,
          tool_name: toolName,
          engagement_duration_seconds: durationSeconds,
          interactions_count: interactionCount,
          metadata: {
            timestamp: new Date().toISOString(),
            page_url: window.location.href
          }
        });

      if (error) {
        console.error('Error tracking tool engagement:', error);
      }
    } catch (error) {
      console.error('Error in trackToolEngagement:', error);
    }
  }

  // Track user feedback
  async trackUserFeedback(feedbackType: string, rating?: number, message?: string) {
    try {
      const sessionData = sessionTracker.getSessionData();
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('user_feedback')
        .insert({
          session_id: sessionData?.sessionId || null,
          user_id: user?.id || null,
          feedback_type: feedbackType,
          rating: rating || null,
          message: message || null,
          page_url: window.location.href,
          metadata: {
            timestamp: new Date().toISOString(),
            session_duration: sessionTracker.getSessionDuration()
          }
        });

      if (error) {
        console.error('Error tracking user feedback:', error);
      }
    } catch (error) {
      console.error('Error in trackUserFeedback:', error);
    }
  }

  // Track model selection preferences
  async trackModelSelection(modelType: string, context?: string) {
    await sessionTracker.trackEvent('model_selection', {
      model_type: modelType,
      context: context || 'user_selection',
      timestamp: new Date().toISOString()
    });
  }

  // Track user journey milestones
  async trackMilestone(milestone: string, metadata?: Record<string, any>) {
    await sessionTracker.trackEvent('signup', {
      milestone_name: milestone,
      session_duration: sessionTracker.getSessionDuration(),
      ...metadata
    });
  }

  // Get user analytics summary
  async getUserAnalytics(userId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [promptsResult, sessionsResult, feedbackResult] = await Promise.all([
        supabase
          .from('enhanced_prompts')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', startDate.toISOString()),
        
        supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', userId)
          .gte('start_time', startDate.toISOString()),
        
        supabase
          .from('user_feedback')
          .select('*')
          .eq('user_id', userId)
          .gte('created_at', startDate.toISOString())
      ]);

      return {
        prompts: promptsResult.data || [],
        sessions: sessionsResult.data || [],
        feedback: feedbackResult.data || [],
        period_days: days
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }
}

// Export singleton instance
export const enhancedAnalytics = EnhancedAnalytics.getInstance();
