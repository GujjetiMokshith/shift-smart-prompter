
import React, { useState, useRef, useEffect } from "react";
import { Send, Link, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onChange?: (message: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  onChange,
  value,
  placeholder = "How can PromptShift help you today?",
  disabled = false,
  className,
}) => {
  const [message, setMessage] = useState(value || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update local state when the value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setMessage(value);
    }
  }, [value]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSubmit(message);
      // Only clear the message if the component isn't controlled
      if (value === undefined) {
        setMessage("");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    if (onChange) {
      onChange(newValue);
    }
    
    // Auto resize textarea
    adjustTextareaHeight();
  };
  
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("flex flex-col w-full", className)}
    >
      <div className="bg-[#070C18] border border-white/5 rounded-xl p-2 flex items-center hover-border-glow transition-all">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent px-3 py-2 resize-none outline-none text-white placeholder-white/40 text-sm min-h-[40px] max-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center gap-2 px-2">
          <button
            type="button" 
            className="p-1.5 rounded-full text-white/50 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <Link size={16} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-full text-white/50 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <Paperclip size={16} />
          </button>
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className={`p-2 rounded-full transition-all ${
              disabled || !message.trim()
                ? "bg-blue-700/20 text-white/30"
                : "bg-blue-700 hover:bg-blue-800 text-white hover-glow"
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
