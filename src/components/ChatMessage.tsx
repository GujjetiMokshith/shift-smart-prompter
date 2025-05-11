
import React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type MessageType = "user" | "assistant";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  isEnhanced?: boolean;
  timestamp?: Date;
}

interface ChatMessageProps {
  message: Message;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, className }) => {
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.type === "user";
  
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
          "max-w-[85%] rounded-2xl px-4 py-3 flex flex-col animate-slide-in",
          isUser 
            ? "bg-promptshift-primary text-white rounded-tr-none" 
            : "neo-blur rounded-tl-none"
        )}
      >
        {!isUser && message.isEnhanced && (
          <div className="text-xs text-promptshift-success mb-1">
            Enhanced Prompt
          </div>
        )}
        
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        
        <div className="flex justify-end items-center mt-1">
          <button
            onClick={copyToClipboard}
            className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
              isUser 
                ? "bg-white/10 hover:bg-white/20 text-white/90" 
                : "bg-white/5 hover:bg-white/10 text-white/80"
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
