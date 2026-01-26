import React, { useState, useEffect, lazy, Suspense, memo, useMemo, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import EnhancedHeader from './EnhancedHeader';
import SkipLinks from './SkipLinks';
import { cn } from '@/lib/utils';

// Lazy load non-critical components
const EnhancedFooter = lazy(() => import('./EnhancedFooter'));
const CommandMenu = lazy(() => import('./CommandMenu'));
const NotificationToast = lazy(() => import('./NotificationToast'));
const MainNavigationHub = lazy(() => import('@/components/navigation/MainNavigationHub'));
const InAppNotificationCenter = lazy(() => import('@/components/InAppNotificationCenter').then(m => ({ default: m.InAppNotificationCenter })));
const CrisisDetectionBanner = lazy(() => import('@/components/crisis/CrisisDetectionBanner'));

interface EnhancedShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  className?: string;
}

const EnhancedShell: React.FC<EnhancedShellProps> = memo(({
  children,
  hideNav = false,
  hideFooter = false,
  className = '',
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // Check once on mount
  const reduceMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  
  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
          }
          
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const progress = height ? Math.min(window.scrollY / height, 1) : 0;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Keyboard shortcuts - stable callback
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandMenuOpen(prev => !prev);
    }
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background",
      className
    )} data-testid="page-root">
      {/* Skip Links pour accessibilité */}
      <SkipLinks />
      
      {/* Scroll Progress Indicator - CSS-only transform for perf */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 origin-left will-change-transform"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Header - always rendered first for LCP */}
      {!hideNav && (
        <div id="main-navigation">
          <EnhancedHeader scrolled={scrolled} />
        </div>
      )}

      {/* Main Content - priority rendering */}
      <main id="main-content" className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 relative mt-16">
        {/* Content rendered immediately - no animation wrapper for faster FCP */}
        <div 
          className={cn(
            "w-full",
            reduceMotion ? "" : "animate-in fade-in duration-200"
          )}
        >
          {children || <Outlet />}
        </div>
      </main>

      {/* Defer non-critical UI with lower priority */}
      <Suspense fallback={null}>
        <CrisisDetectionBanner />
      </Suspense>

      {/* Footer - lazy loaded */}
      {!hideFooter && (
        <Suspense fallback={<div className="h-16" />}>
          <EnhancedFooter />
        </Suspense>
      )}

      {/* Deferred components - load after main content */}
      <Suspense fallback={null}>
        <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      </Suspense>
      
      <Suspense fallback={null}>
        <NotificationToast />
      </Suspense>
      
      <Suspense fallback={null}>
        <MainNavigationHub />
      </Suspense>
      
      <Suspense fallback={null}>
        <InAppNotificationCenter />
      </Suspense>
    </div>
  );
});

EnhancedShell.displayName = 'EnhancedShell';

export default EnhancedShell;