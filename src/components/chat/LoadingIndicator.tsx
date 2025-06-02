
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
        <p className="text-blue-400 font-medium">Enhancing your prompt...</p>
        <p className="text-sm text-white/50 mt-1">Powered by Groq's lightning-fast AI</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
