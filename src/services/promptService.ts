import { supabase } from "@/integrations/supabase/client";
import { analytics } from "./analytics";

export interface SavePromptData {
  originalPrompt: string;
  enhancedPrompt: string;
  modelUsed: string;
}

export class PromptService {
  static async savePrompt(data: SavePromptData): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save prompt
      const { error } = await supabase
        .from('enhanced_prompts')
        .insert({
          user_id: user?.id || null,
          original_prompt: data.originalPrompt,
          enhanced_prompt: data.enhancedPrompt,
          model_used: data.modelUsed
        })
        .select()
        .single();

      if (error) throw error;

      // Track analytics
      analytics.trackPromptEnhancement({
        originalPrompt: data.originalPrompt,
        enhancedPrompt: data.enhancedPrompt,
        modelUsed: data.modelUsed,
        enhancementTimeMs: Date.now() - startTime
      });

      // Increment user's prompt count if logged in
      if (user) {
        await supabase.rpc('increment_user_prompts', { user_id: user.id });
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      throw error;
    }
  }
}