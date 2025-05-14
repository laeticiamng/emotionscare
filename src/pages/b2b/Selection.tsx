
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building } from 'lucide-react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const Selection = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-gray-900 dark:to-blue-900/20">
        {/* Background subtle animation */}
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

        <div className="container max-w-3xl z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Espace Entreprise</h1>
            <p className="text-lg text-muted-foreground">
              Sélectionnez votre type d'accès
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-blue-200 dark:border-blue-900/50">
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
                  onClick={() => navigate('/b2b/user/login')} 
                  size="lg" 
                  variant="default"
                  className="w-full"
                >
                  Espace Collaborateur
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-purple-200 dark:border-purple-900/50">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
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
                  onClick={() => navigate('/b2b/admin/login')} 
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  Espace Administration
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              Retour à l'accueil
            </Button>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default Selection;
