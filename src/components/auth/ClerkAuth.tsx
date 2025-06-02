import React from 'react';
import { SignIn, SignUp, UserButton } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface ClerkAuthProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export const ClerkAuth: React.FC<ClerkAuthProps> = ({ isOpen, onClose, mode, onToggleMode }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#030712] border border-white/10 text-white p-0">
        <div className="p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Zap className="h-5 w-5 text-blue-500" />
              <DialogTitle className="text-xl font-bold text-white">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="clerk-auth-container">
            {mode === 'signin' ? (
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-[#060B16] border-white/10 text-white hover:bg-[#0a1220]",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                    formFieldInput: "bg-[#060B16] border-white/10 text-white",
                    identityPreviewEditButton: "text-blue-400",
                    formFieldLabel: "text-white/80",
                    footerActionLink: "text-blue-400 hover:text-blue-300"
                  }
                }}
                redirectUrl="/workspace"
              />
            ) : (
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-[#060B16] border-white/10 text-white hover:bg-[#0a1220]",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                    formFieldInput: "bg-[#060B16] border-white/10 text-white",
                    identityPreviewEditButton: "text-blue-400",
                    formFieldLabel: "text-white/80",
                    footerActionLink: "text-blue-400 hover:text-blue-300"
                  }
                }}
                redirectUrl="/workspace"
              />
            )}
          </div>
          
          <div className="text-center mt-4">
            <button
              onClick={onToggleMode}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ClerkUserButton: React.FC = () => {
  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
          userButtonPopoverCard: "bg-[#030712] border border-white/10",
          userButtonPopoverActionButton: "text-white hover:bg-white/10",
          userButtonPopoverActionButtonText: "text-white",
          userButtonPopoverFooter: "hidden"
        }
      }}
      afterSignOutUrl="/"
    />
  );
};