
import React, { useEffect, useState, useRef } from 'react';
import PremiumContent from '@/components/immersive/PremiumContent';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import '../styles/animations.css';
import useSound from '@/hooks/use-sound';
import useDeviceDetection from '@/hooks/use-device-detection';
import { useNavigate } from 'react-router-dom';

const ImmersiveHome: React.FC = () => {
  const { theme } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceDetection();
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState<boolean>(false);
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const navigate = useNavigate();
  
  const welcomeMessages = [
    "Bienvenue dans votre espace émotionnel personnalisé",
    "Découvrez comment mieux comprendre vos émotions",
    "Prenez soin de votre bien-être émotionnel",
    "Une nouvelle approche du bien-être au quotidien",
    "Votre parcours émotionnel commence ici"
  ];
  
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
  
  // First visit detection and onboarding
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedHome');
    
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      setIsOnboardingVisible(true);
      localStorage.setItem('hasVisitedHome', 'true');
    }
    
    // Random welcome message
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    setWelcomeMessage(welcomeMessages[randomIndex]);
    
    // Preload target pages for instant transitions
    const preloadRoutes = ['/b2c/login', '/b2b/selection'];
    preloadRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
    
    // Add overflow hidden to prevent scrolling
    document.body.classList.add('overflow-hidden');
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [welcomeMessages]);
  
  // Handle haptic feedback for mobile
  const handleHapticFeedback = () => {
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(50); // light vibration
    }
  };
  
  const handleButtonClick = (route: string) => {
    playClick();
    handleHapticFeedback();
    
    // Add a small delay for sound to play before navigating
    setTimeout(() => {
      navigate(route);
    }, 100);
  };
  
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-slate-900 to-blue-900' 
        : 'bg-gradient-to-b from-blue-50 to-purple-100'
    }`}>
      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
          </motion.div>
          
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="ml-2 text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hidden sm:block"
          >
            EmotionsCare
          </motion.span>
        </div>
        
        <ThemeToggle />
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center relative z-10">
        <PremiumContent 
          greeting={welcomeMessage} 
          onHover={playHover}
          onClick={(route) => handleButtonClick(route)}
        />
      </main>

      {/* Ambient background elements with parallax effect */}
      <div ref={parallaxRef} className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute top-0 -left-[30%] w-[60%] aspect-square bg-blue-500 rounded-full blur-[120px] mix-blend-multiply opacity-20 dark:opacity-10"
          style={{ x: moveX, y: moveY }}
        />
        <motion.div
          className="absolute top-[30%] -right-[20%] w-[50%] aspect-square bg-purple-500 rounded-full blur-[130px] mix-blend-multiply opacity-15 dark:opacity-10 animation-delay-2000"
          style={{ x: moveX.pipe(v => -v/2), y: moveY.pipe(v => -v/2) }}
        />
        <motion.div
          className="absolute -bottom-[10%] left-[20%] w-[40%] aspect-square bg-pink-400 rounded-full blur-[120px] mix-blend-multiply opacity-10 dark:opacity-5 animation-delay-4000"
          style={{ x: moveX.pipe(v => v/3), y: moveY.pipe(v => v/3) }}
        />
        
        {/* Interactive particle system */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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

      {/* Onboarding overlay for first-time visitors */}
      {isOnboardingVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-lg shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
              Bienvenue sur EmotionsCare
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-200">
              Notre plateforme utilise l'intelligence artificielle pour vous aider à comprendre 
              et gérer vos émotions. Choisissez votre mode d'accès pour commencer l'expérience.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsOnboardingVisible(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Commencer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-blue-600/60 dark:text-blue-300/60 z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          © {new Date().getFullYear()} EmotionsCare · Tous droits réservés
        </motion.p>
      </footer>
    </div>
  );
};

export default ImmersiveHome;
