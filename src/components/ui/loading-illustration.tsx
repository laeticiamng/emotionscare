
import React from 'react';
import LoadingAnimation from './loading-animation';

export const LoadingIllustration: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingAnimation text="Chargement de l'application..." />
    </div>
  );
};
