
import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { Message, MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";
import ModelSelector from "./ModelSelector";
import ModelSelectionModal from "./ModelSelectionModal";
import SettingsModal from "./SettingsModal";
import ChatActionButtons from "./ChatActionButtons";
import ChatLoadingIndicator from "./ChatLoadingIndicator";
import { useChatOperations } from "@/hooks/useChatOperations";

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
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
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
  
  const proceedWithModel = async (modelId: string) => {
    setSelectedModel(modelId);
    setShowModelSelection(false);
    
    await enhancePrompt(inputText, modelId, isCustomPrompt, customSystemPrompt);
    setInputText("");
  };

  const handleExpand = async () => {
    await expandPrompt(selectedModel);
  };

  const handleCondense = async () => {
    await condensePrompt(selectedModel);
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
      <div className="flex justify-between items-center mb-4 px-6 pt-6">
        <h2 className="text-xl font-medium text-gradient-blue">
          {chat.title || 'New Chat'}
        </h2>
        <div className="flex items-center gap-3">
          <ModelSelector 
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
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
        onSelectModel={proceedWithModel}
        currentModel={selectedModel}
      />
      
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
