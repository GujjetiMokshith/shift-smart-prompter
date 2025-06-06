import { Groq } from 'groq-sdk';
import { analytics } from './analytics';

interface EnhanceOptions {
  customSystemPrompt?: string;
  operation?: 'enhance' | 'expand' | 'condense';
}

export class SimpleAiService {
  private groq: Groq | null = null;
  private apiKey: string;
  private isInitialized = false;
  
  // Fallback models in order of preference
  private fallbackModels = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile", 
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768"
  ];

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.initializeService();
  }

  private initializeService() {
    try {
      if (!this.apiKey) {
        console.error('❌ GROQ API key not found');
        return;
      }

      this.groq = new Groq({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true
      });
      
      this.isInitialized = true;
      
    } catch (error) {
      
      this.isInitialized = false;
    }
  }

  async enhancePrompt(prompt: string, targetService: string, options: EnhanceOptions = {}): Promise<string> {
    if (!this.isInitialized || !this.groq) {
      throw new Error('AI service not properly initialized. Please check your API key.');
    }

    if (!prompt?.trim()) {
      throw new Error('Please provide a valid prompt to enhance.');
    }

    const systemPrompt = this.getSystemPrompt(targetService, options.operation);
    const startTime = Date.now();

    // Try each model until one works
    for (const model of this.fallbackModels) {
      try {
        
        
        const completion = await this.makeRequest(model, systemPrompt, prompt);
        const result = completion.choices[0]?.message?.content;
        
        if (!result) {
          console.warn(`⚠️ Empty response from ${model}, trying next model`);
          continue;
        }

        // Track successful enhancement
        analytics.trackPromptEnhancement({
          originalPrompt: prompt,
          enhancedPrompt: result,
          modelUsed: model,
          enhancementTimeMs: Date.now() - startTime
        });

        
        return result;
        
      } catch (error: any) {
        console.warn(`⚠️ Model ${model} failed:`, error.message);
        
        // If it's a network error, stop trying other models
        if (this.isNetworkError(error)) {
          throw new Error('Network connection failed. Please check your internet connection and try again.');
        }
        
        // Continue to next model for other errors
        continue;
      }
    }

    throw new Error('All AI models are currently unavailable. Please try again in a few moments.');
  }

  private async makeRequest(model: string, systemPrompt: string, userPrompt: string) {
    return new Promise<any>((resolve, reject) => {
      // Set a timeout for the request
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout - please try again'));
      }, 30000); // 30 second timeout

      this.groq!.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: model,
        temperature: 0.7,
        max_tokens: 4000,
        stream: false
      }).then((result) => {
        clearTimeout(timeout);
        resolve(result);
      }).catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  private isNetworkError(error: any): boolean {
    const errorMessage = error.message?.toLowerCase() || '';
    return errorMessage.includes('failed to fetch') || 
           errorMessage.includes('network') ||
           errorMessage.includes('timeout') ||
           errorMessage.includes('connection');
  }

  private getSystemPrompt(targetService: string, operation?: string): string {
    const basePrompts = {
      enhance: `You are an expert prompt engineer. Transform the user's basic prompt into a detailed, specific, and effective instruction optimized for ${targetService}.

Make the prompt 3-4x more detailed by adding:
• Specific requirements and constraints
• Clear structure and formatting
• Technical specifications where relevant
• Expected output format
• Context and examples

Return ONLY the enhanced prompt, no explanations.`,

      expand: `You are a prompt expansion specialist. Take the user's prompt and significantly expand it with much more detail, specificity, and comprehensive requirements.

Add extensive details including:
• Detailed step-by-step requirements
• Multiple examples and use cases
• Technical specifications and constraints
• Output format and structure requirements
• Context, background, and reasoning

Make it 4-6x more comprehensive. Return ONLY the expanded prompt.`,

      condense: `You are a prompt optimization expert. Take the user's detailed prompt and condense it into a clear, concise, but still complete instruction.

Keep all essential information while:
• Removing redundancy and verbosity
• Maintaining key requirements and constraints
• Preserving important context
• Keeping it actionable and specific

Return ONLY the condensed prompt, no explanations.`
    };

    return basePrompts[operation as keyof typeof basePrompts] || basePrompts.enhance;
  }

  // Simple health check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isInitialized) return false;
      
      // Try a simple request
      await this.enhancePrompt("test", "general");
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const aiService = new SimpleAiService();