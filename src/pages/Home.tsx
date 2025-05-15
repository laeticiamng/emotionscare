
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { TimeBasedBackground } from '@/components/home/TimeBasedBackground';
import { Button } from '@/components/ui/button';
import { User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '@/components/home/immersive-home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <TimeBasedBackground>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight heading-elegant">
            Bienvenue dans votre espace de bien-être émotionnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explorez des outils et techniques conçus pour votre équilibre personnel et professionnel
          </p>
        </motion.div>
        
        {/* Main Access Options */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* B2C Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 dark:bg-blue-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Particulier</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                Accédez à votre espace personnel pour prendre soin de votre bien-être émotionnel
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => navigate('/b2c/login')}
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
                >
                  <User className="mr-2 h-5 w-5" />
                  Espace Particulier
                </Button>
              </div>
              {/* B2C Test Account */}
              <div className="mt-4 text-xs text-center text-muted-foreground">
                <p>Compte test: user@exemple.fr / admin</p>
              </div>
            </div>
            
            {/* B2B Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-purple-100 dark:bg-purple-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-10 w-10 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Entreprise</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                Solutions de bien-être émotionnel pour vos équipes et votre organisation
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => navigate('/b2b/selection')}
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-purple-500 text-purple-700 dark:border-purple-400 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 shadow-md"
                >
                  <Building className="mr-2 h-5 w-5" />
                  Espace Entreprise
                </Button>
              </div>
              {/* B2B Test Accounts */}
              <div className="mt-4 text-xs text-center text-muted-foreground">
                <p>Compte admin: admin@exemple.fr / admin</p>
                <p>Compte collaborateur: collaborateur@exemple.fr / admin</p>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Already authenticated users */}
        {isAuthenticated && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Bonjour, {user?.name || 'utilisateur'}
            </h2>
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              Accéder à mon tableau de bord
            </Button>
          </motion.div>
        )}
      </div>
    </TimeBasedBackground>
  );
};

export default Home;
