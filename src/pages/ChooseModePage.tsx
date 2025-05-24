
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Building2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card>
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-fit">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-3xl font-bold">Bienvenue sur EmotionsCare</CardTitle>
            <CardDescription className="text-lg mt-2">
              Choisissez votre mode d'utilisation pour commencer votre parcours
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => navigate('/b2c/login')}
                variant="outline"
                className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all w-full"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Particulier</h3>
                  <p className="text-sm text-muted-foreground">
                    Accès personnel avec coaching IA, analyse émotionnelle et outils de bien-être
                  </p>
                  <div className="mt-3 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    3 jours gratuits
                  </div>
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => navigate('/b2b/selection')}
                variant="outline"
                className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all w-full"
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Entreprise</h3>
                  <p className="text-sm text-muted-foreground">
                    Solutions pour organisations avec gestion d'équipes et analytics avancés
                  </p>
                  <div className="mt-3 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                    Démonstration disponible
                  </div>
                </div>
              </Button>
            </motion.div>
          </CardContent>
          
          <div className="px-8 pb-8">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Nouveau ?</strong> Commencez par un compte particulier pour découvrir toutes les fonctionnalités d'EmotionsCare.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChooseModePage;
