import React from 'react';
import { ClerkAuth } from './auth/ClerkAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');

  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <ClerkAuth
      isOpen={isOpen}
      onClose={onClose}
      mode={mode}
      onToggleMode={handleToggleMode}
    />
  );
};

export default AuthModal;