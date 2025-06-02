
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ClerkUserButton, ClerkAuth } from '@/components/auth/ClerkAuth';

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
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useUser();

  const handleToggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <header 
      className={cn(
        "w-full py-4 px-6 flex items-center justify-between border-b border-white/5 bg-[#050A14]/90 backdrop-blur-md z-10", 
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
            className="mr-4 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        
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
        <SignedOut>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5 hover-border-glow rounded-lg"
            onClick={() => {
              setAuthMode('signin');
              setShowAuth(true);
            }}
          >
            Sign In
          </Button>
          
          <Button 
            size="sm" 
            className="bg-blue-800 hover:bg-blue-700 text-white hover-glow rounded-lg"
            onClick={() => {
              setAuthMode('signup');
              setShowAuth(true);
            }}
          >
            Get Started
          </Button>
        </SignedOut>
        
        <SignedIn>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/5 hover-border-glow rounded-lg"
            asChild
          >
            <Link to="/workspace">
              Workspace
            </Link>
          </Button>
          <ClerkUserButton />
        </SignedIn>
      </div>

      <ClerkAuth 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onToggleMode={handleToggleAuthMode}
      />
    </header>
  );
};

export default Header;
