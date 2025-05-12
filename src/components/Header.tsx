
import React from "react";
import { cn } from "@/lib/utils";
import { Settings, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  return (
    <header 
      className={cn("w-full py-4 px-6 flex items-center justify-between border-b border-white/10 bg-promptshift-dark-blue/90 backdrop-blur-md", className)} 
      {...props}
    >
      <div className="flex items-center">
        <div className="flex items-center">
          <Zap className="h-5 w-5 text-promptshift-accent mr-2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-promptshift-accent to-promptshift-primary bg-clip-text text-transparent">
            PromptShift
          </h1>
        </div>
        <span className="ml-2 bg-promptshift-accent/20 text-promptshift-accent text-xs px-2 py-0.5 rounded-full">
          beta
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-promptshift-light-gray hover:text-white hover:bg-white/5">
              <Settings size={18} />
              <span className="sr-only">Settings</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-promptshift-dark-blue border-l border-white/10">
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-medium">Settings</h3>
              <p className="text-sm text-promptshift-light-gray">
                Configure your PromptShift experience
              </p>
              {/* Add settings controls here */}
            </div>
          </SheetContent>
        </Sheet>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-promptshift-light-gray hover:text-white hover:bg-white/5">
              <Menu size={18} />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-promptshift-dark-blue border-r border-white/10">
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-medium">Menu</h3>
              <nav className="space-y-2">
                <a href="/" className="block px-2 py-1.5 rounded hover:bg-white/5 text-promptshift-light-gray hover:text-white transition-colors">
                  Home
                </a>
                <a href="/history" className="block px-2 py-1.5 rounded hover:bg-white/5 text-promptshift-light-gray hover:text-white transition-colors">
                  History
                </a>
                <a href="/templates" className="block px-2 py-1.5 rounded hover:bg-white/5 text-promptshift-light-gray hover:text-white transition-colors">
                  Templates
                </a>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
