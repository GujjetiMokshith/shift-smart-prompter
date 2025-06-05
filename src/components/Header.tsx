
import React from "react";
import { cn } from "@/lib/utils";
import { Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  className, 
  onToggleSidebar, 
  showSidebarToggle = false,
  ...props 
}) => {
  return (
    <header 
      className={cn(
        "w-full py-4 px-6 flex items-center justify-between border-b border-[#001f54]/20 bg-gradient-to-r from-black/95 to-[#001f54]/95 backdrop-blur-md z-20 shadow-lg shadow-[#001f54]/10", 
        className
      )} 
      {...props}
    >
      <div className="flex items-center">
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="mr-4 text-white/70 hover:text-white hover:bg-[#001f54]/20 border-[#001f54]/10 hover:border-[#001f54]/30 transition-all duration-200"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        
        <Link to="/" className="flex items-center group hover-scale">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-[#001f54] mr-3 group-hover:text-blue-400 transition-colors filter drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
              PromptShift
            </h1>
          </div>
          <span className="ml-3 bg-[#001f54]/30 text-[#001f54] border border-[#001f54]/20 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            beta
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-[#001f54] to-[#001f54]/80 hover:from-[#001f54]/90 hover:to-[#001f54]/70 text-white border border-[#001f54]/30 shadow-lg shadow-[#001f54]/20 hover:shadow-[#001f54]/30 transition-all duration-300 rounded-lg"
          asChild
        >
          <Link to="/workspace">
            Get Started
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
