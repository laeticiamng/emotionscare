
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

export interface SidebarTriggerItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const SidebarTriggerItem: React.FC<SidebarTriggerItemProps> = ({
  children,
  icon,
  label,
  open,
  onOpenChange,
  disabled = false,
  className,
}) => {
  const { expanded } = useSidebar();

  const toggleOpen = () => {
    if (!disabled) {
      onOpenChange(!open);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div
        className={cn(
          "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
          open && "bg-accent/50",
          disabled && "pointer-events-none opacity-50"
        )}
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          {icon && (
            <div className="mr-2 h-4 w-4">
              {icon}
            </div>
          )}
          {(expanded || !icon) && <span>{label}</span>}
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </div>
      {open && <div className="pl-6">{children}</div>}
    </div>
  );
};

export default SidebarTriggerItem;
