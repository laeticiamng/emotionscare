
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItemButtonProps {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed?: boolean;
  onClick: () => void;
  active?: boolean;
}

const NavItemButton: React.FC<NavItemButtonProps> = ({
  label,
  icon: Icon,
  collapsed = false,
  onClick,
  active = false
}) => {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className={cn(
        "w-full justify-start",
        collapsed && "justify-center px-2"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
      {!collapsed && <span>{label}</span>}
    </Button>
  );
};

export default NavItemButton;
