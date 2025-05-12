
import React from "react";
import { cn } from "@/lib/utils";
import { Zap, Settings, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  return (
    <header 
      className={cn(
        "w-full py-4 px-6 flex items-center justify-between border-b border-white/5 bg-[#050A14]/80 backdrop-blur-md z-10", 
        className
      )} 
      {...props}
    >
      <div className="flex items-center">
        <Link to="/" className="flex items-center group hover-scale">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-blue-500 mr-2 group-hover:text-blue-400 transition-colors" />
            <h1 className="text-xl font-bold text-white group-hover:text-gradient-blue transition-colors">
              PromptShift
            </h1>
          </div>
          <span className="ml-2 bg-blue-700/20 text-blue-400 text-xs px-2 py-0.5 rounded-full glow-blue-sm">
            beta
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5 hover-border-glow rounded-lg"
          asChild
        >
          <Link to="/docs">
            Documentation
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/5 hover-border-glow rounded-lg"
          asChild
        >
          <Link to="/about">
            About
          </Link>
        </Button>
        
        <Button 
          size="sm" 
          className="bg-blue-700 hover:bg-blue-800 text-white hover-glow rounded-lg"
          asChild
        >
          <Link to="/workspace">
            <LayoutGrid className="mr-1 h-4 w-4" />
            Workspace
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
