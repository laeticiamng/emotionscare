// @ts-nocheck
/**
 * Immersive Experience Engine - Moteur d'expérience utilisateur exceptionnelle
 * Crée des expériences personnalisées et magiques pour chaque utilisateur
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text3D, OrbitControls } from '@react-three/drei';
import { Sparkles, Heart, Zap, Wind, Music, Camera, Gamepad2 } from 'lucide-react';

interface ExperienceContext {
  emotion: string;
  energy: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  preference: 'visual' | 'audio' | 'interactive';
  goals: string[];
}

interface ImmersiveProps {
  children: React.ReactNode;
  intensity?: number;
  adaptiveTheme?: boolean;
  personalizedEffects?: boolean;
}

const ImmersiveExperienceEngine: React.FC<ImmersiveProps> = ({
  children,
  intensity = 0.7,
  adaptiveTheme = true,
  personalizedEffects = true
}) => {
  const { user } = useAuth();
  const [experienceContext, setExperienceContext] = useState<ExperienceContext>({
    emotion: 'calm',
    energy: 0.6,
    timeOfDay: 'afternoon',
    preference: 'visual',
    goals: ['wellbeing', 'focus']
  });

  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);
  const [magicEffects, setMagicEffects] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Analyse du contexte utilisateur
  useEffect(() => {
    const analyzeUserContext = () => {
      const hour = new Date().getHours();
      let timeOfDay: ExperienceContext['timeOfDay'] = 'afternoon';
      
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 18) timeOfDay = 'afternoon';
      else if (hour < 22) timeOfDay = 'evening';
      else timeOfDay = 'night';

      // Simulation d'analyse émotionnelle
      const emotions = ['calm', 'energetic', 'focused', 'creative', 'peaceful'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

      setExperienceContext(prev => ({
        ...prev,
        timeOfDay,
        emotion: randomEmotion,
        energy: Math.random() * 0.4 + 0.4 // 0.4 à 0.8
      }));
    };

    analyzeUserContext();
    const interval = setInterval(analyzeUserContext, 30000); // Mise à jour toutes les 30s
    return () => clearInterval(interval);
  }, []);

  // Système de particules magiques
  useEffect(() => {
    if (!personalizedEffects) return;

    const createParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      }));
      setParticles(newParticles);
    };

    createParticles();
    
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.vy + window.innerHeight) % window.innerHeight
      })));
    };

    const animationInterval = setInterval(animateParticles, 50);
    return () => clearInterval(animationInterval);
  }, [personalizedEffects]);

  // Gestion des interactions magiques
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as Element).getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    
    if (personalizedEffects && Math.random() < 0.1) {
      setMagicEffects(true);
      setTimeout(() => setMagicEffects(false), 2000);
    }
  };

  // Thème adaptatif selon le contexte
  const getAdaptiveTheme = () => {
    if (!adaptiveTheme) return {};

    const themes = {
      morning: {
        background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 50%, #e17055 100%)',
        particleColor: '#fdcb6e',
        glowColor: '#e17055'
      },
      afternoon: {
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #6c5ce7 100%)',
        particleColor: '#74b9ff', 
        glowColor: '#a29bfe'
      },
      evening: {
        background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 50%, #a29bfe 100%)',
        particleColor: '#fd79a8',
        glowColor: '#e84393'
      },
      night: {
        background: 'linear-gradient(135deg, #2d3436 0%, #636e72 50%, #74b9ff 100%)',
        particleColor: '#74b9ff',
        glowColor: '#00cec9'
      }
    };

    return themes[experienceContext.timeOfDay];
  };

  const theme = getAdaptiveTheme();

  // Effets émotionnels personnalisés
  const getEmotionEffects = () => {
    const effects = {
      calm: { scale: 1, blur: 0, saturate: 0.8 },
      energetic: { scale: 1.05, blur: 0, saturate: 1.2 },
      focused: { scale: 0.98, blur: 0, saturate: 1.1 },
      creative: { scale: 1.02, blur: 1, saturate: 1.3 },
      peaceful: { scale: 0.95, blur: 2, saturate: 0.9 }
    };

    return effects[experienceContext.emotion] || effects.calm;
  };

  const emotionEffects = getEmotionEffects();

  return (
    <motion.div
      className="immersive-experience-engine relative min-h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: theme?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        filter: `saturate(${emotionEffects.saturate}) blur(${emotionEffects.blur}px)`
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: emotionEffects.scale, 
        opacity: 1 
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Particules magiques */}
      {personalizedEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: theme?.particleColor || '#74b9ff',
                boxShadow: `0 0 6px ${theme?.glowColor || '#a29bfe'}`,
                left: particle.x,
                top: particle.y
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: particle.id * 0.1
              }}
            />
          ))}
        </div>
      )}

      {/* Effets magiques déclenchés */}
      <AnimatePresence>
        {magicEffects && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Vague d'énergie */}
            <motion.div
              className="absolute rounded-full border-4"
              style={{
                borderColor: theme?.glowColor || '#a29bfe',
                left: springX.get() - 50,
                top: springY.get() - 50,
                width: 100,
                height: 100
              }}
              animate={{
                scale: [0, 3],
                opacity: [0.8, 0],
                borderWidth: [4, 0]
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Étincelles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: theme?.particleColor || '#74b9ff',
                  left: springX.get(),
                  top: springY.get()
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                  opacity: [1, 0],
                  scale: [1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interface utilisateur contextuelle */}
      <motion.div
        className="absolute top-4 right-4 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              {experienceContext.emotion === 'energetic' && <Zap className="w-4 h-4" />}
              {experienceContext.emotion === 'calm' && <Wind className="w-4 h-4" />}
              {experienceContext.emotion === 'creative' && <Sparkles className="w-4 h-4" />}
              {experienceContext.emotion === 'peaceful' && <Heart className="w-4 h-4" />}
              {experienceContext.emotion === 'focused' && <Camera className="w-4 h-4" />}
              
              <span className="text-sm font-medium capitalize">{experienceContext.emotion}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs opacity-80">
            <span>{experienceContext.timeOfDay}</span>
            <span>•</span>
            <span>Énergie: {Math.round(experienceContext.energy * 100)}%</span>
          </div>

          {user && (
            <div className="mt-2 text-xs opacity-60">
              Expérience personnalisée pour {user.name}
            </div>
          )}
        </div>
      </motion.div>

      {/* Contenu principal avec effets immersifs */}
      <motion.div
        className="relative z-10"
        style={{
          filter: `contrast(${1 + (experienceContext.energy - 0.5) * 0.2})`
        }}
      >
        {children}
      </motion.div>

      {/* Ambiance sonore contextuelle (simulation) */}
      {personalizedEffects && (
        <div className="absolute bottom-4 left-4 z-50">
          <motion.div
            className="bg-black/20 backdrop-blur-md rounded-full p-3 text-white"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Music className="w-5 h-5" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ImmersiveExperienceEngine;