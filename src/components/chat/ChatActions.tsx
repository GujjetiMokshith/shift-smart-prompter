
import React from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatActionsProps {
  onExpand: () => void;
  onCondense: () => void;
  showActions: boolean;
}

const ChatActions: React.FC<ChatActionsProps> = ({ onExpand, onCondense, showActions }) => {
  if (!showActions) return null;

  return (
    <div className="mt-6 flex gap-3 justify-center">
      <Button
        onClick={onExpand}
        className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30"
        size="sm"
      >
        <Plus className="h-3 w-3 mr-1" />
        Expand
      </Button>
      <Button
        onClick={onCondense}
        className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 hover:text-blue-300 border border-blue-800/30"
        size="sm"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Condense
      </Button>
    </div>
  );
};

export default ChatActions;
