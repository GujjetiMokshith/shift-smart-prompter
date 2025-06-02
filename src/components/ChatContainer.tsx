
import React, { useState, useRef, useEffect } from "react";
import { Message } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";
import ModelSelector from "./ModelSelector";
import { toast } from "sonner";
import ModelSelectionModal from "./ModelSelectionModal";
import SettingsModal from "./SettingsModal";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@clerk/clerk-react';
import WelcomeScreen from "./chat/WelcomeScreen";
import ChatMessages from "./chat/ChatMessages";
import ChatActions from "./chat/ChatActions";
import LoadingIndicator from "./chat/LoadingIndicator";
import { usePromptEnhancement } from "@/hooks/usePromptEnhancement";

interface ChatContainerProps {
  className?: string;
  activePromptId?: string | null;
  onPromptSaved?: (prompt: any) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  className, 
  activePromptId, 
  onPromptSaved
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [currentEnhancedPrompt, setCurrentEnhancedPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  
  const { loading, enhancePrompt, expandPrompt, condensePrompt } = usePromptEnhancement();

  // Load active prompt data
  useEffect(() => {
    if (activePromptId) {
      loadPromptData(activePromptId);
    } else {
      setMessages([]);
      setCurrentEnhancedPrompt("");
      // Check for pending prompt from landing page
      const pendingPrompt = localStorage.getItem("pendingPrompt");
      if (pendingPrompt) {
        setInputText(pendingPrompt);
        localStorage.removeItem("pendingPrompt");
      }
    }
  }, [activePromptId]);

  const loadPromptData = async (promptId: string) => {
    try {
      const { data, error } = await supabase
        .from('enhanced_prompts')
        .select('*')
        .eq('id', promptId)
        .single();

      if (error) throw error;

      const userMessage: Message = {
        id: '1',
        type: 'user',
        content: data.original_prompt,
        timestamp: new Date(data.created_at),
      };

      const assistantMessage: Message = {
        id: '2',
        type: 'assistant',
        content: data.enhanced_prompt,
        isEnhanced: true,
        timestamp: new Date(data.created_at),
      };

      setMessages([userMessage, assistantMessage]);
      setCurrentEnhancedPrompt(data.enhanced_prompt);
      setSelectedModel(data.model_used);
    } catch (error) {
      console.error('Error loading prompt:', error);
      toast.error('Failed to load prompt');
    }
  };

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
    
    await enhancePrompt(
      inputText,
      modelId,
      isCustomPrompt,
      customSystemPrompt,
      setMessages,
      setCurrentEnhancedPrompt,
      savePromptToDatabase
    );
  };

  const savePromptToDatabase = async (originalPrompt: string, enhancedPrompt: string, modelUsed: string) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('enhanced_prompts')
        .insert({
          user_id: user.id,
          original_prompt: originalPrompt,
          enhanced_prompt: enhancedPrompt,
          model_used: modelUsed
        })
        .select()
        .single();

      if (error) throw error;

      if (onPromptSaved) {
        onPromptSaved(data);
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  };

  const handleExpand = () => {
    expandPrompt(currentEnhancedPrompt, selectedModel, setMessages, setCurrentEnhancedPrompt);
  };

  const handleCondense = () => {
    condensePrompt(currentEnhancedPrompt, selectedModel, setMessages, setCurrentEnhancedPrompt);
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const toggleCustomPrompt = (value: boolean) => {
    setIsCustomPrompt(value);
  };

  const updateCustomPrompt = (prompt: string) => {
    setCustomSystemPrompt(prompt);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <>
            <ChatMessages messages={messages} />
            <ChatActions 
              onExpand={handleExpand}
              onCondense={handleCondense}
              showActions={currentEnhancedPrompt && !loading}
            />
          </>
        )}
        
        {loading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-6">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            value={inputText}
            onChange={handleInputChange}
            onSubmit={handleSendMessage}
            disabled={loading}
            placeholder="Write anything here..."
          />
        </div>
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
