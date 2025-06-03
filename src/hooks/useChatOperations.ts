
import { useState } from 'react';
import { toast } from 'sonner';
import { GroqService } from '@/services/groqService';
import { PromptService } from '@/services/promptService';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

interface UseChatOperationsProps {
  chat: Chat;
  onAddMessage: (message: { type: 'user' | 'assistant'; content: string }) => void;
  onUpdateTitle: (chatId: string, newTitle: string) => void;
}

export const useChatOperations = ({ chat, onAddMessage, onUpdateTitle }: UseChatOperationsProps) => {
  const [loading, setLoading] = useState(false);
  const [currentEnhancedPrompt, setCurrentEnhancedPrompt] = useState("");
  const groqService = new GroqService();

  const enhancePrompt = async (
    inputText: string, 
    selectedModel: string, 
    isCustomPrompt: boolean, 
    customSystemPrompt: string
  ) => {
    // Add user message
    onAddMessage({
      type: "user",
      content: inputText
    });
    
    setLoading(true);
    
    try {
      console.log('Starting prompt enhancement with model:', selectedModel);
      const enhancedPrompt = await groqService.enhancePrompt(
        inputText, 
        selectedModel, 
        isCustomPrompt ? customSystemPrompt : undefined
      );
      
      // Add AI response
      onAddMessage({
        type: "assistant",
        content: enhancedPrompt
      });
      
      setCurrentEnhancedPrompt(enhancedPrompt);
      
      // Update chat title if it's the first message
      if (chat.messages.length === 0) {
        const newTitle = inputText.slice(0, 30) + (inputText.length > 30 ? '...' : '');
        onUpdateTitle(chat.id, newTitle);
      }
      
      // Save to database
      await PromptService.savePrompt({
        originalPrompt: inputText,
        enhancedPrompt: enhancedPrompt,
        modelUsed: selectedModel
      });
      
      toast.success("Prompt enhanced successfully!");
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
      
      onAddMessage({
        type: "assistant",
        content: "Sorry, I couldn't enhance your prompt. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const expandPrompt = async (selectedModel: string) => {
    if (!currentEnhancedPrompt) return;
    
    setLoading(true);
    try {
      const expandedPrompt = await groqService.enhancePrompt(
        `Expand this prompt to be even more detailed and comprehensive: ${currentEnhancedPrompt}`,
        selectedModel
      );
      
      onAddMessage({
        type: "assistant",
        content: expandedPrompt
      });
      
      setCurrentEnhancedPrompt(expandedPrompt);
      toast.success("Prompt expanded successfully!");
    } catch (error) {
      toast.error("Failed to expand prompt");
    } finally {
      setLoading(false);
    }
  };

  const condensePrompt = async (selectedModel: string) => {
    if (!currentEnhancedPrompt) return;
    
    setLoading(true);
    try {
      const condensedPrompt = await groqService.enhancePrompt(
        `Make this prompt more concise while keeping all essential details: ${currentEnhancedPrompt}`,
        selectedModel
      );
      
      onAddMessage({
        type: "assistant",
        content: condensedPrompt
      });
      
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
    currentEnhancedPrompt,
    enhancePrompt,
    expandPrompt,
    condensePrompt
  };
};
