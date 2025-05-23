
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User, Building2, ShieldCheck } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { changeUserMode } = useUserMode();
  
  const handleModeSelection = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    changeUserMode(mode);
    
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else if (mode === 'b2b_user') {
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
        staggerChildren: 0.15
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bienvenue sur EmotionsCare</h1>
          <p className="text-muted-foreground mt-2">
            Choisissez votre mode d'accès à la plateforme
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleModeSelection('b2c')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl">Particulier</CardTitle>
                <CardDescription>
                  Accès personnel à la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">Pour les utilisateurs individuels</p>
                  <ul className="text-sm space-y-1 text-start">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Outils de bien-être personnel
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Analyse émotionnelle
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Coach virtuel
                    </li>
                  </ul>
                </div>
                <Button className="w-full" onClick={() => handleModeSelection('b2c')}>
                  Continuer comme particulier
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleModeSelection('b2b_user')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl">Collaborateur</CardTitle>
                <CardDescription>
                  Accès collaborateur entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">Pour les employés d'entreprise</p>
                  <ul className="text-sm space-y-1 text-start">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Outils de bien-être pro
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Activités d'équipe
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Suivi de performance
                    </li>
                  </ul>
                </div>
                <Button className="w-full" variant="secondary" onClick={() => handleModeSelection('b2b_user')}>
                  Continuer comme collaborateur
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleModeSelection('b2b_admin')}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl">Administrateur</CardTitle>
                <CardDescription>
                  Gestion de l'espace entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">Pour les responsables d'entreprise</p>
                  <ul className="text-sm space-y-1 text-start">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Admin du compte
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Gestion d'équipe
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">✓</span> Rapports avancés
                    </li>
                  </ul>
                </div>
                <Button className="w-full" variant="outline" onClick={() => handleModeSelection('b2b_admin')}>
                  Continuer comme administrateur
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
