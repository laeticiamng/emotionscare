
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';

interface SidebarHeaderProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onCollapse?: () => void;
  showCollapseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  title,
  icon,
  onCollapse,
  showCollapseButton = true,
  className,
  children,
}) => {
  return (
    <div className={cn('flex items-center p-4', className)}>
      {icon && <div className="mr-2">{icon}</div>}
      
      {title && (
        <div className="font-medium text-lg flex-grow truncate">{title}</div>
      )}
      
      {children}
      
      {showCollapseButton && onCollapse && (
        <button
          onClick={onCollapse}
          className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Réduire la barre latérale"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export { SidebarHeader };
export default SidebarHeader;
