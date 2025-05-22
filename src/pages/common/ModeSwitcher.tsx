
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserMode } from '@/contexts/UserModeContext';
import { UserIcon, Users, Building2 } from 'lucide-react';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import { logModeSelection } from '@/utils/modeSelectionLogger';

const ModeSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode, userMode } = useUserMode();
  
  const handleModeSelect = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    localStorage.setItem('user-mode', mode);
    
    // Log mode selection for analytics
    logModeSelection(mode);
    
    // Navigate to appropriate dashboard
    navigate(getModeDashboardPath(mode));
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card p-6 rounded-lg shadow-md border"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Choisissez votre mode</h1>
          <p className="text-muted-foreground">
            Sélectionnez comment vous souhaitez utiliser l'application
          </p>
        </div>
        
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4"
              onClick={() => handleModeSelect('b2c')}
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Particulier</h3>
                  <p className="text-muted-foreground text-sm">
                    Accédez à votre espace personnel
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4"
              onClick={() => handleModeSelect('b2b_user')}
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Collaborateur</h3>
                  <p className="text-muted-foreground text-sm">
                    Accédez à votre espace collaborateur
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-4"
              onClick={() => handleModeSelect('b2b_admin')}
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Administrateur</h3>
                  <p className="text-muted-foreground text-sm">
                    Accédez à l'espace administrateur pour gérer votre organisation
                  </p>
                </div>
              </div>
            </Button>
          </motion.div>
        </div>
        
        <div className="text-center mt-6">
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm"
          >
            Retour à l'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModeSwitcher;
