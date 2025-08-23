import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import SafeLiveUXMonitor from '@/components/ux/SafeLiveUXMonitor';
import EnhancedNavigation from '@/components/ui/enhanced-navigation';
import { EnhancedSkipLinks, AccessibilityPanel, ScreenReaderAnnouncer } from '@/components/ui/enhanced-accessibility';
import { PerformanceIndicator } from '@/components/ui/enhanced-performance';
import { ScrollToTop } from '@/components/ui/enhanced-user-experience';
import EnhancedFooter from '@/components/ui/enhanced-footer';

const Layout: React.FC = () => {
  return (
    <>
      <EnhancedSkipLinks />
      <ScreenReaderAnnouncer />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10" data-testid="page-root">
        <EnhancedNavigation />
        
        <main id="main-content" className="flex-1 pt-16">
          <Outlet />
        </main>
        
        <EnhancedFooter />
        
        {/* Enhanced UX Components */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'bg-background border border-border',
            duration: 4000,
          }}
        />
        <SafeLiveUXMonitor />
        <PerformanceIndicator />
        <ScrollToTop />
        <AccessibilityPanel />
      </div>
    </>
  );
};

export default Layout;
