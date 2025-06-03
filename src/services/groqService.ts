import Groq from "groq-sdk";

// Using environment variable for API key
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "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";

export class GroqService {
  private groq: Groq;
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.groq = new Groq({ 
      apiKey: GROQ_API_KEY,
      dangerouslyAllowBrowser: true 
    });
  }

  async enhancePrompt(prompt: string, model: string, customSystemPrompt?: string): Promise<string> {
    const systemPrompt = customSystemPrompt || `You are an expert prompt engineer specializing in transforming vague or basic prompts into highly detailed effective instructions.

IMPORTANT: Your task is to completely rewrite and significantly enhance the user's prompt. DO NOT return a template or generic structure. DO NOT include any meta-commentary about the enhancement process.

When enhancing a prompt, you MUST:

1. Add specific details, parameters, and constraints that were not in the original  
2. Expand any vague concepts with concrete specifications  
3. Add structure with clear sections, numbered points, or bullet lists where appropriate  
4. Include technical specifications, formats, and deliverables  
5. Specify audience, purpose, and scope where relevant  
6. For technical prompts, add implementation details, technologies, and best practices  

Example transformations:  
- Write about dogs → Create a comprehensive 1500-word guide about selecting the right dog breed for families with small children. Include sections on: temperament considerations, space requirements, exercise needs, grooming demands, and health screening. Provide specific examples of 5 family-friendly breeds with their pros and cons.  

- Make a to-do app → Develop a responsive to-do list web application using React and TypeScript with the following features: task categorization with color coding, priority levels (high/medium/low), due dates with reminder notifications, recurring task support, drag-and-drop reordering, data persistence using localStorage, and a clean minimalist UI with dark/light mode toggle. Include proper error handling and accessibility features.

Your enhanced prompt should be 3–5× more detailed than the original. Return ONLY the enhanced prompt with no explanations or meta-commentary.`;

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Trying model ${model}`);
        
        const completion = await this.groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          model: model,
          temperature: 0.7,
          max_tokens: 4000,
          stream: false
        });

        const result = completion.choices[0]?.message?.content;
        if (result) {
          console.log(`✅ Success with model: ${model}`);
          return result;
        } else {
          throw new Error('No content in response');
        }
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Error with ${model} (Attempt ${attempt}):`, error);
        
        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
          continue;
        }
      }
    }

    throw new Error(`Failed to enhance prompt after ${this.retryAttempts} attempts. Last error: ${lastError?.message}`);
  }

  getAvailableModels(): string[] {
    return [
      "llama-3.3-70b-versatile",
      "llama-3.1-70b-versatile", 
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "gemma2-9b-it"
    ];
  }
}