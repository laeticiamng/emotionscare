
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building } from 'lucide-react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToB2C = () => {
    navigate('/b2c/login');
  };

  const handleNavigateToB2B = () => {
    navigate('/b2b/selection');
  };

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">EmotionsCare</h1>
          <p className="text-xl text-muted-foreground">
            Votre plateforme de bien-être émotionnel
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-center">Espace Personnel</CardTitle>
                <CardDescription className="text-center">
                  Pour les particuliers souhaitant prendre soin de leur bien-être émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span> Journal émotionnel personnel
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span> Musicothérapie adaptative
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span> Scan émotionnel quotidien
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span> Coach IA personnalisé
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNavigateToB2C} className="w-full">
                  Accéder à l'espace personnel
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-center">Espace Entreprise</CardTitle>
                <CardDescription className="text-center">
                  Pour les collaborateurs et les responsables bien-être en entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span> Bien-être émotionnel au travail
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span> Suivi anonymisé des équipes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span> Coaching pro adapté
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span> Défis collaboratifs positifs
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNavigateToB2B} variant="outline" className="w-full border-blue-300 dark:border-blue-800">
                  Accéder à l'espace entreprise
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default Home;
