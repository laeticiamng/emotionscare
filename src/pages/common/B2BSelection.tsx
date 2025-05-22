
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, BuildingCog, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold mb-4">Choisissez votre espace entreprise</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sélectionnez le type d'accès dont vous avez besoin pour votre espace professionnel.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    Espace Collaborateur
                  </CardTitle>
                  <CardDescription>
                    Accès aux fonctionnalités de bien-être et aux ressources partagées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Journal émotionnel personnel
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Accès aux ressources de l'entreprise
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Séances de relaxation et méditation
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Tableau de bord personnel
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/b2b/user/login')}
                    className="w-full"
                  >
                    Accéder à l'espace collaborateur
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="h-full transition-all hover:shadow-md border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BuildingCog className="mr-2 h-5 w-5 text-primary" />
                    Espace Administration
                  </CardTitle>
                  <CardDescription>
                    Gérez votre entreprise et suivez le bien-être de vos équipes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Gestion des utilisateurs
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Tableau de bord analytique
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Statistiques et rapports
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      Configuration des ressources
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => navigate('/b2b/admin/login')}
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10"
                  >
                    Accéder à l'administration
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="mb-4 text-muted-foreground">
              Vous êtes un particulier ? Accédez à votre espace personnel
            </p>
            <Button 
              variant="link" 
              onClick={() => navigate('/b2c/login')}
              className="flex items-center gap-2"
            >
              <UserCircle2 className="h-4 w-4" />
              Espace particulier
            </Button>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default B2BSelection;
