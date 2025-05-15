
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeButton from './ThemeButton';

interface SidebarProps {
  children: React.ReactNode;
  collapsed: boolean;
  toggleCollapsed: () => void;
  className?: string;
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SidebarProps
>(({ children, collapsed, toggleCollapsed, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-full flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <div className="flex-1 overflow-y-auto p-3 pt-1">{children}</div>
      <div className="p-3 pt-0">
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <ThemeButton collapsed={collapsed} />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleCollapsed}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

export { default as SidebarSection } from './SidebarSection';
export { default as SidebarItem } from './SidebarItem';
export { default as SidebarTriggerItem } from './SidebarTriggerItem';
export { default as ThemeButton } from './ThemeButton';
