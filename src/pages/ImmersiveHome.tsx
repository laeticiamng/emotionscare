
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { Heart, Brain, Building, User, Music } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const redirectToLogin = () => {
    navigate('/b2c/login');
  };

  const handleExplore = () => {
    if (isAuthenticated) {
      navigate('/b2c/dashboard');
    } else {
      navigate('/b2c/login');
    }
  };

  const handleBusiness = () => {
    navigate('/b2b/selection');
  };

  return (
    <Shell>
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 -z-10"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Prenez soin de votre bien-être émotionnel
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
              Une approche complète pour gérer vos émotions, réduire le stress et améliorer votre qualité de vie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleExplore}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 text-lg h-12"
              >
                {isAuthenticated ? 'Accéder à mon espace' : 'Commencer maintenant'}
              </Button>
              <Button
                onClick={handleBusiness}
                size="lg"
                variant="outline"
                className="px-8 text-lg h-12"
              >
                Espace Entreprise
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {[
              { icon: Heart, label: "Bien-être", color: "text-red-500" },
              { icon: Brain, label: "Mindfulness", color: "text-purple-500" },
              { icon: Music, label: "Musicothérapie", color: "text-blue-500" },
              { icon: User, label: "Coach IA", color: "text-green-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.6 }}
                className="flex flex-col items-center p-4"
              >
                <div className={`w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center mb-4 ${item.color}`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Decorative circles */}
        <div className="hidden md:block absolute top-20 left-10 w-64 h-64 bg-blue-300/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-72 h-72 bg-indigo-300/10 dark:bg-indigo-400/5 rounded-full blur-3xl"></div>
      </section>
      
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-4"
            >
              Découvrez nos solutions
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 shadow-md"
            >
              <User className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Particuliers</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Accédez à des outils personnalisés pour comprendre et gérer vos émotions au quotidien.
              </p>
              <Button onClick={redirectToLogin}>Voir les offres</Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-8 shadow-md"
            >
              <Building className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Entreprises</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Solutions complètes pour améliorer le bien-être émotionnel au sein de votre organisation.
              </p>
              <Button onClick={handleBusiness} variant="secondary">Découvrir</Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Shell>
  );
};

export default ImmersiveHome;
