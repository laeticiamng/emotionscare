
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  href,
  children,
  active = false,
  disabled = false,
  icon,
  onClick,
  className = ""
}) => {
  const baseClasses = cn(
    'flex items-center py-2 px-3 rounded-md text-sm transition-colors',
    active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  );
  
  if (disabled) {
    return (
      <div className={baseClasses}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    );
  }
  
  return (
    <Link 
      to={href} 
      className={baseClasses}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
};

export default SidebarNavItem;
