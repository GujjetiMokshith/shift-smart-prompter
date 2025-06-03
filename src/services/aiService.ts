import { Groq } from 'groq-sdk';
import { analytics } from './analytics';

export interface EnhancePromptOptions {
  customSystemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  targetService?: string;
}

export class AIService {
  private groq: Groq;
  private retryAttempts = 3;
  private retryDelay = 1000;
  private fallbackModels = ['llama-3.3-70b-versatile', 'llama3-70b-8192']; // Fallback models

  constructor() {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required');
    }

    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  // Helper to fetch available models dynamically
  private async getAvailableModels(): Promise<string[]> {
    try {
      const response = await this.groq.models.list();
      return response.data.map((model: any) => model.id);
    } catch (error) {
      console.error('Error fetching available models:', error);
      return this.fallbackModels; // Return fallback models on error
    }
  }

  public async enhancePrompt(
    prompt: string,
    targetService: string,
    options: EnhancePromptOptions = {}
  ): Promise<string> {
    const startTime = Date.now();
    let lastError: Error | null = null;
    let currentModel = 'llama-3.3-70b-versatile';
    const availableModels = await this.getAvailableModels();

    // Validate model
    if (!availableModels.includes(currentModel)) {
      console.warn(`Model ${currentModel} not available. Falling back to ${this.fallbackModels[0]}`);
      currentModel = this.fallbackModels.find(model => availableModels.includes(model)) || this.fallbackModels[0];
    }

    const systemPrompt = options.customSystemPrompt || this.getSystemPrompt(targetService);

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Enhancing prompt for ${targetService} with model ${currentModel}`);

        const completion = await this.groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          model: currentModel,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4000,
          stream: false,
        });

        const result = completion.choices[0]?.message?.content;
        if (!result) {
          throw new Error('No content in response');
        }

        // Track analytics
        analytics.trackPromptEnhancement({
          originalPrompt: prompt,
          enhancedPrompt: result,
          modelUsed: currentModel,
          enhancementTimeMs: Date.now() - startTime,
        });

        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Error enhancing prompt (Attempt ${attempt}):`, error);

        // Handle model deprecation specifically
        if (error.message.includes('model_decommissioned') && attempt === 1) {
          console.warn(`Model ${currentModel} is decommissioned. Trying fallback model.`);
          const nextModel = this.fallbackModels.find(model => model !== currentModel && availableModels.includes(model));
          if (nextModel) {
            currentModel = nextModel;
            continue;
          }
        }

        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1)));
          continue;
        }
      }
    }

    throw new Error(
      `Failed to enhance prompt after ${this.retryAttempts} attempts. Last error: ${lastError?.message}. ` +
      `Please check https://console.groq.com/docs/deprecations for supported models.`
    );
  }

  private getSystemPrompt(targetService: string): string {
    const validServices = ['openai', 'anthropic', 'general'];
    const service = validServices.includes(targetService) ? targetService : 'general';

    const basePrompt = `You are an expert prompt engineer specializing in transforming basic prompts into highly detailed, effective instructions optimized for ${service}.

Your task is to enhance and rewrite the user's prompt to be more specific, detailed, and effective. Focus on:

1. Adding specific details, parameters, and constraints
2. Expanding vague concepts with concrete specifications
3. Including clear structure with sections or bullet points where appropriate
4. Specifying technical requirements and deliverables
5. Defining audience, purpose, and scope
6. Adding relevant context and examples

Make the prompt 3-5× more detailed while maintaining compatibility with ${service}'s capabilities and best practices.