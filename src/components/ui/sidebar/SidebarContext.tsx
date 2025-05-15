
import { createContext, useContext, useState } from 'react';

export interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
  collapsed: false,
  onCollapseChange: () => {},
});

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function SidebarProvider({
  children,
  defaultOpen = false,
  defaultCollapsed = false,
  onCollapseChange,
}: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleCollapseChange = (value: boolean) => {
    setCollapsed(value);
    onCollapseChange?.(value);
  };

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        collapsed,
        onCollapseChange: handleCollapseChange,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
