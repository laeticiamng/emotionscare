
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SegmentProvider } from '@/contexts/SegmentContext';
import AdminPremiumInterface from '@/components/admin/premium/AdminPremiumInterface';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

const AdminPremiumDashboard: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive"
      });
      navigate('/login');
    } else if (user?.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Cette page est réservée aux administrateurs",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, navigate, toast]);
  
  // Hide welcome message after 3 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);
  
  if (isLoading) {
    return <LoadingIllustration />;
  }
  
  return (
    <SegmentProvider>
      <div className="min-h-screen bg-background">
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="text-center"
              >
                <h1 className="text-4xl font-light text-white">
                  <span className="font-semibold">EmotionsCare</span> Administration
                </h1>
                <p className="text-xl text-gray-300 mt-2">
                  Console de pilotage émotionnelle
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AdminPremiumInterface user={user} />
      </div>
    </SegmentProvider>
  );
};

export default AdminPremiumDashboard;
