
import React, { createContext, useContext } from 'react';
import { SidebarContextType } from '@/types/sidebar';
import SidebarProvider from '@/components/ui/sidebar/SidebarContext';

// Re-export the SidebarProvider component
export { SidebarProvider };

// Re-export the useSidebar hook from the component
export { useSidebar } from '@/components/ui/sidebar/SidebarContext';

// Export default context for backward compatibility
export default SidebarProvider;
