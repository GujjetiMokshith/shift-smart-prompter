
import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { Message, MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";
import ModelSelector from "./ModelSelector";
import { toast } from "sonner";

interface ChatContainerProps {
  className?: string;
}

// Model-specific paths to instruction files
const modelInstructions: Record<string, string> = {
  "llama-4": "/src/instructions/llama-4.md",
  "claude": "/src/instructions/claude.md",
  "chatgpt": "/src/instructions/chatgpt.md",
  "mistral": "/src/instructions/mistral.md",
};

// Fixed Groq API key provided by the app owner
const GROQ_API_KEY = "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";

const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama-4");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // Generate multiple enhanced prompts
      const enhancedPrompts = await generateEnhancedPrompts(content, selectedModel);
      
      // Select the first prompt as the main one and keep the rest as options
      const mainPrompt = enhancedPrompts[0];
      const options = enhancedPrompts.slice(1);
      
      const enhancedMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: mainPrompt,
        isEnhanced: true,
        options: options,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, enhancedMessage]);
      toast.success("Prompt enhanced successfully!");
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
      
      // Show a fallback message
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

  const generateEnhancedPrompts = async (prompt: string, model: string): Promise<string[]> => {
    // Format system message based on the selected model
    const systemPrompt = `You are an expert prompt engineer for the ${model === "llama-4" ? "Groq Llama 4" : 
      model === "claude" ? "Claude" : 
      model === "chatgpt" ? "ChatGPT" : 
      "Mistral AI"} model. 
      Your task is to enhance the user's prompt to get better results from this specific model.
      Generate 4 different enhanced versions of the prompt, each with a different approach.
      The variations should be significantly different from each other to give the user multiple options.
      Return ONLY the 4 enhanced prompts separated by the delimiter "|||" without any explanations or additional text.`;

    const userPrompt = `Please enhance this prompt for the ${model === "llama-4" ? "Groq Llama 4" : 
      model === "claude" ? "Claude" : 
      model === "chatgpt" ? "ChatGPT" : 
      "Mistral AI"} model: "${prompt}"`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-2-70b-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Split the content by the delimiter to get multiple prompt options
      const promptOptions = content.split("|||").map(option => option.trim()).filter(Boolean);
      
      // Make sure we have at least one option
      if (promptOptions.length === 0) {
        return [content]; // Return the full content if no delimiters found
      }
      
      return promptOptions.slice(0, 4); // Return up to 4 options
    } catch (error) {
      console.error("Error calling Groq API:", error);
      throw error;
    }
  };

  const handleSelectOption = (option: string) => {
    // Replace the last assistant message with the selected option
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      const lastAssistantIndex = [...newMessages].reverse().findIndex(m => m.type === "assistant");
      
      if (lastAssistantIndex !== -1) {
        const actualIndex = newMessages.length - 1 - lastAssistantIndex;
        newMessages[actualIndex] = {
          ...newMessages[actualIndex],
          content: option,
          options: [] // Remove options once one is selected
        };
      }
      
      return newMessages;
    });
    
    toast.success("Option selected!");
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <h2 className="text-lg font-medium text-promptshift-light-gray">Enhance Your Prompts</h2>
        <div className="flex gap-2">
          <ModelSelector 
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto prompt-chat-scrollbar px-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-promptshift-primary/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-promptshift-accent">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2 bg-gradient-to-r from-promptshift-accent to-promptshift-primary bg-clip-text text-transparent">Welcome to PromptShift</h3>
            <p className="text-sm text-white/70 max-w-md">
              Paste your existing prompt below and we'll enhance it for your selected AI model with multiple options.
            </p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onSelectOption={handleSelectOption}
            />
          ))
        )}
        
        {loading && (
          <div className="flex items-center space-x-2 p-4">
            <div className="w-2 h-2 rounded-full bg-promptshift-accent animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-promptshift-accent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-promptshift-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <ChatInput 
          onSubmit={handleSendMessage}
          disabled={loading}
          placeholder="Paste your prompt here to enhance it..."
        />
      </div>
    </div>
  );
};

export default ChatContainer;
