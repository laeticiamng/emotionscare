
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  const handleRoleSelect = (role: 'b2b_user' | 'b2b_admin') => {
    setUserMode(role);
    
    if (role === 'b2b_user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
    
    toast.success(`Mode ${role === 'b2b_user' ? 'collaborateur' : 'administrateur'} sélectionné`);
  };
  
  return (
    <AuthLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl font-bold mb-4">Bienvenue sur EmotionsCare Pro</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Sélectionnez votre rôle pour accéder à l'interface adaptée à vos besoins
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 flex flex-row items-center gap-4">
                  <div className="p-2 rounded-full bg-background/80 backdrop-blur">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Collaborateur</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-base min-h-[100px]">
                    Accédez à l'espace dédié aux collaborateurs pour bénéficier des outils de bien-être émotionnel et 
                    des ressources partagées de votre organisation.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleRoleSelect('b2b_user')}
                    variant="outline"
                    className="w-full"
                  >
                    Accéder à l'espace collaborateur
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300 flex flex-row items-center gap-4">
                  <div className="p-2 rounded-full bg-background/80 backdrop-blur">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Administrateur</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-base min-h-[100px]">
                    Accédez au panneau d'administration pour gérer les utilisateurs, analyser les données de bien-être 
                    de votre organisation et configurer les outils disponibles.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleRoleSelect('b2b_admin')}
                    variant="outline"
                    className="w-full"
                  >
                    Accéder à l'espace administrateur
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
          </motion.div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default B2BSelection;
