
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Building, MicIcon, Moon, Sun } from 'lucide-react';
import Shell from '@/Shell';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const timeOfDayRef = useRef<string>(getTimeOfDay());
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Determine time of day
  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  useEffect(() => {
    // Show welcome animation after a brief delay
    const welcomeTimer = setTimeout(() => {
      setWelcomeVisible(true);
    }, 500);

    // Check if it's user's first visit
    const isFirstVisit = localStorage.getItem('emotionsCareFirstVisit') !== 'false';
    if (isFirstVisit) {
      setTimeout(() => {
        setShowOnboarding(true);
        localStorage.setItem('emotionsCareFirstVisit', 'false');
      }, 2000);
    }

    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Mouse movement tracker
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Calculate normalized mouse position (-1 to 1)
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    
    // Camera with better perspective for immersiveness
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.offsetWidth / containerRef.current.offsetHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    // Create particles with color theme based on time of day
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Increased for more immersive feel
    
    const posArray = new Float32Array(particlesCount * 3);
    
    // Create a sphere distribution for more natural feel
    for (let i = 0; i < particlesCount; i++) {
      const radius = 25 + Math.random() * 10; // Radius of sphere
      const theta = Math.random() * Math.PI * 2; // Random angle around Y axis
      const phi = Math.random() * Math.PI; // Random angle from top to bottom
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Time of day based color theme
    let particleColor;
    switch(timeOfDayRef.current) {
      case 'morning':
        particleColor = isDarkMode ? 0x6495ED : 0x94c5f8; // Morning blue
        break;
      case 'afternoon':
        particleColor = isDarkMode ? 0x1E90FF : 0x42a5f5; // Afternoon bright blue
        break;
      case 'evening':
        particleColor = isDarkMode ? 0x8A2BE2 : 0xb39ddb; // Evening purple
        break;
      case 'night':
        particleColor = isDarkMode ? 0x191970 : 0x3949ab; // Night deep blue
        break;
      default:
        particleColor = 0x3b82f6; // Default blue
    }
    
    const particleTexture = new THREE.TextureLoader().load('/assets/textures/particle.png');
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.3,
      transparent: true,
      color: particleColor,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      map: particleTexture,
      depthWrite: false
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesMeshRef.current = particlesMesh;
    scene.add(particlesMesh);

    // Animation
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      if (particlesMeshRef.current) {
        // Slow rotation for ambient effect
        particlesMeshRef.current.rotation.x += 0.0002;
        particlesMeshRef.current.rotation.y += 0.0003;
        
        // Interactive mouse effect - particles slightly follow mouse movement
        particlesMeshRef.current.rotation.x += mouseRef.current.y * 0.0002;
        particlesMeshRef.current.rotation.y += mouseRef.current.x * 0.0002;
      }
      
      renderer.render(scene, camera);
      
      // Cleanup function
      return () => {
        cancelAnimationFrame(animationId);
      };
    };

    animate();

    // Handle resize for responsive design
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    // Play subtle welcome sound effect with error handling
    const audio = new Audio('/sounds/welcome.mp3');
    audio.volume = 0.2;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(_ => {
        console.log('Auto-play was prevented. User interaction required.');
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        scene.remove(particlesMesh);
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      }
    };
  }, [isDarkMode]);

  const handleVoiceCommand = () => {
    // Add feedback when voice is activated
    const feedbackEl = document.getElementById('voice-feedback');
    if (feedbackEl) {
      feedbackEl.classList.add('pulse-animation');
      setTimeout(() => feedbackEl.classList.remove('pulse-animation'), 2000);
    }
    
    // Placeholder for voice command functionality
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        if (command.includes('personnel') || command.includes('particulier')) {
          navigate('/b2c/login');
        } else if (command.includes('entreprise') || command.includes('professionnel')) {
          navigate('/b2b/selection');
        }
      };
      recognition.start();
    } else {
      console.log('Speech recognition not supported');
    }
  };

  const onboardingSteps = [
    {
      title: "Bienvenue sur EmotionsCare",
      description: "Votre espace dédié au bien-être émotionnel et à l'harmonie au quotidien.",
      image: "/images/onboarding-1.png"
    },
    {
      title: "Choisissez votre profil",
      description: "Accédez à des fonctionnalités adaptées à votre usage personnel ou professionnel.",
      image: "/images/onboarding-2.png"
    }
  ];

  return (
    <Shell className="overflow-hidden" immersive>
      <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50/30 to-blue-100/20 dark:from-slate-900/80 dark:to-blue-950/30">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
        
        {/* Theme toggle button (new) */}
        <div className="absolute top-4 right-4 z-20">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.span 
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span 
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
        
        <div className="z-10 px-4 max-w-6xl mx-auto text-center relative">
          {/* Welcome message with animation */}
          <AnimatePresence mode="wait">
            {welcomeVisible && (
              <motion.div 
                className="mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-300 tracking-tight"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  EmotionsCare
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Votre espace premium pour le bien-être émotionnel
                </motion.p>
                <motion.p
                  className="mt-3 text-base text-blue-600/70 dark:text-blue-400/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {timeOfDayRef.current === 'morning' && "Bon matin ! Commencez votre journée avec sérénité"}
                  {timeOfDayRef.current === 'afternoon' && "Bon après-midi ! Un moment idéal pour prendre soin de vous"}
                  {timeOfDayRef.current === 'evening' && "Bonsoir ! Terminez votre journée en douceur"}
                  {timeOfDayRef.current === 'night' && "Bonsoir ! Un moment de calme avant le repos"}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mode selection buttons with enhanced animations */}
          <div className="flex flex-col sm:flex-row justify-center mt-12 space-y-4 sm:space-y-0 sm:space-x-6 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-700 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-500 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300"
              >
                <Link to="/b2c/login" className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Espace Personnel
                  <motion.span 
                    className="ml-2" 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 3, duration: 1.5 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-blue-400 dark:border-blue-700 bg-white/80 dark:bg-blue-950/50 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 px-8 py-6 text-lg rounded-2xl shadow-md hover:shadow-lg transform transition-all duration-300"
              >
                <Link to="/b2b/selection" className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Espace Entreprise
                  <motion.span 
                    className="ml-2" 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, repeatDelay: 4, duration: 1.5 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </div>
          
          {/* Voice command button with feedback animation */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="relative inline-block">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 rounded-full p-3 group"
                onClick={handleVoiceCommand}
                title="Commande vocale"
              >
                <MicIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Commande vocale</span>
              </Button>
              <span id="voice-feedback" className="absolute inset-0 bg-blue-400/20 dark:bg-blue-600/30 rounded-full scale-0 transition-transform duration-300"></span>
            </div>
            <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-2">Essayez la commande vocale</p>
          </motion.div>
          
          <motion.div 
            className="mt-24 text-blue-600/60 dark:text-blue-400/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <p>Découvrez <span className="text-blue-600 dark:text-blue-400 font-medium">SocialCocon</span> - Votre communauté dédiée au bien-être</p>
          </motion.div>
        </div>
      </div>

      {/* Onboarding overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative h-40 bg-gradient-to-r from-blue-400 to-purple-500">
                {onboardingStep === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <div className="text-6xl font-bold mb-2">👋</div>
                    </motion.div>
                  </div>
                )}
                {onboardingStep === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center space-x-12 text-white">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-center"
                    >
                      <div className="text-6xl mb-2">👤</div>
                      <div className="text-xs font-medium">Personnel</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-center"
                    >
                      <div className="text-6xl mb-2">🏢</div>
                      <div className="text-xs font-medium">Entreprise</div>
                    </motion.div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {onboardingSteps[onboardingStep].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {onboardingSteps[onboardingStep].description}
                </p>
                <div className="flex justify-between">
                  <Button 
                    variant="ghost"
                    onClick={() => setShowOnboarding(false)}
                  >
                    Ignorer
                  </Button>
                  <Button
                    onClick={() => {
                      if (onboardingStep < onboardingSteps.length - 1) {
                        setOnboardingStep(prev => prev + 1);
                      } else {
                        setShowOnboarding(false);
                      }
                    }}
                  >
                    {onboardingStep < onboardingSteps.length - 1 ? 'Suivant' : 'Terminer'}
                  </Button>
                </div>
              </div>
              {/* Progress dots */}
              <div className="pb-4 flex justify-center">
                {onboardingSteps.map((_, index) => (
                  <div 
                    key={index}
                    className={`mx-1 w-2 h-2 rounded-full ${
                      index === onboardingStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .pulse-animation {
          animation: pulse 1.5s ease-out;
        }
      `}</style>
    </Shell>
  );
};

export default LandingPage;
