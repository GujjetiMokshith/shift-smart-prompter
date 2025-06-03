
import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { Message, MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";
import ModelSelector from "./ModelSelector";
import { toast } from "sonner";
import { Loader2, Plus, RotateCcw, Key } from "lucide-react";
import ModelSelectionModal from "./ModelSelectionModal";
import SettingsModal from "./SettingsModal";
import { supabase } from "@/integrations/supabase/client";
import Groq from "groq-sdk";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [currentEnhancedPrompt, setCurrentEnhancedPrompt] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [storedApiKey, setStoredApiKey] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available Groq models
  const availableModels = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile", 
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
  ];

  // Check for stored API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('groq_api_key');
    if (savedApiKey) {
      setStoredApiKey(savedApiKey);
    }
  }, []);

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
    
    if (!storedApiKey) {
      setShowApiKeyDialog(true);
      setInputText(content);
      return;
    }
    
    setInputText("");
    setShowModelSelection(true);
  };
  
  const proceedWithModel = async (modelId: string) => {
    setSelectedModel(modelId);
    setShowModelSelection(false);
    
    // Add user message
    onAddMessage({
      type: "user",
      content: inputText
    });
    
    setLoading(true);
    
    try {
      console.log('Starting prompt enhancement with model:', modelId);
      const enhancedPrompt = await generateEnhancedPrompt(inputText, modelId);
      
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
      await savePromptToDatabase(inputText, enhancedPrompt, modelId);
      
      toast.success("Prompt enhanced successfully!");
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt. Please check your API key and try again.");
      
      onAddMessage({
        type: "assistant",
        content: "Sorry, I couldn't enhance your prompt. Please check your API key and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const generateEnhancedPrompt = async (prompt: string, model: string): Promise<string> => {
    if (!storedApiKey) {
      throw new Error('No API key provided');
    }

    const groq = new Groq({ 
      apiKey: storedApiKey,
      dangerouslyAllowBrowser: true 
    });

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

Example transformations:  
- Write about dogs → Create a comprehensive 1500-word guide about selecting the right dog breed for families with small children. Include sections on: temperament considerations, space requirements, exercise needs, grooming demands, and health screening. Provide specific examples of 5 family-friendly breeds with their pros and cons.  

- Make a to-do app → Develop a responsive to-do list web application using React and TypeScript with the following features: task categorization with color coding, priority levels (high/medium/low), due dates with reminder notifications, recurring task support, drag-and-drop reordering, data persistence using localStorage, and a clean minimalist UI with dark/light mode toggle. Include proper error handling and accessibility features.

Your enhanced prompt should be 3–5× more detailed than the original. Return ONLY the enhanced prompt with no explanations or meta-commentary.`;

    try {
      console.log(`Trying model: ${model}`);
      
      const completion = await groq.chat.completions.create({
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
      console.error(`❌ Error with ${model}:`, error);
      throw error;
    }
  };

  const savePromptToDatabase = async (originalPrompt: string, enhancedPrompt: string, modelUsed: string) => {
    try {
      const { data, error } = await supabase
        .from('enhanced_prompts')
        .insert({
          user_id: null,
          original_prompt: originalPrompt,
          enhanced_prompt: enhancedPrompt,
          model_used: modelUsed
        })
        .select()
        .single();

      if (error) throw error;
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  };

  const handleExpand = async () => {
    if (!currentEnhancedPrompt || !storedApiKey) return;
    
    setLoading(true);
    try {
      const expandedPrompt = await generateEnhancedPrompt(
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

  const handleCondense = async () => {
    if (!currentEnhancedPrompt || !storedApiKey) return;
    
    setLoading(true);
    try {
      const condensedPrompt = await generateEnhancedPrompt(
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

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const toggleCustomPrompt = (value: boolean) => {
    setIsCustomPrompt(value);
  };

  const updateCustomPrompt = (prompt: string) => {
    setCustomSystemPrompt(prompt);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('groq_api_key', apiKey.trim());
      setStoredApiKey(apiKey.trim());
      setShowApiKeyDialog(false);
      setApiKey("");
      toast.success("API key saved successfully!");
      
      // If we have input text waiting, proceed with model selection
      if (inputText.trim()) {
        setShowModelSelection(true);
      }
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4 px-6 pt-6">
        <h2 className="text-xl font-medium text-gradient-blue">
          {chat.title || 'New Chat'}
        </h2>
        <div className="flex items-center gap-3">
          {!storedApiKey && (
            <Button
              onClick={() => setShowApiKeyDialog(true)}
              size="sm"
              variant="outline"
              className="border-blue-800/30 text-blue-400 hover:bg-blue-900/20"
            >
              <Key className="h-4 w-4 mr-2" />
              Set API Key
            </Button>
          )}
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
        
        {currentEnhancedPrompt && !loading && storedApiKey && (
          <div className="mt-6 flex gap-3 justify-center">
            <Button
              onClick={handleExpand}
              className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30 hover-glow-sm"
              size="sm"
            >
              <Plus className="h-3 w-3 mr-1" />
              More Detailed
            </Button>
            <Button
              onClick={handleCondense}
              className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30 hover-glow-sm"
              size="sm"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Condense
            </Button>
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="neo-blur p-10 rounded-2xl flex flex-col items-center">
              <Loader2 className="loading-spinner" />
              <p className="mt-6 text-blue-400 font-medium text-lg">Enhancing your prompt...</p>
              <p className="text-sm text-white/50 mt-2">Powered by Groq's lightning-fast AI</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6">
        <ChatInput 
          value={inputText}
          onChange={handleInputChange}
          onSubmit={handleSendMessage}
          disabled={loading}
          placeholder={storedApiKey ? "Type your message here..." : "Set your Groq API key to start chatting..."}
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

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="bg-[#0B1426] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Enter Groq API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              You need a Groq API key to use the AI functionality. You can get one free at{" "}
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                console.groq.com/keys
              </a>
            </p>
            <Input
              type="password"
              placeholder="Enter your Groq API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApiKeySubmit();
                }
              }}
            />
            <Button 
              onClick={handleApiKeySubmit}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!apiKey.trim()}
            >
              Save API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatContainer;
