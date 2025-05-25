
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
import Groq from "groq-sdk";
import { Button } from "./ui/button";

interface ChatContainerProps {
  className?: string;
  activePromptId?: string | null;
  onPromptSaved?: (prompt: any) => void;
  userProfile?: any;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  className, 
  activePromptId, 
  onPromptSaved,
  userProfile 
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
    
    // Check if user can create new prompts
    if (userProfile?.plan_type === 'free' && userProfile?.prompts_used >= 5) {
      toast.error('Daily limit reached. Upgrade to Pro for unlimited enhancements.');
      return;
    }
    
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
      
      // Save to database
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

Example transformations:  
- Write about dogs → Create a comprehensive 1500-word guide about selecting the right dog breed for families with small children. Include sections on: temperament considerations, space requirements, exercise needs, grooming demands, and health screening. Provide specific examples of 5 family-friendly breeds with their pros and cons.  

- Make a to-do app → Develop a responsive to-do list web application using React and TypeScript with the following features: task categorization with color coding, priority levels (high/medium/low), due dates with reminder notifications, recurring task support, drag-and-drop reordering, data persistence using localStorage, and a clean minimalist UI with dark/light mode toggle. Include proper error handling and accessibility features.

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
              const waitTime = 2; // Wait 2 seconds before retry
              console.log(`Waiting ${waitTime} seconds...`);
              await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
              continue;
            }
          }
          break; // Try next model
        }
      }
      
      console.log(`Switching from ${currentModel} to next model...`);
      currentModelIndex++;
    }

    throw new Error('All models failed to generate response');
  };

  const savePromptToDatabase = async (originalPrompt: string, enhancedPrompt: string, modelUsed: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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

      // Update user's prompt usage count
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          prompts_used: userProfile?.plan_type === 'free' 
            ? (userProfile?.prompts_used || 0) + 1 
            : (userProfile?.prompts_used || 0) + 1 
        })
        .eq('id', user.id);

      if (updateError) console.error('Error updating usage count:', updateError);

      if (onPromptSaved) {
        onPromptSaved(data);
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Prompt enhanced but failed to save');
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

  const toggleCustomPrompt = (value: boolean) => {
    setIsCustomPrompt(value);
  };

  const updateCustomPrompt = (prompt: string) => {
    setCustomSystemPrompt(prompt);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4 px-6 pt-6">
        <h2 className="text-xl font-medium text-gradient-blue">Enhance Your Prompts</h2>
        <ModelSelector 
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      </div>

      <div className="flex-1 overflow-y-auto prompt-chat-scrollbar px-6 min-h-[400px] max-h-[600px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-blue-800/20 flex items-center justify-center mb-6 glow-blue-sm">
              <Sparkles className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-medium mb-3 text-white">Ready to enhance your prompts?</h3>
            <p className="text-white/70 max-w-md leading-relaxed">
              Paste your existing prompt below and I'll transform it into a detailed, AI-optimized instruction using Groq's lightning-fast processing.
            </p>
            <div className="mt-4 text-sm text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Powered by Groq • Ultra-fast AI inference
            </div>
          </div>
        ) : (
          <>
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
                  className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30 hover-glow-sm"
                  size="sm"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Expand
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
          </>
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
          placeholder="Paste your prompt here to enhance it with AI..."
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
