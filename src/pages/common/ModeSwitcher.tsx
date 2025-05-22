
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Building, User, Shield, ArrowLeft } from 'lucide-react';
import { logModeSelection } from '@/utils/modeSelectionLogger';
import { toast } from 'sonner';

const ModeSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { userMode, setUserMode } = useUserMode();
  const [selectedMode, setSelectedMode] = useState<string | null>(userMode);

  const handleModeSelect = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setSelectedMode(mode);
    
    // Log the selection
    logModeSelection(mode);
    
    // Update the user mode in context
    setUserMode(mode);
    
    // Redirect to appropriate dashboard
    if (mode === 'b2c') {
      navigate('/b2c/dashboard');
      toast.success('Mode Particulier activé');
    } else if (mode === 'b2b_user') {
      navigate('/b2b/user/dashboard');
      toast.success('Mode Collaborateur activé');
    } else if (mode === 'b2b_admin') {
      navigate('/b2b/admin/dashboard');
      toast.success('Mode Administrateur activé');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Choisissez votre mode d'utilisation</h1>
          <p className="text-muted-foreground mt-2">
            Sélectionnez le mode qui correspond à votre utilisation de EmotionsCare
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className={`cursor-pointer h-full ${selectedMode === 'b2c' ? 'border-primary' : ''}`} 
              onClick={() => handleModeSelect('b2c')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Particulier</CardTitle>
                <CardDescription>Accès à votre espace personnel</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Suivez votre bien-être émotionnel, votre journal et accédez à vos recommandations personnalisées.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant={selectedMode === 'b2c' ? 'default' : 'outline'} 
                  onClick={() => handleModeSelect('b2c')}
                  className="w-full"
                >
                  Sélectionner
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className={`cursor-pointer h-full ${selectedMode === 'b2b_user' ? 'border-primary' : ''}`} 
              onClick={() => handleModeSelect('b2b_user')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Collaborateur</CardTitle>
                <CardDescription>Accès à l'espace entreprise</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Suivez vos activités bien-être au sein de votre entreprise et participez aux programmes collectifs.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant={selectedMode === 'b2b_user' ? 'default' : 'outline'} 
                  onClick={() => handleModeSelect('b2b_user')}
                  className="w-full"
                >
                  Sélectionner
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className={`cursor-pointer h-full ${selectedMode === 'b2b_admin' ? 'border-primary' : ''}`} 
              onClick={() => handleModeSelect('b2b_admin')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Administrateur</CardTitle>
                <CardDescription>Gestion entreprise</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Gérez les utilisateurs, suivez les statistiques d'utilisation et paramétrez les fonctionnalités pour votre entreprise.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant={selectedMode === 'b2b_admin' ? 'default' : 'outline'} 
                  onClick={() => handleModeSelect('b2b_admin')}
                  className="w-full"
                >
                  Sélectionner
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModeSwitcher;
