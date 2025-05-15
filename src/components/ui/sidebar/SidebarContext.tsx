
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SidebarContextType } from '@/types';
import { useMediaQuery } from '@/hooks/use-media-query';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Load sidebar state from localStorage
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState) {
      setCollapsed(JSON.parse(savedCollapsedState));
    }
    
    // On mobile, sidebar should be collapsed by default
    if (isMobile) {
      setCollapsed(true);
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    
    // On mobile, also set isOpen to false when collapsing
    if (isMobile && newState) {
      setIsOpen(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      toggleCollapsed,
      isOpen,
      setIsOpen,
      isMobile
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
