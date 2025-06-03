import { Groq } from 'groq-sdk';
import { analytics } from './analytics';

export interface EnhancePromptOptions {
  customSystemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  targetService?: string;
}

export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class AIService {
  private groq: Groq;
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor() {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new AIServiceError(
        'GROQ API key is missing from environment variables',
        'CONFIG_ERROR'
      );
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
    if (!prompt?.trim()) {
      throw new AIServiceError(
        'Prompt cannot be empty',
        'INVALID_INPUT'
      );
    }

    const startTime = Date.now();
    let lastError: Error | null = null;
    let attemptDelay = this.retryDelay;

    const systemPrompt = options.customSystemPrompt || this.getSystemPrompt(targetService);

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Enhancing prompt for ${targetService}`);

        const completion = await this.groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4000,
          stream: false
        }).catch(error => {
          // Handle specific API errors
          if (error.response?.status === 401) {
            throw new AIServiceError(
              'Invalid API key or authentication failed',
              'AUTH_ERROR'
            );
          }
          if (error.response?.status === 429) {
            throw new AIServiceError(
              'Rate limit exceeded. Please try again later',
              'RATE_LIMIT'
            );
          }
          if (error.response?.status >= 500) {
            throw new AIServiceError(
              'AI service is temporarily unavailable',
              'SERVICE_ERROR'
            );
          }
          throw error;
        });

        const result = completion.choices[0]?.message?.content;
        if (!result) {
          throw new AIServiceError(
            'AI service returned empty response',
            'EMPTY_RESPONSE'
          );
        }

        // Validate response length
        if (result.length < prompt.length) {
          throw new AIServiceError(
            'Enhanced prompt is shorter than original',
            'INVALID_RESPONSE',
            { originalLength: prompt.length, enhancedLength: result.length }
          );
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
        console.error(`❌ Error enhancing prompt (Attempt ${attempt}):`, {
          error,
          prompt,
          targetService
        });

        // Don't retry on certain errors
        if (error instanceof AIServiceError && 
            ['AUTH_ERROR', 'INVALID_INPUT'].includes(error.code)) {
          throw error;
        }

        if (attempt < this.retryAttempts) {
          // Exponential backoff with jitter
          const jitter = Math.random() * 200;
          await new Promise(resolve => 
            setTimeout(resolve, attemptDelay + jitter)
          );
          attemptDelay *= 2; // Double the delay for next attempt
          continue;
        }
      }
    }

    // If we've exhausted all retries, throw a detailed error
    const finalError = new AIServiceError(
      this.getFriendlyErrorMessage(lastError),
      'ENHANCEMENT_FAILED',
      {
        originalError: lastError,
        attempts: this.retryAttempts,
        prompt: prompt.slice(0, 100) + '...' // Include truncated prompt for context
      }
    );

    throw finalError;
  }

  private getFriendlyErrorMessage(error: Error | null): string {
    if (error instanceof AIServiceError) {
      switch (error.code) {
        case 'AUTH_ERROR':
          return 'Failed to authenticate with the AI service. Please check your API key.';
        case 'RATE_LIMIT':
          return 'Too many requests. Please wait a moment and try again.';
        case 'SERVICE_ERROR':
          return 'The AI service is temporarily unavailable. Please try again later.';
        case 'INVALID_INPUT':
          return 'Please provide a valid prompt to enhance.';
        case 'EMPTY_RESPONSE':
          return 'The AI service failed to generate an enhanced prompt. Please try again.';
        case 'INVALID_RESPONSE':
          return 'The enhanced prompt did not meet quality standards. Please try again.';
      }
    }

    if (error?.message?.includes('network')) {
      return 'Network error. Please check your internet connection and try again.';
    }

    if (error?.message?.includes('timeout')) {
      return 'The request timed out. Please try again.';
    }

    return 'An unexpected error occurred while enhancing your prompt. Please try again.';
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