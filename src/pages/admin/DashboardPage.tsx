
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedAdminDashboard from '@/components/dashboard/admin/EnhancedAdminDashboard';
import { SegmentProvider } from '@/contexts/SegmentContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Helmet } from 'react-helmet';

const AdminDashboardPage: React.FC = () => {
  const { setUserMode } = useUserMode();
  
  // Set user mode to b2b-admin
  useEffect(() => {
    setUserMode('b2b-admin');
  }, [setUserMode]);
  
  return (
    <>
      <Helmet>
        <title>Dashboard Administrateur | EmotionsCare</title>
      </Helmet>
      
      <motion.div 
        className="container mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SegmentProvider>
          <EnhancedAdminDashboard />
        </SegmentProvider>
      </motion.div>
    </>
  );
};

export default AdminDashboardPage;
