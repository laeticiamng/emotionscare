
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Briefcase, Building2, ArrowLeft } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { motion } from 'framer-motion';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleSelectMode = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else if (mode === 'b2b_user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card>
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-3xl font-bold">Bienvenue sur EmotionsCare</CardTitle>
            <CardDescription className="text-lg mt-2">
              Choisissez comment vous souhaitez utiliser notre plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => handleSelectMode('b2c')}
                variant="outline"
                className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Particulier</h3>
                  <p className="text-sm text-muted-foreground">
                    Accédez à toutes les fonctionnalités personnalisables pour votre bien-être émotionnel
                  </p>
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => handleSelectMode('b2b_user')}
                variant="outline"
                className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Collaborateur</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilisez EmotionsCare dans le cadre de votre entreprise ou organisation
                  </p>
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => handleSelectMode('b2b_admin')}
                variant="outline"
                className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Administration</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérez EmotionsCare pour votre entreprise et accédez aux tableaux de bord
                  </p>
                </div>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChooseModePage;
