
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import B2BAdminNavBar from '@/components/navigation/B2BAdminNavBar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BAdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user has admin rights
    if (!isLoading && user && user.role !== 'b2b_admin' && user.role !== 'admin') {
      toast({
        title: "Accès non autorisé",
        description: "Vous n'avez pas les droits d'accès pour cette section",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }
  
  // Redirect if no user or missing admin role
  if (!user || (user.role !== 'b2b_admin' && user.role !== 'admin')) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-background">
      {/* Sidebar / Navigation */}
      <motion.div 
        className="hidden md:block w-64 flex-shrink-0 border-r"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <B2BAdminNavBar />
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header 
          className="flex h-16 items-center border-b px-6 bg-background dark:bg-background shadow-sm"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1">
            {user && (
              <div>
                <h1 className="text-xl font-semibold">
                  Administration
                </h1>
                <p className="text-sm text-muted-foreground">
                  {user.name} - {user.role === 'admin' ? 'Administrateur' : 'RH'}
                </p>
              </div>
            )}
          </div>
          <ModeToggle />
        </motion.header>
        
        <motion.main 
          className="flex-1 overflow-auto p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default B2BAdminLayout;
