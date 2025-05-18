
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const B2BSelectionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users directly to their dashboard
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const role = user.role?.toLowerCase();
    if (role === 'b2b_admin') {
      navigate('/b2b/admin/dashboard', { replace: true });
    } else if (role === 'b2b_user') {
      navigate('/b2b/user/dashboard', { replace: true });
    } else {
      navigate('/b2c/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleUserAccess = () => {
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    localStorage.setItem('userMode', 'b2b_user');
    navigate('/b2b/user/login');
  };

  const handleAdminAccess = () => {
    // Feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    localStorage.setItem('userMode', 'b2b_admin');
    navigate('/b2b/admin/login');
  };

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Shell hideNav>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-gray-900 dark:to-blue-900/20">
        {/* Arrière-plan subtil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-200 to-transparent rounded-full filter blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-200 to-transparent rounded-full filter blur-3xl"
          />
        </div>

        <motion.div 
          className="container max-w-3xl z-10 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Espace Entreprise
            </h1>
            <p className="text-lg text-blue-800/70 dark:text-blue-300/70">
              Sélectionnez votre type d'accès
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6"
            variants={itemVariants}
          >
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Collaborateur</CardTitle>
                <CardDescription className="text-center">
                  Accès aux outils de bien-être personnel
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Journal émotionnel personnel</li>
                  <li>• Musicothérapie personnalisée</li>
                  <li>• Coaching IA adapté au travail</li>
                  <li>• Suivi de votre bien-être</li>
                </ul>
                
                <Button 
                  onClick={handleUserAccess} 
                  size="lg" 
                  variant="default"
                  className="w-full group"
                >
                  Espace Collaborateur
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Administration / RH</CardTitle>
                <CardDescription className="text-center">
                  Gestion d'équipe et analyse collective
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tableau de bord analytique</li>
                  <li>• Monitoring d'équipe anonymisé</li>
                  <li>• Organisation d'événements</li>
                  <li>• Rapports et tendances</li>
                </ul>
                
                <Button 
                  onClick={handleAdminAccess} 
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 group"
                >
                  Espace Administration
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-blue-700/70 dark:text-blue-400/70 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default B2BSelectionPage;
