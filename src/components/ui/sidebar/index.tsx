
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Separator } from '../separator';
import { Home, Moon, SunMedium, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';
import { ThemeButton } from "./ThemeButton";

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar = ({ className, children }: SidebarProps) => {
  const { collapsed, toggleCollapsed, isMobile, isOpen, setIsOpen } = useSidebar();
  const location = useLocation();

  const handleToggle = () => {
    if (isMobile && setIsOpen) {
      setIsOpen(!isOpen);
    } else {
      toggleCollapsed();
    }
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-background border-r transition-all duration-300 z-20',
        isMobile ? 'fixed inset-y-0 left-0 h-full shadow-lg' : 'relative h-[calc(100vh-64px)]',
        collapsed && !isMobile ? 'w-[70px]' : 'w-[240px]',
        isMobile && !isOpen && 'translate-x-[-100%]',
        className
      )}
    >
      <div className={cn(
        'flex items-center justify-between p-4',
        collapsed && !isMobile && 'justify-center'
      )}>
        {!collapsed && <h3 className="text-lg font-semibold">Navigation</h3>}
        <button 
          className="p-1 rounded-md hover:bg-accent"
          onClick={handleToggle}
        >
          {isMobile 
            ? <X className="h-5 w-5" /> 
            : (collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />)
          }
        </button>
      </div>
      <Separator />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      
      <div className="p-3 mt-auto">
        <ThemeButton collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
