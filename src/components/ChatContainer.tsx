import React, { useState, useRef, useEffect } from "react";
import ChatMessage, { Message, MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { cn } from "@/lib/utils";
import ModelSelector from "./ModelSelector";
import { toast } from "sonner";
import { Loader2, Sparkles, RotateCcw, Plus } from "lucide-react";
import ModelSelectionModal from "./ModelSelectionModal";
import SettingsModal from "./SettingsModal";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@clerk/clerk-react';
import Groq from "groq-sdk";
import { Button } from "./ui/button";

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
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [showModelSelection, setShowModelSelection] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [currentEnhancedPrompt, setCurrentEnhancedPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

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

  // Sample suggestions like in the reference image
  const suggestions = [
    "what is web 3?",
    "where is airfield?", 
    "when is ww2 start?"
  ];

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
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputText,
      timestamp: new Date(),
    };
    
    setMessages([userMessage]);
    setLoading(true);
    
    try {
      console.log('Starting prompt enhancement with model:', modelId);
      const enhancedPrompt = await generateEnhancedPrompt(inputText, modelId);
      
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
      await savePromptToDatabase(inputText, enhancedPrompt, modelId);
      
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

  const generateEnhancedPrompt = async (prompt: string, model: string): Promise<string> => {
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

  const handleExpand = async () => {
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

  const handleCondense = async () => {
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
          <div className="h-full flex flex-col items-center justify-center text-center px-8 max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-8">
              <Sparkles className="h-8 w-8 text-blue-400" />
            </div>
            
            <h1 className="text-4xl font-semibold mb-4 text-white">
              How Can I Assist You?
            </h1>
            
            <p className="text-white/60 mb-8 text-lg">
              Quickly find answers, get assistance, and explore AI-powered insights—all in one place
            </p>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {suggestion}
                </Button>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Prompt Enhancement</h3>
                <p className="text-white/60 text-sm">
                  Transform basic prompts into detailed, AI-optimized instructions for better results.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Smart Conversations</h3>
                <p className="text-white/60 text-sm">
                  Engage in seamless, natural conversations with AI. From answering questions to generating creative content.
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Multiple Models</h3>
                <p className="text-white/60 text-sm">
                  Choose from various AI models including Llama, Mixtral, and Gemma for different tasks.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto px-6 py-8">
              {messages.map(message => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                />
              ))}
              
              {currentEnhancedPrompt && !loading && (
                <div className="mt-6 flex gap-3 justify-center">
                  <Button
                    onClick={handleExpand}
                    className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Expand
                  </Button>
                  <Button
                    onClick={handleCondense}
                    className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30"
                    size="sm"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Condense
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
              <p className="text-blue-400 font-medium">Enhancing your prompt...</p>
              <p className="text-sm text-white/50 mt-1">Powered by Groq's lightning-fast AI</p>
            </div>
          </div>
        )}
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
