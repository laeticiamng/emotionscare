
import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarContext';

interface SidebarItemProps {
  icon?: React.ReactNode;
  title: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  badge?: React.ReactNode;
}

export function SidebarItem({
  icon,
  title,
  active,
  href,
  onClick,
  children,
  disabled,
  badge
}: SidebarItemProps) {
  const { collapsed } = useSidebar();

  return (
    <li className={cn("relative", disabled && "opacity-60 pointer-events-none")}>
      <a
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 rounded-md p-2 text-sm font-semibold transition-colors hover:bg-secondary/50",
          active && "bg-secondary/50",
          !collapsed && "justify-center",
          disabled && "cursor-not-allowed opacity-60 hover:bg-transparent"
        )}
      >
        {icon}
        {(!collapsed || (!icon && !collapsed)) && <span>{title}</span>}
        {badge && <span className="ml-auto">{badge}</span>}
      </a>
      {children}
    </li>
  );
}
