
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';
import { modeChangeEmitter } from '@/utils/modeChangeEmitter';

const B2BSelectionPremium: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRoleSelect = (role: 'user' | 'admin') => {
    if (isTransitioning) return;
    
    setSelectedRole(role);
    
    // Add haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50); // Subtle vibration
    }
    
    // Play subtle click sound
    const audio = new Audio('/assets/sounds/soft-click.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fail silently - some browsers block autoplay
    });
    
    setTimeout(() => {
      setIsTransitioning(true);
      
      if (role === 'user') {
        setUserMode('b2b_user');
        modeChangeEmitter.emit('b2b_user');
        
        toast({
          title: "Mode Collaborateur activé",
          description: "Redirection vers votre espace collaborateur...",
          variant: "default",
        });
        
        setTimeout(() => navigate('/b2b/user/login'), 600);
      } else {
        setUserMode('b2b_admin');
        modeChangeEmitter.emit('b2b_admin');
        
        toast({
          title: "Mode Administrateur activé",
          description: "Redirection vers votre espace RH...",
          variant: "default",
        });
        
        setTimeout(() => navigate('/b2b/admin/login'), 600);
      }
    }, 300);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.5 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: { 
      y: -5, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 },
    selected: {
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      borderColor: "rgba(79, 70, 229, 0.5)"
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.div 
        className="glass-card max-w-5xl w-full p-8 md:p-12 rounded-3xl"
        variants={itemVariants}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Choisissez votre espace professionnel
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Accédez à l'espace qui correspond à votre rôle au sein de l'entreprise pour une expérience personnalisée
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            className={`glass-card p-6 rounded-2xl cursor-pointer relative overflow-hidden ${selectedRole === 'user' ? 'border-2 border-green-400/50' : 'border border-white/20'}`}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            animate={selectedRole === 'user' ? 'selected' : 'visible'}
            onClick={() => handleRoleSelect('user')}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-teal-100/20 dark:from-green-900/30 dark:to-teal-800/20 rounded-2xl -z-10"></div>
            
            <div className="flex flex-col items-center text-center space-y-6 py-4">
              <motion.div 
                className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Users className="h-12 w-12 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Espace Collaborateur</h2>
                <p className="text-muted-foreground">
                  Accédez à votre espace personnel au sein de l'entreprise pour suivre votre bien-être émotionnel et votre évolution.
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white w-full max-w-xs button-premium glow-hover"
              >
                Accéder à mon espace
              </Button>
            </div>
          </motion.div>

          <motion.div
            className={`glass-card p-6 rounded-2xl cursor-pointer relative overflow-hidden ${selectedRole === 'admin' ? 'border-2 border-purple-400/50' : 'border border-white/20'}`}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            animate={selectedRole === 'admin' ? 'selected' : 'visible'}
            onClick={() => handleRoleSelect('admin')}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-indigo-100/20 dark:from-purple-900/30 dark:to-indigo-800/20 rounded-2xl -z-10"></div>
            
            <div className="flex flex-col items-center text-center space-y-6 py-4">
              <motion.div 
                className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center"
                whileHover={{ rotate: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <ShieldCheck className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </motion.div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Espace Administrateur</h2>
                <p className="text-muted-foreground">
                  Visualisez les données agrégées de votre organisation, gérez les accès et pilotez les actions collectives.
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white w-full max-w-xs button-premium glow-hover"
              >
                Accéder à l'administration
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground" 
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default B2BSelectionPremium;
