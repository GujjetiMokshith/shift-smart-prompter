
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Zap, Settings, LayoutGrid, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthModal from "./AuthModal";
import { toast } from "sonner";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Error signing out');
    }
  };

  return (
    <>
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
          
          {user ? (
            <>
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full bg-blue-900/20 hover:bg-blue-900/30 hover-glow-sm w-8 h-8 p-0"
                  >
                    <User className="h-4 w-4 text-blue-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-[#030712] border border-white/10 text-white"
                >
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              size="sm" 
              className="bg-blue-800 hover:bg-blue-700 text-white hover-glow rounded-lg"
              onClick={() => setShowAuth(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>
      
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Header;
