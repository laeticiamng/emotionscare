import React from 'react';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

// Simple accessibility provider that does nothing for now
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default AccessibilityProvider;