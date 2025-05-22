
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      <div className="absolute top-0 right-0 p-4 z-10">
        {isAuthenticated ? (
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="shadow-sm"
          >
            Mon tableau de bord
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/b2c/login')}
              variant="outline"
              className="shadow-sm"
            >
              Connexion
            </Button>
            <Button 
              onClick={() => navigate('/b2c/register')}
              className="shadow-sm"
            >
              Inscription
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex-1 container mx-auto px-4 pt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-800 dark:text-blue-300 mb-6">
              Prenez soin de votre <span className="text-blue-600 dark:text-blue-400">bien-être émotionnel</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-700/80 dark:text-blue-400/80 max-w-3xl mx-auto mb-8">
              Découvrez comment notre plateforme utilise l'intelligence artificielle pour analyser vos émotions et vous proposer des solutions personnalisées.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/b2c/login')}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-6 text-lg"
              >
                Commencer maintenant
              </Button>
              <Button 
                onClick={() => navigate('/b2b/selection')}
                variant="outline" 
                size="lg"
                className="border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-8 py-6 text-lg"
              >
                Solutions entreprise
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Découvrez nos fonctionnalités</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Journal émotionnel",
                  description: "Suivez et analysez l'évolution de vos émotions au quotidien",
                  path: "/b2c/journal",
                  color: "bg-blue-50 dark:bg-blue-900/30"
                },
                {
                  title: "Coach virtuel",
                  description: "Bénéficiez de conseils personnalisés pour améliorer votre bien-être",
                  path: "/b2c/coach",
                  color: "bg-green-50 dark:bg-green-900/30"
                },
                {
                  title: "Musicothérapie",
                  description: "Des sélections musicales adaptées à votre humeur",
                  path: "/b2c/music",
                  color: "bg-purple-50 dark:bg-purple-900/30"
                },
                {
                  title: "Méditations guidées",
                  description: "Apprenez à vous recentrer et à gérer votre stress",
                  path: "/b2c/audio",
                  color: "bg-amber-50 dark:bg-amber-900/30"
                },
                {
                  title: "Analyse d'équipe",
                  description: "Suivez le bien-être collectif de votre organisation",
                  path: "/b2b/selection",
                  color: "bg-pink-50 dark:bg-pink-900/30"
                },
                {
                  title: "Sessions immersives",
                  description: "Expériences de relaxation en réalité virtuelle",
                  path: "/b2c/vr",
                  color: "bg-indigo-50 dark:bg-indigo-900/30"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  className={`${feature.color} p-6 rounded-xl hover:shadow-md transition-shadow`}
                >
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button 
                    variant="link" 
                    className="p-0 flex items-center"
                    onClick={() => navigate(feature.path)}
                  >
                    Découvrir <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="my-20 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Choisissez votre mode d'accès</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              EmotionsCare s'adapte à vos besoins, que vous soyez un particulier ou une entreprise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/b2c/login')}
                size="lg"
                className="min-w-[200px]"
              >
                Particulier
              </Button>
              <Button 
                onClick={() => navigate('/b2b/selection')}
                variant="outline" 
                size="lg"
                className="min-w-[200px]"
              >
                Entreprise
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default ImmersiveHome;
