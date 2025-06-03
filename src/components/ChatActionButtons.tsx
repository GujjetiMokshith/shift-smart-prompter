
import React from 'react';
import { Button } from './ui/button';
import { Plus, RotateCcw } from 'lucide-react';

interface ChatActionButtonsProps {
  onExpand: () => void;
  onCondense: () => void;
  disabled?: boolean;
}

const ChatActionButtons: React.FC<ChatActionButtonsProps> = ({
  onExpand,
  onCondense,
  disabled = false
}) => {
  return (
    <div className="mt-6 flex gap-3 justify-center">
      <Button
        onClick={onExpand}
        disabled={disabled}
        className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30 hover-glow-sm"
        size="sm"
      >
        <Plus className="h-3 w-3 mr-1" />
        More Detailed
      </Button>
      <Button
        onClick={onCondense}
        disabled={disabled}
        className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30 hover-glow-sm"
        size="sm"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Condense
      </Button>
    </div>
  );
};

export default ChatActionButtons;
