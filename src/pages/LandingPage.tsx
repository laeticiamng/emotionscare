
import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, User, Building, MicIcon } from 'lucide-react';
import Shell from '@/Shell';
import * as THREE from 'three';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
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

    // Create particles with blue color theme
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      color: 0x3b82f6, // Blue color (tailwind blue-500)
      blending: THREE.AdditiveBlending,
      opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0003;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    // Play subtle sound effect on load
    const audio = new Audio('/sounds/welcome.mp3');
    audio.volume = 0.2;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(_ => {
        // Auto-play was prevented, silent fail
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleVoiceCommand = () => {
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

  return (
    <Shell className="overflow-hidden">
      <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-950/20">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
        
        <div className="z-10 px-4 max-w-6xl mx-auto text-center relative">
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-300 tracking-tight">
              EmotionsCare
            </h1>
            <p className="text-xl md:text-2xl text-blue-700 dark:text-blue-300 max-w-3xl mx-auto font-light">
              Votre espace premium pour le bien-être émotionnel
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center mt-12 space-y-4 sm:space-y-0 sm:space-x-6 relative">
            <Button 
              asChild 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
            >
              <Link to="/b2c/login" className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Espace Personnel
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-blue-400 dark:border-blue-700 bg-white/80 dark:bg-blue-950/50 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 px-8 py-6 text-lg rounded-2xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
            >
              <Link to="/b2b/selection" className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Espace Entreprise
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-16">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 rounded-full p-3"
              onClick={handleVoiceCommand}
              title="Commande vocale"
            >
              <MicIcon className="h-5 w-5" />
              <span className="sr-only">Commande vocale</span>
            </Button>
          </div>
          
          <div className="mt-24 text-blue-600/60 dark:text-blue-400/60 text-sm">
            <p>Découvrez <span className="text-blue-600 dark:text-blue-400 font-medium">SocialCocon</span> - Votre communauté dédiée au bien-être</p>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default LandingPage;
