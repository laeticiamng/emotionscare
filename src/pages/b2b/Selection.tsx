
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { changeUserMode } = useUserMode();
  
  const handleSelection = (mode: 'b2b_user' | 'b2b_admin') => {
    changeUserMode(mode);
    
    if (mode === 'b2b_user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sélectionnez votre mode d'accès</h1>
          <p className="text-muted-foreground mt-2">
            Choisissez le mode d'accès qui correspond à votre rôle dans l'entreprise
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelection('b2b_user')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl">Collaborateur</CardTitle>
                <CardDescription>
                  Accédez à votre espace collaborateur pour utiliser les services EmotionsCare
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">Pour les employés utilisateurs de la plateforme</p>
                  <ul className="text-sm space-y-1 text-start">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Accès aux outils personnels
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Participation aux séances collectives
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Suivi de votre bien-être
                    </li>
                  </ul>
                </div>
                <Button className="w-full" onClick={() => handleSelection('b2b_user')}>
                  Accéder en tant que collaborateur
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelection('b2b_admin')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl">Administrateur</CardTitle>
                <CardDescription>
                  Gérez votre espace EmotionsCare et les accès utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">Pour les responsables et administrateurs</p>
                  <ul className="text-sm space-y-1 text-start">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Gestion des utilisateurs
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Configuration des accès
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Rapports et statistiques
                    </li>
                  </ul>
                </div>
                <Button className="w-full" variant="secondary" onClick={() => handleSelection('b2b_admin')}>
                  Accéder en tant qu'administrateur
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BSelection;
