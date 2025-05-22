
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { changeUserMode } = useUserMode();
  
  const handleUserSelect = () => {
    changeUserMode('b2b_user');
    navigate('/b2b/user/login');
  };
  
  const handleAdminSelect = () => {
    changeUserMode('b2b_admin');
    navigate('/b2b/admin/login');
  };
  
  const handleBackToPersonal = () => {
    changeUserMode('b2c');
    navigate('/b2c/login');
  };
  
  return (
    <Shell showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Sélection du mode Entreprise</h1>
            <p className="text-muted-foreground mt-2">
              Choisissez le mode d'accès qui correspond à votre rôle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    Accès Collaborateur
                  </CardTitle>
                  <CardDescription>
                    Pour les membres d'équipe souhaitant accéder aux outils de bien-être
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <p>En tant que collaborateur, vous pourrez :</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Accéder à votre journal émotionnel
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Utiliser les outils de bien-être personnels
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Participer aux activités d'équipe
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Suivre votre progression
                    </li>
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleUserSelect}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Accès Collaborateur
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    Accès Administrateur
                  </CardTitle>
                  <CardDescription>
                    Pour les gestionnaires et responsables d'équipes
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <p>En tant qu'administrateur, vous pourrez :</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Gérer les équipes et les utilisateurs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Accéder aux analytiques d'équipe
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Planifier des sessions collectives
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      Générer des rapports de bien-être
                    </li>
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleAdminSelect}
                    className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                  >
                    Accès Administrateur
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Button variant="link" onClick={handleBackToPersonal}>
              Revenir à l'accès particulier
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default B2BSelection;
