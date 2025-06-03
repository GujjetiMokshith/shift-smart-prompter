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

  constructor() {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required');
    }

    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  public async enhancePrompt(
    prompt: string,
    targetService: string,
    options: EnhancePromptOptions = {}
  ): Promise<string> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    const systemPrompt = options.customSystemPrompt || this.getSystemPrompt(targetService);

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Enhancing prompt for ${targetService}`);

        const completion = await this.groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          model: "mixtral-8x7b-32768",
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4000,
          stream: false
        });

        const result = completion.choices[0]?.message?.content;
        if (!result) {
          throw new Error('No content in response');
        }

        // Track analytics
        analytics.trackPromptEnhancement({
          originalPrompt: prompt,
          enhancedPrompt: result,
          modelUsed: targetService,
          enhancementTimeMs: Date.now() - startTime
        });

        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Error enhancing prompt (Attempt ${attempt}):`, error);

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

  private getSystemPrompt(targetService: string): string {
    const basePrompt = `You are an expert prompt engineer specializing in transforming basic prompts into highly detailed, effective instructions optimized for ${targetService}.

Your task is to enhance and rewrite the user's prompt to be more specific, detailed, and effective. Focus on:

1. Adding specific details, parameters, and constraints
2. Expanding vague concepts with concrete specifications
3. Including clear structure with sections or bullet points where appropriate
4. Specifying technical requirements and deliverables
5. Defining audience, purpose, and scope
6. Adding relevant context and examples

Make the prompt 3-5× more detailed while maintaining compatibility with ${targetService}'s capabilities and best practices.

Return ONLY the enhanced prompt with no explanations or meta-commentary.`;

    const serviceSpecificInstructions = {
      openai: "Ensure the prompt follows OpenAI's best practices and includes clear stop sequences, temperature recommendations, and token count considerations.",
      anthropic: "Format the prompt to work well with Anthropic's Constitutional AI principles, including clear ethical boundaries and specific task constraints.",
      general: "Create a universally compatible prompt that works well across different AI services while maintaining clarity and effectiveness."
    };

    return `${basePrompt}\n\nAdditional Instructions:\n${serviceSpecificInstructions[targetService as keyof typeof serviceSpecificInstructions] || serviceSpecificInstructions.general}`;
  }
}

// Export singleton instance
export const aiService = new AIService();