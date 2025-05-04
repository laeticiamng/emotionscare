
import React from 'react';

interface LoadingAnimationProps {
  text?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ text = "Chargement..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12" role="status" aria-live="polite">
      <div className="w-12 h-12 relative">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      </div>
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
};

export default LoadingAnimation;
