
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

const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama-4");
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    return localStorage.getItem("groqApiKey") || "";
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem("groqApiKey"));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (groqApiKey) {
      localStorage.setItem("groqApiKey", groqApiKey);
    }
  }, [groqApiKey]);

  const handleSendMessage = async (content: string) => {
    if (!groqApiKey) {
      setShowApiKeyInput(true);
      toast.error("Please enter your Groq API key first");
      return;
    }
    
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
      const enhancedPrompt = await enhancePrompt(content, selectedModel);
      
      const enhancedMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: enhancedPrompt,
        isEnhanced: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, enhancedMessage]);
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please try again.");
      
      // Show a fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I couldn't enhance your prompt. Please check your API key or try again later.",
        isEnhanced: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const enhancePrompt = async (prompt: string, model: string): Promise<string> => {
    // Format system message based on the selected model
    const systemPrompt = `You are an expert prompt engineer for the ${model === "llama-4" ? "Groq Llama 4" : 
      model === "claude" ? "Claude" : 
      model === "chatgpt" ? "ChatGPT" : 
      "Mistral AI"} model. 
      Your task is to enhance the user's prompt to get better results from this specific model.
      Return only the enhanced prompt without any explanations or additional text.`;

    const userPrompt = `Please enhance this prompt for the ${model === "llama-4" ? "Groq Llama 4" : 
      model === "claude" ? "Claude" : 
      model === "chatgpt" ? "ChatGPT" : 
      "Mistral AI"} model: "${prompt}"`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3-8b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling Groq API:", error);
      throw error;
    }
  };

  const handleSaveApiKey = () => {
    if (groqApiKey) {
      localStorage.setItem("groqApiKey", groqApiKey);
      setShowApiKeyInput(false);
      toast.success("API key saved successfully");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-medium">Enhance Your Prompts</h2>
        <div className="flex gap-2">
          <ModelSelector 
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
      </div>

      {showApiKeyInput ? (
        <div className="p-6 bg-black/30 rounded-lg border border-white/10 mb-4">
          <h3 className="text-lg font-medium mb-2">Enter your Groq API Key</h3>
          <p className="text-sm text-white/70 mb-4">
            To use PromptShift, you need to provide your Groq API key. This will be stored locally in your browser.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white outline-none focus:border-promptshift-accent"
              placeholder="Enter your Groq API key"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-promptshift-primary text-white rounded-lg hover:bg-promptshift-accent transition-colors"
              onClick={handleSaveApiKey}
            >
              Save
            </button>
          </div>
          <p className="text-xs text-white/50 mt-2">
            Don't have a Groq API key? <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-promptshift-accent hover:underline">Get one here</a>.
          </p>
        </div>
      ) : (
        <button 
          className="text-xs text-white/50 hover:text-white mb-2 transition-colors self-end"
          onClick={() => setShowApiKeyInput(true)}
        >
          Change API Key
        </button>
      )}

      <div className="flex-1 overflow-y-auto prompt-chat-scrollbar px-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-promptshift-primary/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-promptshift-primary">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Welcome to PromptShift</h3>
            <p className="text-sm text-white/70 max-w-md">
              Paste your existing prompt below and we'll enhance it for your selected AI model.
            </p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
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

      <div className="mt-4">
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
