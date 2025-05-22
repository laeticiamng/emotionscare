
import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface LayoutProviderProps {
  children: React.ReactNode;
  defaultLayout?: 'default' | 'narrow' | 'wide';
}

export type LayoutContextType = {
  layout: 'default' | 'narrow' | 'wide';
  setLayout: (layout: 'default' | 'narrow' | 'wide') => void;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};
