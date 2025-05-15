
import React, { createContext, useContext, useState } from 'react';
import { SidebarContextType } from '@/types/sidebar';

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
  open: () => {},
  expanded: true,
  collapsed: false,
  setExpanded: () => {},
  toggleExpanded: () => {},
  toggleCollapsed: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultExpanded?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen = false,
  defaultExpanded = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);
  
  const toggleExpanded = () => setExpanded(prev => !prev);
  const toggleCollapsed = () => setCollapsed(prev => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle,
        close,
        open,
        expanded,
        collapsed,
        setExpanded,
        toggleExpanded,
        toggleCollapsed
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
