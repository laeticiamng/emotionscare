import React from 'react';

interface RootErrorBoundaryProps {
  children: React.ReactNode;
}

// Simple error boundary that does nothing for now
export const RootErrorBoundary: React.FC<RootErrorBoundaryProps> = ({ children }) => {
  return <>{children}</>;
};

export default RootErrorBoundary;