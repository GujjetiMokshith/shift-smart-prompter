
import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { Message, MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  className?: string;
}

// Sample responses for different models
const modelResponses: Record<string, (prompt: string) => string> = {
  "llama-4": (prompt: string) => {
    // Make more specific and detailed
    return `${prompt.trim()}\n\nTo make this more effective for Llama 4, I've enhanced your prompt with specific details, context, and clear expectations:

"${prompt.trim()}, providing detailed analysis with step-by-step reasoning. Consider multiple perspectives and cite specific examples or evidence. Break down complex concepts into clear explanations, and ensure your response has logical flow with clear section headings where appropriate. Prioritize accuracy over length and conclude with a summary of key points."`;
  },
  "claude": (prompt: string) => {
    // Make more conversational and add examples
    return `I've optimized your prompt for Claude's conversational style:

"${prompt.trim()} 

Please approach this thoughtfully, considering various angles. Feel free to think step-by-step, and provide examples to illustrate your points. If relevant, consider both advantages and disadvantages. Make your explanation accessible to someone without specialized knowledge in this area."`;
  },
  "chatgpt": (prompt: string) => {
    // Add structure and formatting instructions
    return `Enhanced for ChatGPT:

"${prompt.trim()}

Please structure your response with:
1. A brief introduction to the topic
2. Main analysis with 3-4 key points
3. Practical applications or examples
4. A concise conclusion

Use markdown formatting where appropriate with headers, bullet points, and occasional bold text for emphasis."`;
  },
  "mistral": (prompt: string) => {
    // Technical and concise
    return `Optimized for Mistral's technical capabilities:

"I need a technically precise response to: ${prompt.trim()}

Prioritize factual accuracy and technical depth. Include relevant technical terminology where appropriate. Focus on providing a comprehensive but concise analysis with logical structure. If calculations or algorithms are relevant, please include them."`;
  }
};

const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama-4");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const enhancedMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: modelResponses[selectedModel](content),
        isEnhanced: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, enhancedMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-medium">Enhance Your Prompts</h2>
        <div className="flex gap-2">
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="llama-4">Gruq Llama 4</option>
            <option value="claude">Claude</option>
            <option value="chatgpt">ChatGPT</option>
            <option value="mistral">Mistral AI</option>
          </select>
        </div>
      </div>

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
