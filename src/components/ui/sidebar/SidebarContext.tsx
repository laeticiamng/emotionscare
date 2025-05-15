
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SidebarContextType } from '@/types/theme';

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
  open: () => {},
  collapsed: false,
  expanded: true,
  toggleCollapsed: () => {}
});

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

type SidebarProviderProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export const SidebarProvider = ({
  children,
  defaultOpen = false,
}: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState(false);
  
  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  const toggleCollapsed = () => setCollapsed(prev => !prev);
  
  // Listen for escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle,
        close,
        open,
        collapsed,
        expanded: !collapsed,
        toggleCollapsed
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext };
