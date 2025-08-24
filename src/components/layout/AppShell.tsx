
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 pt-16 pl-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-6 py-8"
          >
            <EnhancedErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <Outlet />
              </Suspense>
            </EnhancedErrorBoundary>
          </motion.div>
        </main>
      </div>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export { AppShell };
export default AppShell;
