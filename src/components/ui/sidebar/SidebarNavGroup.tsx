
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useSidebar } from './SidebarContext';

interface SidebarNavGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  icon
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const { collapsed } = useSidebar();

  return (
    <div className={cn("py-2", collapsed ? "px-2" : "px-3")}>
      <button
        className={cn(
          "flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium hover:bg-accent",
          collapsed ? "justify-center" : "justify-between"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {!collapsed && <span>{title}</span>}
        </div>
        {!collapsed && (
          <span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </span>
        )}
      </button>
      {(isOpen || collapsed) && (
        <div className={cn("mt-1", collapsed ? "px-1" : "pl-4")}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarNavGroup;
