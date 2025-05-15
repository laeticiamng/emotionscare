
import Sidebar from './Sidebar';
import SidebarContent from './SidebarContent';
import SidebarGroup from './SidebarGroup';
import SidebarGroupContent from './SidebarGroupContent';
import SidebarGroupLabel from './SidebarGroupLabel';
import SidebarMenu from './SidebarMenu';
import SidebarMenuButton from './SidebarMenuButton';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarTrigger from './SidebarTrigger';
import { SidebarTriggerItem } from './SidebarTriggerItem';
import { SidebarProvider, useSidebar, SidebarContext } from './SidebarContext';
import ThemeButton from './ThemeButton';

// Add missing exports for SidebarHeader, SidebarFooter, SidebarNavGroup
const SidebarHeader = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
};

const SidebarFooter = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
  return <div className={`p-4 border-t mt-auto ${className}`}>{children}</div>;
};

const SidebarNavGroup = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
  return <div className={`space-y-1 ${className}`}>{children}</div>;
};

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarNavGroup,
  SidebarProvider,
  useSidebar,
  SidebarContext,
  SidebarTrigger,
  SidebarTriggerItem,
  ThemeButton
};
