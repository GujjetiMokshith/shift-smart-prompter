
import { supabase } from "@/integrations/supabase/client";

export interface SavePromptData {
  originalPrompt: string;
  enhancedPrompt: string;
  modelUsed: string;
}

export class PromptService {
  static async savePrompt(data: SavePromptData): Promise<void> {
    try {
      const { error } = await supabase
        .from('enhanced_prompts')
        .insert({
          user_id: null,
          original_prompt: data.originalPrompt,
          enhanced_prompt: data.enhancedPrompt,
          model_used: data.modelUsed
        })
        .select()
        .single();

      if (error) throw error;
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  }
}
