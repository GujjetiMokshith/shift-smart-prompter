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
      
      // Track analytics (local logging only)
      analytics.trackPromptEnhancement({
        originalPrompt: data.originalPrompt,
        enhancedPrompt: data.enhancedPrompt,
        modelUsed: data.modelUsed,
        enhancementTimeMs: Date.now() - startTime
      });

      console.log('Prompt tracked locally:', {
        originalLength: data.originalPrompt.length,
        enhancedLength: data.enhancedPrompt.length,
        modelUsed: data.modelUsed
      });
    } catch (error) {
      console.error('Error tracking prompt:', error);
      // Don't throw error for analytics failures
    }
  }
}