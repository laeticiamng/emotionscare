// @ts-nocheck

import React from 'react';
import { cn } from '@/lib/utils';

interface NavbarBadgeProps {
  badgesCount: number;
  className?: string;
}

const NavbarBadge: React.FC<NavbarBadgeProps> = ({ badgesCount, className }) => {
  if (badgesCount <= 0) {
    return null;
  }
  
  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full",
        className
      )}
    >
      {badgesCount > 9 ? '9+' : badgesCount}
    </span>
  );
};

export default NavbarBadge;
