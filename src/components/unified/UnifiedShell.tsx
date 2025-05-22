
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UnifiedHeader from './UnifiedHeader';
import UnifiedSidebar from './UnifiedSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface UnifiedShellProps {
  children: React.ReactNode;
}

const UnifiedShell: React.FC<UnifiedShellProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Simplified way to determine if sidebar should be visible based on path
  const isPathWithSidebar = !location.pathname.includes('/login') && 
                            !location.pathname.includes('/register') && 
                            location.pathname !== '/' &&
                            location.pathname !== '/landing';

  return (
    <div className="min-h-screen flex flex-col">
      <UnifiedHeader />
      
      <div className="flex flex-1 w-full">
        {isPathWithSidebar && !isMobile && (
          <UnifiedSidebar />
        )}
        
        <div className={cn(
          "flex-1",
          isPathWithSidebar && !isMobile ? "ml-64" : ""
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default UnifiedShell;
