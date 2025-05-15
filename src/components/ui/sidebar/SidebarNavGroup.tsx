import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

interface SidebarNavGroupProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  badge?: React.ReactNode;
}

export function SidebarNavGroup({
  title,
  icon,
  children,
  defaultExpanded = false,
  badge
}: SidebarNavGroupProps) {
  const { collapsed } = useSidebar();
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <div className={cn("py-2", collapsed ? "px-2" : "px-3")}>
      <button
        className={cn(
          "flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium hover:bg-accent",
          collapsed ? "justify-center" : "justify-between"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {!collapsed && <span>{title}</span>}
        </div>
        {!collapsed && (
          <span>
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </span>
        )}
      </button>
      {(expanded || collapsed) && (
        <div className={cn("mt-1", collapsed ? "px-1" : "pl-4")}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarNavGroup;
