
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Shield, ArrowLeft } from 'lucide-react';
import Shell from '@/Shell';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleUserChoice = () => {
    setUserMode('b2b_user');
    navigate('/login-collaborateur');
  };
  
  const handleAdminChoice = () => {
    setUserMode('b2b_admin');
    navigate('/login-admin');
  };
  
  return (
    <Shell>
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Espace Entreprise</h1>
            <p className="text-muted-foreground">
              Sélectionnez le type d'accès dont vous avez besoin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleUserChoice}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Espace Collaborateur</CardTitle>
                <CardDescription>Accès aux outils de bien-être émotionnel</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Utilisez cet espace pour accéder à vos ressources personnalisées</p>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button variant="outline">Accéder</Button>
              </CardFooter>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleAdminChoice}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">Espace Administrateur</CardTitle>
                <CardDescription>Gestion des équipes et des ressources</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Gérez les utilisateurs, suivez les métriques et configurez la plateforme</p>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button variant="outline">Accéder</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default B2BSelection;
