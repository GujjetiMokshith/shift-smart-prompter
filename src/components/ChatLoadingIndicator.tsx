
import React from 'react';
import { Loader2 } from 'lucide-react';

const ChatLoadingIndicator: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="neo-blur p-10 rounded-2xl flex flex-col items-center">
        <Loader2 className="loading-spinner" />
        <p className="mt-6 text-blue-400 font-medium text-lg">Enhancing your prompt...</p>
        <p className="text-sm text-white/50 mt-2">Powered by Groq's lightning-fast AI</p>
      </div>
    </div>
  );
};

export default ChatLoadingIndicator;
