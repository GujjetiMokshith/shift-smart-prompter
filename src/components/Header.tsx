import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ClerkUserButton } from '@/components/auth/ClerkAuth';
import AuthModal from '@/components/AuthModal';

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
  const { user } = useUser();

  return (
    <header 
      className={cn(
        "w-full py-4 px-6 flex items-center justify-between border-b border-input bg-background/90 backdrop-blur-md z-10", 
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
            className="mr-4 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        
        <Link to="/" className="flex items-center group">
          <div className="flex items-center">
            <Zap className="h-6 w-6 mr-3" />
            <h1 className="text-2xl font-bold">
              PromptShift
            </h1>
          </div>
          <span className="ml-3 bg-secondary text-xs px-2 py-1 rounded-full">
            beta
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <SignedOut>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-secondary rounded-lg"
            onClick={() => setShowAuth(true)}
          >
            Sign In
          </Button>
          
          <Button 
            size="sm" 
            className="rounded-lg"
            onClick={() => setShowAuth(true)}
          >
            Get Started
          </Button>
        </SignedOut>
        
        <SignedIn>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-secondary rounded-lg"
            asChild
          >
            <Link to="/workspace">
              Workspace
            </Link>
          </Button>
          <ClerkUserButton />
        </SignedIn>
      </div>

      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </header>
  );
};

export default Header;