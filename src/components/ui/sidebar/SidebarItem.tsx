
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

export interface SidebarItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  to?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  tooltip?: string;
  external?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  icon,
  to,
  onClick,
  active = false,
  disabled = false,
  className,
  tooltip,
  external = false,
}) => {
  const { expanded } = useSidebar();

  const content = (
    <div
      className={cn(
        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
        active ? "bg-accent text-accent-foreground" : "transparent",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      title={tooltip || (typeof children === 'string' ? children : undefined)}
      onClick={disabled ? undefined : onClick}
    >
      {icon && (
        <div className="mr-2 h-4 w-4">
          {icon}
        </div>
      )}
      {(expanded || !icon) && <span className="truncate">{children}</span>}
    </div>
  );

  if (to) {
    if (external) {
      return (
        <a 
          href={to} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block"
        >
          {content}
        </a>
      );
    }
    
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default SidebarItem;
