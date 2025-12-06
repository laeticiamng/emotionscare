import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface SidebarNavItemProps {
  href: string;
  icon?: LucideIcon;
  title: string;
  active?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
  external?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  href,
  icon: Icon,
  title,
  active,
  onClick,
  badge,
  external,
  className,
  children,
}) => {
  const classes = cn(
    'flex items-center py-2 px-3 text-sm rounded-md',
    'transition-colors duration-200',
    active
      ? 'bg-accent text-accent-foreground font-medium'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        <span className="flex-grow">{title}</span>
        {badge && <span className="ml-auto">{badge}</span>}
      </a>
    );
  }

  return (
    <Link to={href} className={classes} onClick={onClick}>
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      <span className="flex-grow">{title}</span>
      {badge && <span className="ml-auto">{badge}</span>}
      {children}
    </Link>
  );
};

interface SidebarNavProps {
  items: SidebarNavItemProps[];
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items, className }) => {
  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item, index) => (
        <SidebarNavItem key={index} {...item} />
      ))}
    </nav>
  );
};

export { SidebarNav, SidebarNavItem };
export default SidebarNav;
