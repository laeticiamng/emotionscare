
import { createContext, useContext, useState } from 'react';

export interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  
  // Add missing properties and methods
  isOpen: boolean;
  toggle: () => void;
  toggleCollapsed: () => void;
  expanded?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
  collapsed: false,
  onCollapseChange: () => {},
  
  // Default values for new properties
  isOpen: false,
  toggle: () => {},
  toggleCollapsed: () => {},
  setCollapsed: () => {},
});

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
  defaultExpanded?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const SidebarProvider = ({
  children,
  defaultOpen = false,
  defaultCollapsed = false,
  defaultExpanded = false,
  onCollapseChange,
}: SidebarProviderProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleCollapseChange = (value: boolean) => {
    setCollapsed(value);
    onCollapseChange?.(value);
  };
  
  // Add toggle functions
  const toggle = () => {
    setOpen(!open);
  };
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    onCollapseChange?.(!collapsed);
  };

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        collapsed,
        onCollapseChange: handleCollapseChange,
        
        // Provide the new properties
        isOpen: open,
        toggle,
        toggleCollapsed,
        expanded,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
