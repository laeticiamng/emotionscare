
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { HealthBadge } from '@/components/system/HealthBadge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { DeletePendingBanner } from '@/components/account/DeletePendingBanner';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { cn } from '@/lib/utils';
import { FeedbackFab } from '@/components/feedback/FeedbackFab';
import { FeedbackModal } from '@/components/feedback/FeedbackModal';

const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { status: accountStatus } = useAccountDeletion();

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 w-full">
      {/* Delete Pending Banner */}
      {accountStatus === 'soft_deleted' && <DeletePendingBanner />}
      
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur border-b header-safe-area">
        <div className="flex items-center justify-between h-full px-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="xl:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden xl:flex p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Collapse sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <HealthBadge />
            <Header />
          </div>
        </div>
      </header>

      <div className="flex w-full">
        {/* Desktop Sidebar */}
        <aside 
          className={cn(
            "hidden xl:block border-r bg-white h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <Sidebar collapsed={sidebarCollapsed} />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="xl:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setSidebarOpen(false)}>
            <aside className="absolute left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white shadow-xl border-r">
              <Sidebar collapsed={false} />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-w-0 transition-all duration-300",
          "pt-0" // No padding-top since header is sticky
        )}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-6 py-8"
          >
            <EnhancedErrorBoundary>
              <React.Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <Outlet />
              </React.Suspense>
            </EnhancedErrorBoundary>
          </motion.div>
        </main>
      </div>
      
      <Footer />

      {/* Feedback System */}
      <FeedbackFab />
      <FeedbackModal />
    </div>
  );
};

export { AppShell };
export default AppShell;
