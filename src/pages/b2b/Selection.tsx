
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Building2, User } from 'lucide-react';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleUserSelection = () => {
    navigate('/b2b/user/login');
  };

  const handleAdminSelection = () => {
    navigate('/b2b/admin/login');
  };

  const handlePersonalSelection = () => {
    navigate('/b2c/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold">Choisissez votre type d&apos;accès</h1>
          <p className="text-muted-foreground mt-2">
            Sélectionnez le type d&apos;accès qui correspond à votre profil
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Particulier</CardTitle>
                <CardDescription>
                  Accès personnel pour les particuliers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-6">
                  Idéal pour les utilisateurs individuels qui souhaitent améliorer leur bien-être émotionnel.
                </p>
                <Button onClick={handlePersonalSelection} className="w-full">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Collaborateur</CardTitle>
                <CardDescription>
                  Accès pour les membres d&apos;une entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-6">
                  Pour les employés qui participent au programme de bien-être émotionnel de leur entreprise.
                </p>
                <Button onClick={handleUserSelection} className="w-full" variant="default">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Administrateur</CardTitle>
                <CardDescription>
                  Accès pour les gestionnaires RH
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-6">
                  Pour les responsables RH qui gèrent le bien-être des équipes et accèdent aux statistiques.
                </p>
                <Button onClick={handleAdminSelection} className="w-full">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelection;
