
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItemButtonProps {
  label: string;
  path: string;
  icon: React.ReactNode;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

const NavItemButton: React.FC<NavItemButtonProps> = ({
  label,
  path,
  icon,
  active = false,
  collapsed = false,
  onClick,
  variant = 'default',
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  const baseClasses = "flex items-center space-x-2 rounded-md px-3 py-2 transition-all";
  const activeClasses = variant === 'default'
    ? "bg-primary text-primary-foreground"
    : "bg-destructive text-destructive-foreground";
  const inactiveClasses = variant === 'default'
    ? "text-muted-foreground hover:bg-accent hover:text-foreground"
    : "text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20";
  
  const buttonContent = (
    <Link
      to={path}
      onClick={handleClick}
      className={cn(
        baseClasses,
        active ? activeClasses : inactiveClasses,
        collapsed && "justify-center"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
  
  if (collapsed) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mb-1"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full mb-1"
    >
      {buttonContent}
    </motion.div>
  );
};

export default NavItemButton;
