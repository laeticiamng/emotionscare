
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import UnifiedFooterNav from '@/components/navigation/UnifiedFooterNav';

interface UnifiedSidebarProps {
  open?: boolean;
  onClose: () => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  open = false,
  onClose,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isCollapsed = !open && !isDesktop;
  
  // Handle closing the sidebar after clicking a navigation item
  const handleNavItemClick = () => {
    if (!isDesktop) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {open && !isDesktop && (
        <div 
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed z-30 top-14 h-[calc(100vh-3.5rem)] w-72 border-r bg-background transition-transform
          md:block md:static md:top-0 md:h-full md:w-64
          ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          {!isDesktop && (
            <div className="flex items-center justify-end p-2">
              <Button onClick={onClose} size="icon" variant="ghost">
                <X className="h-5 w-5" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
          )}
          
          {/* Navigation content */}
          <ScrollArea className="flex-1 py-2">
            <UnifiedNavigation collapsed={false} onItemClick={handleNavItemClick} />
          </ScrollArea>
          
          {/* Footer navigation */}
          <div className="mt-auto border-t p-4">
            <UnifiedFooterNav collapsed={false} onItemClick={handleNavItemClick} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default UnifiedSidebar;
