
import React from 'react';

interface LoadingIllustrationProps {
  text?: string;
}

export const LoadingIllustration: React.FC<LoadingIllustrationProps> = ({ 
  text = "Chargement..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        {/* Animated breathing circle */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-ping opacity-20"></div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-foreground">{text}</p>
        <div className="flex justify-center mt-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
