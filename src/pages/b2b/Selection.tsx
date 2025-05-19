
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import useSound from '@/hooks/use-sound';

const B2BSelection = () => {
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  // Initialize sound effects
  const { play: playHover } = useSound({
    src: '/sounds/hover.mp3',
    volume: 0.2
  });
  
  const { play: playClick } = useSound({
    src: '/sounds/click.mp3',
    volume: 0.3
  });
  
  // Initialize spring physics for smoother parallax
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Transform mouse position into parallax effect
  const moveX = useTransform(springX, [0, window.innerWidth], [-15, 15]);
  const moveY = useTransform(springY, [0, window.innerHeight], [-15, 15]);
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const handleUserAccess = () => {
    playClick();
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    localStorage.setItem('userMode', 'b2b_user');
    navigate('/b2b/user/login');
  };

  const handleAdminAccess = () => {
    playClick();
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    localStorage.setItem('userMode', 'b2b_admin');
    navigate('/b2b/admin/login');
  };

  const handleGoBack = () => {
    playClick();
    
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    navigate('/');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-gray-900 dark:to-blue-900/20">
      {/* Subtle background animation */}
      <div ref={parallaxRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ x: moveX, y: moveY }}
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-200 to-transparent rounded-full filter blur-3xl opacity-10"
        />
        <motion.div
          style={{ x: moveX.pipe(v => -v/2), y: moveY.pipe(v => -v/2) }}
          className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-200 to-transparent rounded-full filter blur-3xl opacity-10"
        />
        
        {/* Interactive particle system */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className={`absolute rounded-full bg-white dark:bg-blue-300 ${
                i % 3 === 0 ? 'w-1 h-1' : i % 3 === 1 ? 'w-1.5 h-1.5' : 'w-2 h-2'
              }`}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight
                ],
                opacity: [0.1, 0.5, 0.1]
              }}
              transition={{
                duration: 15 + Math.random() * 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        className="container max-w-3xl z-10 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400" tabIndex={0}>
            Espace Entreprise
          </h1>
          <p className="text-lg text-blue-800/70 dark:text-blue-300/70" tabIndex={0}>
            Sélectionnez votre type d'accès
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => playHover()}
          >
            <Card className="h-full border-blue-200 dark:border-blue-900/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Collaborateur</CardTitle>
                <CardDescription className="text-center">
                  Accès aux outils de bien-être personnel
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <ul className="text-sm text-muted-foreground space-y-1" aria-label="Fonctionnalités accessibles aux collaborateurs">
                  <li>• Journal émotionnel personnel</li>
                  <li>• Musicothérapie personnalisée</li>
                  <li>• Coaching IA adapté au travail</li>
                  <li>• Suivi de votre bien-être</li>
                </ul>
                
                <Button 
                  onClick={handleUserAccess} 
                  size="lg" 
                  variant="default"
                  className="w-full group"
                  aria-label="Accéder à l'espace collaborateur"
                >
                  Espace Collaborateur
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => playHover()}
          >
            <Card className="h-full border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Administration / RH</CardTitle>
                <CardDescription className="text-center">
                  Gestion d'équipe et analyse collective
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <ul className="text-sm text-muted-foreground space-y-1" aria-label="Fonctionnalités accessibles aux administrateurs">
                  <li>• Tableau de bord analytique</li>
                  <li>• Monitoring d'équipe anonymisé</li>
                  <li>• Organisation d'événements</li>
                  <li>• Rapports et tendances</li>
                </ul>
                
                <Button 
                  onClick={handleAdminAccess} 
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 group"
                  aria-label="Accéder à l'espace administration"
                >
                  Espace Administration
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="text-blue-700/70 dark:text-blue-400/70 hover:text-blue-700 dark:hover:text-blue-400 flex items-center gap-2"
            aria-label="Retourner à la page d'accueil"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default B2BSelection;
