import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface SidebarItemProps {
  href: string;
  icon?: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ href, icon, title, active, disabled, external, className, onClick, children, ...props }, ref) => {
    const linkContent = (
      <div
        className={cn(
          'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
          active && 'bg-accent',
          disabled && 'pointer-events-none opacity-60',
          className
        )}
      >
        {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
        <span>{title}</span>
        {children}
      </div>
    );

    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(disabled && 'pointer-events-none')}
          onClick={onClick}
          {...props}
        >
          {linkContent}
        </a>
      );
    }

    return (
      <NavLink
        ref={ref}
        to={href}
        className={({ isActive }) =>
          cn(
            isActive && 'bg-accent',
            disabled && 'pointer-events-none'
          )
        }
        onClick={onClick}
        {...props}
      >
        {linkContent}
      </NavLink>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';
