
import React, { useState } from "react";
import { Send, Link, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  placeholder = "How can PromptShift help you today?",
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
      <div className="bg-bolt-card border border-white/5 rounded-xl p-2 flex items-center">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent px-3 py-2 resize-none outline-none text-white placeholder-white/40 text-sm min-h-[40px]"
        />
        <div className="flex items-center gap-2 px-2">
          <button
            type="button" 
            className="p-1.5 rounded-full text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            <Link size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-full text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            <Paperclip size={16} />
          </button>
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className={`p-2 rounded-full transition-colors ${
              disabled || !message.trim()
                ? "bg-blue-500/20 text-white/30"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
