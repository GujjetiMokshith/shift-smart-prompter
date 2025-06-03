import { Groq } from 'groq-sdk';
import { analytics } from './analytics';

export interface AIModelConfig {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  temperature: number;
  isPrimary?: boolean;
  platform: 'groq' | 'anthropic' | 'openai';
  icon?: string;
}

export interface EnhancePromptOptions {
  customSystemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export class AIService {
  private groq: Groq;
  private retryAttempts = 3;
  private retryDelay = 1000;

  private models: AIModelConfig[] = [
    {
      id: "llama-3.3-70b-versatile",
      name: "Llama 3.3",
      description: "Versatile model optimized for reasoning and understanding",
      maxTokens: 4000,
      temperature: 0.7,
      isPrimary: true,
      platform: 'groq'
    },
    {
      id: "mixtral-8x7b-32768",
      name: "Mixtral 8x7B",
      description: "High-performance model with extended context window",
      maxTokens: 4000,
      temperature: 0.7,
      platform: 'groq'
    },
    {
      id: "claude-3-sonnet",
      name: "Claude 3 Sonnet",
      description: "Anthropic's latest model with enhanced capabilities",
      maxTokens: 4000,
      temperature: 0.7,
      platform: 'anthropic'
    },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      description: "OpenAI's most capable model",
      maxTokens: 4000,
      temperature: 0.7,
      platform: 'openai'
    }
  ];

  constructor() {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required');
    }

    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  public getModels(): AIModelConfig[] {
    return this.models;
  }

  public getModel(modelId: string): AIModelConfig | undefined {
    return this.models.find(model => model.id === modelId);
  }

  public async enhancePrompt(
    prompt: string,
    modelId: string,
    options: EnhancePromptOptions = {}
  ): Promise<string> {
    const model = this.getModel(modelId);
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    const startTime = Date.now();
    let lastError: Error | null = null;

    const systemPrompt = options.customSystemPrompt || this.getDefaultSystemPrompt();

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Enhancing prompt with ${model.name}`);

        let result: string;

        switch (model.platform) {
          case 'groq':
            const completion = await this.groq.chat.completions.create({
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
              ],
              model: model.id,
              temperature: options.temperature ?? model.temperature,
              max_tokens: options.maxTokens ?? model.maxTokens,
              stream: false
            });

            result = completion.choices[0]?.message?.content;
            break;

          case 'anthropic':
            // Placeholder for Anthropic API integration
            throw new Error('Anthropic integration coming soon');

          case 'openai':
            // Placeholder for OpenAI API integration
            throw new Error('OpenAI integration coming soon');

          default:
            throw new Error(`Unsupported platform: ${model.platform}`);
        }

        if (!result) {
          throw new Error('No content in response');
        }

        // Track analytics
        analytics.trackPromptEnhancement({
          originalPrompt: prompt,
          enhancedPrompt: result,
          modelUsed: model.id,
          enhancementTimeMs: Date.now() - startTime
        });

        return result;

      } catch (error: any) {
        lastError = error;
        console.error(`❌ Error with ${model.name} (Attempt ${attempt}):`, error);

        if (attempt < this.retryAttempts) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1))
          );
          continue;
        }
      }
    }

    throw new Error(
      `Failed to enhance prompt after ${this.retryAttempts} attempts. ` +
      `Last error: ${lastError?.message}`
    );
  }

  private getDefaultSystemPrompt(): string {
    return `You are an expert prompt engineer specializing in transforming vague or basic prompts into highly detailed effective instructions.

IMPORTANT: Your task is to completely rewrite and significantly enhance the user's prompt. DO NOT return a template or generic structure. DO NOT include any meta-commentary about the enhancement process.

When enhancing a prompt, you MUST:

1. Add specific details, parameters, and constraints that were not in the original  
2. Expand any vague concepts with concrete specifications  
3. Add structure with clear sections, numbered points, or bullet lists where appropriate  
4. Include technical specifications, formats, and deliverables  
5. Specify audience, purpose, and scope where relevant  
6. For technical prompts, add implementation details, technologies, and best practices  

Your enhanced prompt should be 3–5× more detailed than the original. Return ONLY the enhanced prompt with no explanations or meta-commentary.`;
  }
}

// Export singleton instance
export const aiService = new AIService();