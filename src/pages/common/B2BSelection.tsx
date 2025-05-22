
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Building2, ShieldCheck, Users, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import { logModeSelection } from '@/utils/modeSelectionLogger';

const B2BSelection: React.FC = () => {
  const navigate = useNavigate();
  const { changeUserMode } = useUserMode();
  
  const handleRoleSelect = (role: 'b2b_user' | 'b2b_admin') => {
    changeUserMode(role);
    localStorage.setItem('userMode', role);
    
    // Log mode selection for analytics
    logModeSelection(role);
    
    // Redirect to appropriate login page
    if (role === 'b2b_admin') {
      navigate('/b2b/admin/login');
    } else {
      navigate('/b2b/user/login');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4">
      <div className="absolute top-6 left-6">
        <Button 
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Retour à l'accueil
        </Button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg border"
      >
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Solutions Entreprise</h1>
          <p className="text-muted-foreground mt-2">
            Sélectionnez votre rôle pour accéder à la plateforme
          </p>
        </div>
        
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4"
              onClick={() => handleRoleSelect('b2b_user')}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Collaborateur</h3>
                  <p className="text-muted-foreground text-sm">
                    Accédez à votre espace personnel de bien-être émotionnel
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4"
              onClick={() => handleRoleSelect('b2b_admin')}
            >
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full mr-4">
                  <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Administrateur</h3>
                  <p className="text-muted-foreground text-sm">
                    Gérez le bien-être de vos équipes et accédez aux analyses
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous êtes un particulier ? Accédez à votre espace personnel
            </p>
            <Button 
              variant="secondary"
              onClick={() => {
                changeUserMode('b2c');
                localStorage.setItem('userMode', 'b2c');
                logModeSelection('b2c');
                navigate('/b2c/login');
              }}
              className="w-full"
            >
              Espace particulier
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Besoin d'aide ? <Button variant="link" className="p-0" onClick={() => navigate('/support')}>Contactez-nous</Button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BSelection;
