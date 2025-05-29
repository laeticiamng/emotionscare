
import React from 'react';

interface LoadingAnimationProps {
  text?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ text = "Chargement..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

export default LoadingAnimation;
