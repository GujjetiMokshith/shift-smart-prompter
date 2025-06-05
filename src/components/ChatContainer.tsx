import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { Message, MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";
import ModelSelector from "./ModelSelector";
import ModelSelectionModal from "./ModelSelectionModal";
import ChatActionButtons from "./ChatActionButtons";
import ChatLoadingIndicator from "./ChatLoadingIndicator";
import { useChatOperations } from "@/hooks/useChatOperations";
import { toast } from "sonner";

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

interface ChatContainerProps {
  className?: string;
  chat: Chat;
  onAddMessage: (message: { type: 'user' | 'assistant'; content: string }) => void;
  onUpdateTitle: (chatId: string, newTitle: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  className, 
  chat,
  onAddMessage,
  onUpdateTitle
}) => {
  const [selectedService, setSelectedService] = useState("openai");
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    loading,
    currentEnhancedPrompt,
    enhancePrompt,
    expandPrompt,
    condensePrompt
  } = useChatOperations({ chat, onAddMessage, onUpdateTitle });

  // Convert chat messages to Message format
  const messages: Message[] = chat.messages.map(msg => ({
    id: msg.id,
    type: msg.type as MessageType,
    content: msg.content,
    timestamp: msg.timestamp,
    isEnhanced: msg.type === 'assistant'
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setInputText(content);
    setShowModelSelection(true);
  };
  
  const proceedWithService = async (serviceId: string) => {
    setSelectedService(serviceId);
    setShowModelSelection(false);
    
    try {
      await enhancePrompt(inputText, serviceId, false, "");
      setInputText("");
    } catch (error: any) {
      console.error("Enhancement error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleExpand = async () => {
    try {
      await expandPrompt(selectedService);
    } catch (error: any) {
      toast.error(error.message || "Failed to expand prompt. Please try again.");
    }
  };

  const handleCondense = async () => {
    try {
      await condensePrompt(selectedService);
    } catch (error: any) {
      toast.error(error.message || "Failed to condense prompt. Please try again.");
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4 px-6 pt-6">
        <h2 className="text-xl font-medium text-gradient-blue">
          {chat.title || 'New Chat'}
        </h2>
        <div className="flex items-center gap-3">
          <ModelSelector 
            selectedService={selectedService}
            onSelectService={setSelectedService}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto prompt-chat-scrollbar px-6 min-h-[400px] max-h-[600px]">
        {messages.map(message => (
          <ChatMessage 
            key={message.id} 
            message={message}
          />
        ))}
        
        {currentEnhancedPrompt && !loading && (
          <ChatActionButtons
            onExpand={handleExpand}
            onCondense={handleCondense}
            disabled={loading}
          />
        )}
        
        {loading && <ChatLoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6">
        <ChatInput 
          value={inputText}
          onChange={handleInputChange}
          onSubmit={handleSendMessage}
          disabled={loading}
          placeholder="Type your message here..."
        />
      </div>
      
      <ModelSelectionModal 
        isOpen={showModelSelection} 
        onClose={() => setShowModelSelection(false)}
        onSelectService={proceedWithService}
        currentService={selectedService}
      />
    </div>
  );
};

export default ChatContainer;