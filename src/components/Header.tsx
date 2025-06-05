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
        "w-full py-4 px-6 flex items-center justify-between border-b border-[#001f54]/10 bg-black/90 backdrop-blur-md z-10 sticky top-0", 
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
            className="mr-4 text-white/70 hover:text-white hover:bg-[#001f54]/10"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        
        <Link to="/" className="flex items-center group hover-scale">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-[#001f54] mr-3 group-hover:text-[#001f54]/80 transition-colors" />
            <h1 className="text-2xl font-bold text-white group-hover:text-[#001f54] transition-colors">
              PromptShift
            </h1>
          </div>
          <span className="ml-3 bg-[#001f54]/20 text-[#001f54] text-xs px-2 py-1 rounded-full glow-blue-sm">
            beta
          </span>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <Link 
          to="/docs" 
          className="text-white/70 hover:text-white transition-colors"
        >
          Documentation
        </Link>
        <Link 
          to="/about" 
          className="text-white/70 hover:text-white transition-colors"
        >
          About
        </Link>
        <Button 
          size="sm" 
          className="bg-[#001f54] hover:bg-[#001f54]/80 text-white hover-glow rounded-lg"
          asChild
        >
          <Link to="/workspace">
            Get Started
          </Link>
        </Button>
      </nav>
    </header>
  );
};

export default Header;