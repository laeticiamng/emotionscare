
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Building, Mic, Volume2, VolumeX } from 'lucide-react';
import Shell from '@/Shell';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [greeting, setGreeting] = useState<string>('Bienvenue dans votre espace de bien-être émotionnel');
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Generate greeting based on time of day
  const generateGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Bienvenue dans votre espace de reconnexion émotionnelle matinale";
    } else if (hour >= 12 && hour < 18) {
      return "Votre espace premium pour le bien-être émotionnel quotidien";
    } else if (hour >= 18 && hour < 22) {
      return "Votre refuge émotionnel pour une soirée apaisante";
    } else {
      return "Votre havre de paix émotionnel nocturne";
    }
  };

  const handlePersonalClick = () => {
    localStorage.setItem('userMode', 'b2c');
    navigate('/b2c/login');
  };

  const handleBusinessClick = () => {
    navigate('/b2b/selection');
  };

  const handleVoiceCommand = () => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      
      // @ts-ignore - WebkitSpeechRecognition might not be in the types
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        if (transcript.includes('particulier') || 
            transcript.includes('personnel') || 
            transcript.includes('individuel')) {
          handlePersonalClick();
        } else if (transcript.includes('entreprise') || 
                  transcript.includes('business') || 
                  transcript.includes('professionnel') ||
                  transcript.includes('société')) {
          handleBusinessClick();
        }
        
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      console.log('Speech recognition not supported');
      alert('Commande vocale non supportée sur votre navigateur.');
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Autoplay prevented by browser'));
      }
      setAudioEnabled(!audioEnabled);
    }
  };

  // Initialize three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Create renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Get theme-specific colors
    const getThemeColors = () => {
      switch (theme) {
        case 'dark':
          return {
            primary: 0x0891B2,  // cyan
            secondary: 0x1E40AF, // deep blue
            accent: 0x6366F1     // indigo
          };
        case 'pastel':
          return {
            primary: 0x93C5FD,   // blue-300
            secondary: 0xBFDBFE,  // blue-200
            accent: 0xC7D2FE     // indigo-200
          };
        default: // light
          return {
            primary: 0x3B82F6,   // blue-500
            secondary: 0x60A5FA,  // blue-400
            accent: 0x818CF8     // indigo-400
          };
      }
    };

    const colors = getThemeColors();

    // Create particles for cosmos effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: colors.primary,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating sphere
    const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: colors.secondary,
      transparent: true,
      opacity: 0.7,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-10, 0, 0);
    scene.add(sphere);

    // Create second floating sphere
    const sphere2Geometry = new THREE.SphereGeometry(3, 32, 32);
    const sphere2Material = new THREE.MeshPhongMaterial({
      color: colors.accent,
      transparent: true,
      opacity: 0.6,
      wireframe: false,
    });
    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    sphere2.position.set(15, 5, -10);
    scene.add(sphere2);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 5, 15);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0003;
      
      sphere.rotation.y += 0.005;
      sphere.position.y = Math.sin(Date.now() * 0.001) * 1.5;
      
      sphere2.rotation.y -= 0.007;
      sphere2.position.y = Math.sin(Date.now() * 0.0015 + 1) * 2;
      
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      scene.clear();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [theme]);

  // Update greeting and other time-based items
  useEffect(() => {
    setGreeting(generateGreeting());
    
    // Set up background audio
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
    
    // Check for stored user preference
    const checkUserMode = () => {
      const storedUserMode = localStorage.getItem('userMode');
      if (storedUserMode === 'b2c') {
        navigate('/b2c/login');
      } else if (storedUserMode === 'b2b_user') {
        navigate('/b2b/user/login');
      } else if (storedUserMode === 'b2b_admin') {
        navigate('/b2b/admin/login');
      }
    };
    
    // Check after a short delay to allow the animation to show first
    const timerId = setTimeout(checkUserMode, 1000);
    
    // Use interval to update greeting based on time of day
    const greetingInterval = setInterval(() => {
      setGreeting(generateGreeting());
    }, 60000);
    
    // Clean up on unmount
    return () => {
      clearTimeout(timerId);
      clearInterval(greetingInterval);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [navigate]);

  // Button variants based on theme
  const primaryButtonClass = 
    theme === 'dark' 
      ? 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
      : theme === 'pastel'
        ? 'bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500'
        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600';
  
  const secondaryButtonClass = 
    theme === 'dark' 
      ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-100'
      : theme === 'pastel'
        ? 'bg-white/70 backdrop-blur-sm border border-blue-200 hover:bg-blue-50 text-blue-600'
        : 'bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-gray-50 text-gray-800';

  return (
    <Shell hideNav>
      <div className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 to-blue-900/30'
          : theme === 'pastel'
            ? 'bg-gradient-to-br from-blue-50 to-indigo-100'
            : 'bg-gradient-to-br from-white to-blue-50'
      }`}>
        {/* Background Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />
        
        {/* Audio element for background music */}
        <audio 
          ref={audioRef}
          src="/sounds/ambient-calm.mp3" 
          loop 
        />

        {/* Main Content */}
        <div className="z-10 px-4 max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className={`text-5xl md:text-7xl font-bold mb-4 ${
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300'
                : theme === 'pastel'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600'
            }`}>
              EmotionsCare
            </h1>
            
            <motion.p 
              className={`text-xl md:text-2xl max-w-3xl mx-auto font-light mb-12 ${
                theme === 'dark'
                  ? 'text-blue-300'
                  : theme === 'pastel'
                    ? 'text-blue-600'
                    : 'text-blue-900'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {greeting}
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center mt-12 space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button 
              onClick={handlePersonalClick}
              className={`px-8 py-7 text-lg rounded-3xl shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${primaryButtonClass}`}
            >
              <User className="mr-2 h-5 w-5" />
              Je suis un particulier
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={handleBusinessClick} 
              variant="outline" 
              className={`px-8 py-7 text-lg rounded-3xl shadow-md flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${secondaryButtonClass}`}
            >
              <Building className="mr-2 h-5 w-5" />
              Je suis une entreprise
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-12 flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button
              onClick={handleVoiceCommand}
              variant="ghost"
              size="icon"
              className={`rounded-full w-12 h-12 ${
                isListening 
                  ? 'bg-red-500/20 text-red-500 animate-pulse' 
                  : theme === 'dark'
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                    : theme === 'pastel'
                      ? 'bg-blue-100/70 text-blue-600 hover:bg-blue-200/70'
                      : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'
              }`}
              aria-label="Activer la commande vocale"
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={toggleAudio}
              variant="ghost"
              size="icon"
              className={`rounded-full w-12 h-12 ${
                theme === 'dark'
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                  : theme === 'pastel'
                    ? 'bg-blue-100/70 text-blue-600 hover:bg-blue-200/70'
                    : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'
              }`}
              aria-label={audioEnabled ? "Désactiver la musique" : "Activer la musique"}
            >
              {audioEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-4 left-0 right-0 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <p className={`text-sm ${
              theme === 'dark' 
                ? 'text-blue-400/50' 
                : theme === 'pastel'
                  ? 'text-blue-500/50'
                  : 'text-blue-700/50'
            }`}>
              Découvrez la technologie qui comprend vos émotions
            </p>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
};

export default ImmersiveHome;
