import React from 'react';

const RootErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default RootErrorBoundary;