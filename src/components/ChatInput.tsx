
import React, { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  placeholder = "Paste your prompt here...",
  disabled = false,
  className,
}) => {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("flex flex-col w-full", className)}
    >
      <div className="glass p-1 flex items-start">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className="flex-1 bg-transparent px-3 py-2 resize-none outline-none text-white placeholder-white/40 text-sm"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`p-2 mt-1 mr-1 rounded-full transition-colors ${
            disabled || !message.trim()
              ? "bg-promptshift-primary/30 text-white/40"
              : "bg-promptshift-primary hover:bg-promptshift-accent text-white"
          }`}
        >
          <Send size={18} />
        </button>
      </div>
      
      <div className="mt-2 px-2 flex justify-between text-xs text-white/50">
        <span>{message.length > 0 ? `${message.length} characters` : "Enter your prompt"}</span>
        <span>
          ~{Math.max(1, Math.ceil(message.length / 4))} tokens
        </span>
      </div>
    </form>
  );
};

export default ChatInput;
