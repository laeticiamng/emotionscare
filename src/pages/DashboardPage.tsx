
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import B2CDashboardPage from './b2c/DashboardPage';
import AdminDashboardPage from './admin/DashboardPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MusicProvider } from '@/contexts/music/index';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLoading from '@/components/ui/dashboard/DashboardLoading';
import DashboardError from '@/components/ui/dashboard/DashboardError';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Simulate dashboard data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 1000); // Short artificial delay for a better experience
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    // Simulate retry loading
    setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 1500);
  };
  
  const renderDashboard = () => {
    if (!user) {
      return <WelcomeDashboard />;
    }
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboardPage />;
      case 'b2c':
        return <B2CDashboardPage />;
      case 'b2b_user':
        return <B2BUserDashboard />;
      case 'b2b_admin':
        return <B2BAdminDashboard />;
      default:
        return <B2CDashboardPage />;
    }
  };
  
  return (
    <MusicProvider>
      <div className="container mx-auto py-6 px-4">
        <AnimatePresence mode="wait">
          {isLoading && (
            <DashboardLoading message="Préparation de votre tableau de bord..." />
          )}
          
          {error && (
            <DashboardError 
              message={error} 
              onRetry={handleRetry}
            />
          )}
          
          {!isLoading && !error && showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                staggerChildren: 0.1
              }}
            >
              {renderDashboard()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MusicProvider>
  );
};

// Default welcome dashboard
const WelcomeDashboard: React.FC = () => {
  return (
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur EmotionsCare</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connectez-vous pour commencer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Pour accéder à toutes les fonctionnalités d'EmotionsCare, veuillez vous connecter ou créer un compte.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Dashboard for B2B users
const B2BUserDashboard: React.FC = () => {
  return (
    <div>
      <motion.h1 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Espace Collaborateur
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mon état émotionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Visualisation de votre état émotionnel au fil du temps.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mes objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Suivi de vos objectifs de bien-être.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Dashboard for B2B administrators
const B2BAdminDashboard: React.FC = () => {
  return (
    <div>
      <motion.h1 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dashboard Administrateur
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble de l'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Statistiques générales sur l'état émotionnel de l'équipe.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Signalements et alertes de bien-être.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Rapports et analyses détaillées.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
