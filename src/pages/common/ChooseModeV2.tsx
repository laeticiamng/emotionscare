
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building, Shield } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const ChooseModeV2: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const { user } = useAuth();
  
  const handleChooseMode = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    setUserMode(mode);
    toast({
      title: "Mode sélectionné",
      description: `Vous utilisez maintenant EmotionCare en mode ${
        mode === 'b2c' ? 'Personnel' : 
        mode === 'b2b_user' ? 'Collaborateur' : 
        'Administrateur'
      }.`,
    });
    
    // Redirection vers la bonne page selon le mode
    switch(mode) {
      case 'b2b_admin':
        navigate('/b2b/admin/dashboard');
        break;
      case 'b2b_user':
        navigate('/b2b/user/dashboard');
        break;
      default:
        navigate('/b2c/dashboard');
        break;
    }
  };

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div 
          className="max-w-4xl w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choisissez votre mode d'utilisation</h1>
            <p className="text-muted-foreground">
              Comment souhaitez-vous utiliser EmotionsCare aujourd'hui ?
            </p>
            {user && (
              <p className="mt-2 text-sm font-medium text-primary">
                Connecté en tant que: {user.name || user.email}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full" 
                onClick={() => handleChooseMode('b2c')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto flex items-center justify-center mb-2">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Mode Personnel</CardTitle>
                  <CardDescription>Particulier</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-muted-foreground">
                    Accédez à votre espace personnel pour gérer votre bien-être émotionnel.
                  </p>
                  <Button variant="outline" className="w-full">Choisir</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full" 
                onClick={() => handleChooseMode('b2b_user')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center mb-2">
                    <Building className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>Mode Professionnel</CardTitle>
                  <CardDescription>Collaborateur</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-muted-foreground">
                    Accédez aux outils de bien-être et d'analyse émotionnelle en milieu professionnel.
                  </p>
                  <Button variant="outline" className="w-full">Choisir</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer h-full" 
                onClick={() => handleChooseMode('b2b_admin')}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto flex items-center justify-center mb-2">
                    <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Mode Administration</CardTitle>
                  <CardDescription>RH / Manager</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-6 text-muted-foreground">
                    Accédez aux outils de gestion d'équipe, analytiques et rapports.
                  </p>
                  <Button variant="outline" className="w-full">Choisir</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default ChooseModeV2;
