
import React from "react";
import { cn } from "@/lib/utils";
import { Key } from "lucide-react";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  const handleOpenApiKeyModal = () => {
    // Trigger API key input display in ChatContainer
    const event = new CustomEvent("openApiKeyInput");
    window.dispatchEvent(event);
  };

  return (
    <header 
      className={cn("w-full py-4 px-6 flex items-center justify-between border-b border-white/10", className)} 
      {...props}
    >
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-promptshift-accent to-promptshift-primary bg-clip-text text-transparent">
          PromptShift
        </h1>
        <span className="ml-2 bg-promptshift-primary/20 text-promptshift-accent text-xs px-2 py-0.5 rounded-full">
          beta
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="text-sm text-promptshift-light-gray hover:text-white transition-colors flex items-center gap-1"
          onClick={handleOpenApiKeyModal}
        >
          <Key size={16} />
          <span>API Key</span>
        </button>
        <button className="text-sm text-promptshift-light-gray hover:text-white transition-colors">
          History
        </button>
        <button className="text-sm text-promptshift-light-gray hover:text-white transition-colors">
          Settings
        </button>
      </div>
    </header>
  );
};

export default Header;
