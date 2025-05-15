
import React, { createContext, useContext, useState } from 'react';
import { SidebarContextType } from '@/types/sidebar';

// Create the context with default values
export const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
  isOpen: true,
  collapsed: false,
  setExpanded: () => {},
  toggle: () => {},
  open: () => {},
  close: () => {},
  toggleCollapsed: () => {},
  setCollapsed: () => {},
  showLabels: true,
  setShowLabels: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultExpanded = true,
  defaultOpen = true,
  defaultCollapsed = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [showLabels, setShowLabels] = useState(true);

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggleCollapsed = () => setCollapsed(prev => !prev);

  return (
    <SidebarContext.Provider value={{ 
      expanded, 
      isOpen, 
      collapsed, 
      setExpanded, 
      toggle, 
      open, 
      close, 
      toggleCollapsed,
      setCollapsed,
      showLabels,
      setShowLabels
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
