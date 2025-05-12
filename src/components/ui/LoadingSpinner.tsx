
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Chargement en cours...' 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]}`}></div>
      {text && <div className="mt-3 text-muted-foreground">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
