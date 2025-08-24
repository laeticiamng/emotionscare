
import React, { useEffect } from 'react';
import Shell from '@/Shell';
import PrivacyDashboard from '@/components/privacy/PrivacyDashboard';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const PrivacySettingsPage: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Example of showing a toast when the page loads
    toast({
      title: "Page sécurisée",
      description: "Toutes vos interactions sur cette page sont protégées",
      variant: "default",
    });
  }, [toast]);

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PrivacyDashboard />
      </motion.div>
    </Shell>
  );
};

export default PrivacySettingsPage;
