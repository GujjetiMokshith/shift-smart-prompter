import React from "react";
import { Check, Copy, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";

export type MessageType = "user" | "assistant";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  isEnhanced?: boolean;
  timestamp?: Date;
  options?: string[]; // Added for multiple enhancement options
}

interface ChatMessageProps {
  message: Message;
  className?: string;
  onSelectOption?: (option: string) => void; // Handler for option selection
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, className }) => {
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.type === "user";

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([message.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `enhanced-prompt-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded prompt");
  };
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div 
        className={cn(
          "max-w-[85%] rounded-xl px-4 py-3 flex flex-col animate-slide-in",
          isUser 
            ? "bg-blue-700/20 text-white rounded-tr-none hover-border-glow" 
            : "bg-[#070C18] rounded-tl-none hover-border-glow border border-white/5"
        )}
      >
        {!isUser && message.isEnhanced && (
          <div className="text-xs text-blue-500 mb-1 font-medium">
            Enhanced Prompt
          </div>
        )}
        
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        
        {/* Action buttons for enhanced prompts */}
        {!isUser && message.isEnhanced && (
          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-white/5">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              className="bg-blue-700/10 hover:bg-blue-700/20 text-blue-400 text-xs rounded-lg"
            >
              <FileDown className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </div>
        )}
        
        <div className="flex justify-end items-center mt-1.5">
          <button
            onClick={() => copyToClipboard(message.content)}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              isUser 
                ? "bg-white/10 hover:bg-white/15 text-white/90" 
                : "bg-blue-700/10 hover:bg-blue-700/20 text-blue-400"
            }`}
          >
            {copied ? (
              <>
                <Check size={12} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;