
import React from "react";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  return (
    <header 
      className={cn("w-full py-4 px-6 flex items-center justify-between border-b border-white/5 bg-transparent", className)} 
      {...props}
    >
      <div className="flex items-center">
        <div className="flex items-center">
          <Zap className="h-5 w-5 text-blue-400 mr-2" />
          <h1 className="text-xl font-bold text-white">
            PromptShift
          </h1>
        </div>
        <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
          beta
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/5">
          Documentation
        </Button>
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/5">
          About
        </Button>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
          Start Free
        </Button>
      </div>
    </header>
  );
};

export default Header;
