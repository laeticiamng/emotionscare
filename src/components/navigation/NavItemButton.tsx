
import React from 'react';
import { cn } from '@/lib/utils';

interface NavItemButtonProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  collapsed?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const NavItemButton: React.FC<NavItemButtonProps> = ({
  label,
  path,
  icon,
  collapsed = false,
  active = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center w-full py-2 px-3 rounded-md text-sm transition-colors",
        active ? 
          "bg-primary/10 text-primary font-medium" : 
          "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span className={cn("mr-3", collapsed ? "mr-0" : "")}>
        {icon}
      </span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
};

export default NavItemButton;
