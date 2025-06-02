
import React from "react";
import { cn } from "@/lib/utils";
import { Zap, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  return (
    <header 
      className={cn(
        "w-full py-4 px-6 flex items-center justify-between border-b border-white/5 bg-[#050A14]/90 backdrop-blur-md z-10", 
        className
      )} 
      {...props}
    >
      <div className="flex items-center">
        <Link to="/" className="flex items-center group hover-scale">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-blue-500 mr-3 group-hover:text-blue-400 transition-colors" />
            <h1 className="text-2xl font-bold text-white group-hover:text-gradient-blue transition-colors">
              PromptShift
            </h1>
          </div>
          <span className="ml-3 bg-blue-800/20 text-blue-400 text-xs px-2 py-1 rounded-full glow-blue-sm">
            beta
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
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
          className="bg-blue-800 hover:bg-blue-700 text-white hover-glow rounded-lg"
          asChild
        >
          <Link to="/workspace">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Workspace
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
