
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, ArrowLeft, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'user' | 'admin') => {
    if (role === 'user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">EmotionsCare Entreprise</CardTitle>
            <CardDescription className="text-lg">
              Sélectionnez votre type d'accès professionnel
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Collaborateur */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Collaborateur</CardTitle>
                <CardDescription>
                  Accédez à votre espace personnel au sein de l'organisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Suivi personnel du bien-être</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Analyses émotionnelles privées</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Participation aux initiatives équipe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Ressources et conseils personnalisés</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => handleRoleSelection('user')}
                    className="w-full"
                    size="lg"
                  >
                    Accéder en tant que collaborateur
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/b2b/user/register')}
                    className="text-sm"
                  >
                    Pas encore de compte ? S'inscrire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Administrateur */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Administrateur</CardTitle>
                <CardDescription>
                  Gérez EmotionsCare pour votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm">Tableau de bord global</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm">Gestion des utilisateurs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm">Analytics et rapports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm">Configuration système</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={() => handleRoleSelection('admin')}
                    className="w-full"
                    size="lg"
                    variant="default"
                  >
                    Accéder à l'administration
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Accès restreint aux administrateurs autorisés
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Retour */}
        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la sélection du mode
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BSelection;
