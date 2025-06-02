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
      <DialogContent className="sm:max-w-md bg-background border border-input">
        <div className="p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Zap className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold">
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
                    socialButtonsBlockButton: "bg-secondary border-input",
                    formButtonPrimary: "bg-primary",
                    formFieldInput: "bg-secondary border-input",
                    identityPreviewEditButton: "text-primary",
                    formFieldLabel: "text-foreground",
                    footerActionLink: "text-primary"
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
                    socialButtonsBlockButton: "bg-secondary border-input",
                    formButtonPrimary: "bg-primary",
                    formFieldInput: "bg-secondary border-input",
                    identityPreviewEditButton: "text-primary",
                    formFieldLabel: "text-foreground",
                    footerActionLink: "text-primary"
                  }
                }}
                redirectUrl="/workspace"
              />
            )}
          </div>
          
          <div className="text-center mt-4">
            <button
              onClick={onToggleMode}
              className="text-primary hover:text-primary/90 text-sm transition-colors"
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
          userButtonPopoverCard: "bg-background border border-input",
          userButtonPopoverActionButton: "hover:bg-secondary",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverFooter: "hidden"
        }
      }}
      afterSignOutUrl="/"
    />
  );
};