
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
}

const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({ 
  children, 
  className = "", 
  asChild = false,
  onClick
}) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp 
      className={`flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </Comp>
  );
};

export default SidebarMenuButton;
