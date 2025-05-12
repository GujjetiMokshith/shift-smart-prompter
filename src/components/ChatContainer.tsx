
import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { Message, MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";
import ModelSelector from "./ModelSelector";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ModelSelectionModal from "./ModelSelectionModal";
import SettingsModal from "./SettingsModal";

interface ChatContainerProps {
  className?: string;
}

// Fixed Groq API key provided by the app owner
const GROQ_API_KEY = "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";

const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama-4");
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setInputText("");
    setShowModelSelection(true);
  };
  
  const proceedWithModel = async (modelId: string) => {
    setSelectedModel(modelId);
    setShowModelSelection(false);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // Generate enhanced prompt
      const enhancedPrompt = await generateEnhancedPrompts(inputText, modelId, isCustomPrompt ? customSystemPrompt : undefined);
      
      const enhancedMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: enhancedPrompt,
        isEnhanced: true,
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

  const generateEnhancedPrompts = async (
    prompt: string, 
    model: string,
    customPrompt?: string
  ): Promise<string> => {
    // Format system message based on the selected model and custom prompt
    const systemPrompt = customPrompt || `You are an expert prompt engineer for the ${
      model === "llama-4" ? "Llama 4" : 
      model === "claude" ? "Claude" : 
      model === "chatgpt" ? "ChatGPT" : 
      "Mistral AI"} model. 
      Your task is to enhance the user's prompt to get better results from this specific model.
      Generate a significantly enhanced version of the prompt that is detailed, clear, and optimized for this model's strengths.
      Consider the model's capabilities, limitations, and best practices when enhancing.
      Return ONLY the enhanced prompt without any explanations or additional text.
      Make it as detailed and comprehensive as possible - use up to 4000 tokens.`;

    const userPrompt = `Please enhance this prompt for the ${
      model === "llama-4" ? "Llama 4" : 
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
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
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

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const toggleCustomPrompt = (value: boolean) => {
    setIsCustomPrompt(value);
  };

  const updateCustomPrompt = (prompt: string) => {
    setCustomSystemPrompt(prompt);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <h2 className="text-lg font-medium text-gradient-blue">Enhance Your Prompts</h2>
        <ModelSelector 
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      </div>

      <div className="flex-1 overflow-y-auto prompt-chat-scrollbar px-4 min-h-[300px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-blue-700/20 flex items-center justify-center mb-4 glow-blue-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">How can I help you today?</h3>
            <p className="text-sm text-white/70 max-w-md">
              Paste your existing prompt below and I'll enhance it for your selected AI model.
            </p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message}
            />
          ))
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="neo-blur p-8 rounded-2xl flex flex-col items-center">
              <Loader2 className="loading-spinner" />
              <p className="mt-4 text-blue-400 font-medium">Enhancing your prompt...</p>
              <p className="text-xs text-white/50 mt-2">This might take a few seconds</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <ChatInput 
          value={inputText}
          onChange={handleInputChange}
          onSubmit={handleSendMessage}
          disabled={loading}
          placeholder="How can PromptShift help you today?"
        />
      </div>
      
      {/* Model Selection Modal */}
      <ModelSelectionModal 
        isOpen={showModelSelection} 
        onClose={() => setShowModelSelection(false)}
        onSelectModel={proceedWithModel}
        currentModel={selectedModel}
      />
      
      {/* Settings Modal - Added at bottom left */}
      <SettingsModal
        isCustomPrompt={isCustomPrompt}
        customPrompt={customSystemPrompt}
        onToggleCustomPrompt={toggleCustomPrompt}
        onUpdateCustomPrompt={updateCustomPrompt}
      />
    </div>
  );
};

export default ChatContainer;
