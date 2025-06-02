
import { useState } from 'react';
import { toast } from 'sonner';
import Groq from 'groq-sdk';
import { Message } from '@/components/ChatMessage';

export const usePromptEnhancement = () => {
  const [loading, setLoading] = useState(false);
  
  // Initialize Groq client
  const groq = new Groq({ 
    apiKey: "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",
    dangerouslyAllowBrowser: true 
  });

  // Available Groq models
  const availableModels = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile", 
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
  ];

  const generateEnhancedPrompt = async (
    prompt: string, 
    model: string, 
    isCustomPrompt: boolean = false, 
    customSystemPrompt: string = ""
  ): Promise<string> => {
    const systemPrompt = isCustomPrompt && customSystemPrompt 
      ? customSystemPrompt 
      : `You are an expert prompt engineer specializing in transforming vague or basic prompts into highly detailed effective instructions.

IMPORTANT: Your task is to completely rewrite and significantly enhance the user's prompt. DO NOT return a template or generic structure. DO NOT include any meta-commentary about the enhancement process.

When enhancing a prompt, you MUST:

1. Add specific details, parameters, and constraints that were not in the original  
2. Expand any vague concepts with concrete specifications  
3. Add structure with clear sections, numbered points, or bullet lists where appropriate  
4. Include technical specifications, formats, and deliverables  
5. Specify audience, purpose, and scope where relevant  
6. For technical prompts, add implementation details, technologies, and best practices  

Your enhanced prompt should be 3–5× more detailed than the original. Return ONLY the enhanced prompt with no explanations or meta-commentary.`;

    let currentModelIndex = 0;
    const models = availableModels.includes(model) ? [model, ...availableModels.filter(m => m !== model)] : availableModels;

    while (currentModelIndex < models.length) {
      const currentModel = models[currentModelIndex];
      console.log(`Trying model: ${currentModel}`);

      let retryCount = 0;
      while (retryCount < 3) {
        try {
          console.log(`Attempt ${retryCount + 1} with model: ${currentModel}`);
          
          const completion = await groq.chat.completions.create({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt }
            ],
            model: currentModel,
            temperature: 0.7,
            max_tokens: 4000,
            stream: false
          });

          const result = completion.choices[0]?.message?.content;
          if (result) {
            console.log(`✅ Success with model: ${currentModel}`);
            return result;
          } else {
            throw new Error('No content in response');
          }
        } catch (error: any) {
          console.error(`❌ Error with ${currentModel}:`, error);
          
          if (error.error?.type === 'rate_limit_exceeded') {
            console.log(`⏳ Rate limit hit for ${currentModel}`);
            retryCount++;
            if (retryCount < 3) {
              const waitTime = 2;
              console.log(`Waiting ${waitTime} seconds...`);
              await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
              continue;
            }
          }
          break;
        }
      }
      
      console.log(`Switching from ${currentModel} to next model...`);
      currentModelIndex++;
    }

    throw new Error('All models failed to generate response');
  };

  const enhancePrompt = async (
    inputText: string,
    selectedModel: string,
    isCustomPrompt: boolean,
    customSystemPrompt: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setCurrentEnhancedPrompt: React.Dispatch<React.SetStateAction<string>>,
    savePromptToDatabase: (original: string, enhanced: string, model: string) => Promise<void>
  ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };
    
    setMessages([userMessage]);
    setLoading(true);
    
    try {
      console.log('Starting prompt enhancement with model:', selectedModel);
      const enhancedPrompt = await generateEnhancedPrompt(inputText, selectedModel, isCustomPrompt, customSystemPrompt);
      
      const enhancedMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: enhancedPrompt,
        isEnhanced: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, enhancedMessage]);
      setCurrentEnhancedPrompt(enhancedPrompt);
      
      // Save to database if user is authenticated
      await savePromptToDatabase(inputText, enhancedPrompt, selectedModel);
      
      toast.success("Prompt enhanced successfully!");
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I couldn't enhance your prompt. Please try again later.",
        isEnhanced: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const expandPrompt = async (
    currentEnhancedPrompt: string,
    selectedModel: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setCurrentEnhancedPrompt: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!currentEnhancedPrompt) return;
    
    setLoading(true);
    try {
      const expandedPrompt = await generateEnhancedPrompt(
        `Expand this prompt to be even more detailed and comprehensive: ${currentEnhancedPrompt}`,
        selectedModel
      );
      
      const expandedMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: expandedPrompt,
        isEnhanced: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, expandedMessage]);
      setCurrentEnhancedPrompt(expandedPrompt);
      toast.success("Prompt expanded successfully!");
    } catch (error) {
      toast.error("Failed to expand prompt");
    } finally {
      setLoading(false);
    }
  };

  const condensePrompt = async (
    currentEnhancedPrompt: string,
    selectedModel: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setCurrentEnhancedPrompt: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!currentEnhancedPrompt) return;
    
    setLoading(true);
    try {
      const condensedPrompt = await generateEnhancedPrompt(
        `Make this prompt more concise while keeping all essential details: ${currentEnhancedPrompt}`,
        selectedModel
      );
      
      const condensedMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: condensedPrompt,
        isEnhanced: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, condensedMessage]);
      setCurrentEnhancedPrompt(condensedPrompt);
      toast.success("Prompt condensed successfully!");
    } catch (error) {
      toast.error("Failed to condense prompt");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    enhancePrompt,
    expandPrompt,
    condensePrompt
  };
};
