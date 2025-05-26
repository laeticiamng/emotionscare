import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  isOpen,
  onToggle,
  className
}) => {
  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform bg-background border-r transition-transform duration-300 ease-in-out md:relative md:top-0 md:h-full md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          <div className="text-sm text-muted-foreground mb-4">Navigation principale</div>
          {/* Contenu de navigation sera ajouté ici */}
        </nav>
      </aside>
    </>
  );
};

export default UnifiedSidebar;
