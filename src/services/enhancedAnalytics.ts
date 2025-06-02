
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
      const sessionId = sessionTracker.getSessionId();
      
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

    } catch (error) {
      console.error('Error tracking prompt enhancement:', error);
    }
  }

  // Track user engagement with tools
  async trackToolEngagement(toolName: string, durationSeconds: number, interactionCount: number = 1) {
    try {
      const sessionId = sessionTracker.getSessionId();

      const { error } = await supabase
        .from('tool_engagement')
        .insert({
          session_id: sessionId || 'unknown',
          user_id: null,
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
      const sessionId = sessionTracker.getSessionId();

      const { error } = await supabase
        .from('user_feedback')
        .insert({
          session_id: sessionId || null,
          user_id: null,
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
    await sessionTracker.trackEvent('milestone', {
      milestone_name: milestone,
      ...metadata
    });
  }
}

// Export singleton instance
export const enhancedAnalytics = EnhancedAnalytics.getInstance();
