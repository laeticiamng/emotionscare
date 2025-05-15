
// Types liés à la barre latérale
export interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  isOpen?: boolean;  // Pour compatibilité
  setIsOpen?: (open: boolean) => void;  // Pour compatibilité
  sidebarWidth?: number;
}
