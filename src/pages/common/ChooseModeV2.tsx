
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Building, Shield } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Shell from '@/Shell';
import { PageTransition } from '@/components/transitions/PageTransition';

const ChooseModeV2: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const handleChooseMode = (mode: 'b2c' | 'b2b_user' | 'b2b_admin') => {
    // Set the selected card for animation
    setSelectedCard(mode);
    
    // Set the user mode
    setUserMode(mode);
    
    // Show toast with animated variant
    toast({
      title: "Mode sélectionné",
      description: `Vous utilisez maintenant EmotionCare en mode ${
        mode === 'b2c' ? 'Personnel' : 
        mode === 'b2b_user' ? 'Collaborateur' : 
        'Administrateur'
      }.`,
    });
    
    // Add a slight delay before redirecting for animation effect
    setTimeout(() => {
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
    }, 300);
  };

  // Animation variants for cards
  const cardVariants = {
    init: { opacity: 0, y: 20 },
    animate: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }),
    hover: { 
      y: -8, 
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
    },
    tap: { scale: 0.98 },
    selected: { 
      scale: 1.03, 
      y: -10, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: 'spring', stiffness: 400, damping: 15 }
    },
    exit: (mode: string) => ({
      opacity: selectedCard === mode ? 1 : 0,
      y: selectedCard === mode ? -20 : 20,
      scale: selectedCard === mode ? 1.05 : 0.95,
      transition: { duration: 0.3 }
    })
  };

  return (
    <Shell>
      <PageTransition mode="fade">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div 
            className="max-w-4xl w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">Choisissez votre mode d'utilisation</h1>
              <p className="text-muted-foreground">
                Comment souhaitez-vous utiliser EmotionsCare aujourd'hui ?
              </p>
              {user && (
                <motion.p 
                  className="mt-2 text-sm font-medium text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Connecté en tant que: {user.name || user.email}
                </motion.p>
              )}
            </motion.div>
            
            <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6" 
              role="radiogroup"
              aria-label="Choix du mode d'utilisation"
            >
              <motion.div
                variants={cardVariants}
                custom={0}
                initial="init"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCard === 'b2c' ? "selected" : "animate"}
                exit="exit"
                custom={selectedCard}
              >
                <Card 
                  className="cursor-pointer h-full border-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary aria-selected:border-primary"
                  onClick={() => handleChooseMode('b2c')}
                  role="radio"
                  aria-checked={selectedCard === 'b2c'}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleChooseMode('b2c')}
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
                variants={cardVariants}
                custom={1}
                initial="init"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCard === 'b2b_user' ? "selected" : "animate"}
                exit="exit"
                custom={selectedCard}
              >
                <Card 
                  className="cursor-pointer h-full border-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary aria-selected:border-primary"
                  onClick={() => handleChooseMode('b2b_user')}
                  role="radio"
                  aria-checked={selectedCard === 'b2b_user'}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleChooseMode('b2b_user')}
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
                variants={cardVariants}
                custom={2}
                initial="init"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCard === 'b2b_admin' ? "selected" : "animate"}
                exit="exit"
                custom={selectedCard}
              >
                <Card 
                  className="cursor-pointer h-full border-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary aria-selected:border-primary"
                  onClick={() => handleChooseMode('b2b_admin')}
                  role="radio"
                  aria-checked={selectedCard === 'b2b_admin'}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleChooseMode('b2b_admin')}
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
      </PageTransition>
    </Shell>
  );
};

export default ChooseModeV2;
