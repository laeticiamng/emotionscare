/**
 * Dashboard Vivant - Plan du jour adaptatif
 * Canvas qui se réorganise, micro-actions intelligentes, charge mentale zéro
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Zap, Heart, Brain, Eye, Music, Wind, 
  Sun, Moon, Waves, Leaf, Star, Clock, Circle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MicroAction {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: React.ElementType;
  path: string;
  tone: 'soft' | 'energize' | 'center';
  color: string;
  urgency: number; // 1-10, plus bas = plus urgent/important
}

interface Pepite {
  id: string;
  text: string;
  completed: boolean;
  glow: number; // 0-100
}

const LivingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [currentActions, setCurrentActions] = useState<MicroAction[]>([]);
  const [pepites, setPepites] = useState<Pepite[]>([]);
  const [aura, setAura] = useState({ glow: 65, color: 'from-blue-400 to-purple-500' });
  const [isReorganizing, setIsReorganizing] = useState(false);
  
  // Micro-sons feutrés
  const playMicroSound = (type: 'hover' | 'tap' | 'complete') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Sons très doux selon le type
    switch (type) {
      case 'hover':
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        break;
      case 'tap':
        oscillator.frequency.setValueAtTime(660, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        break;
      case 'complete':
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        break;
    }
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  };

  // Actions adaptatives selon le moment de la journée et l'état de l'utilisateur
  const generateAdaptiveActions = (): MicroAction[] => {
    const hour = new Date().getHours();
    const isEvening = hour >= 18;
    const isMorning = hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;
    
    const actionPool: MicroAction[] = [
      // Matin
      {
        id: 'morning-scan',
        title: 'Nommer ce que tu ressens',
        subtitle: '30 secondes d\'auto-check',
        duration: '30s',
        icon: Eye,
        path: '/app/scan',
        tone: 'soft',
        color: 'from-blue-400 to-cyan-300',
        urgency: isMorning ? 2 : 6
      },
      {
        id: 'breath-wake',
        title: 'Réveiller en douceur',
        subtitle: '3 respirations conscientes',
        duration: '90s',
        icon: Wind,
        path: '/app/breath',
        tone: 'center',
        color: 'from-green-400 to-emerald-300',
        urgency: isMorning ? 3 : 7
      },
      
      // Midi/Après-midi
      {
        id: 'flash-energy',
        title: 'Éclair de clarté',
        subtitle: 'Flash Glow apaisant',
        duration: '2min',
        icon: Zap,
        path: '/app/flash-glow',
        tone: 'energize',
        color: 'from-yellow-400 to-orange-300',
        urgency: isAfternoon ? 2 : 5
      },
      {
        id: 'screen-silk',
        title: 'Reposer tes yeux',
        subtitle: 'Micro-pause écran',
        duration: '90s',
        icon: Circle,
        path: '/app/screen-silk',
        tone: 'soft',
        color: 'from-slate-400 to-gray-300',
        urgency: isAfternoon ? 3 : 6
      },
      
      // Soir
      {
        id: 'mood-mixer',
        title: 'Sculpter ton climat',
        subtitle: 'Ambiance pour ce soir',
        duration: '2min',
        icon: Waves,
        path: '/app/mood-mixer',
        tone: 'soft',
        color: 'from-purple-400 to-pink-300',
        urgency: isEvening ? 2 : 7
      },
      {
        id: 'journal-release',
        title: 'Relâcher en mots',
        subtitle: 'Journal vocal doux',
        duration: '90s',
        icon: Heart,
        path: '/app/journal',
        tone: 'soft',
        color: 'from-rose-400 to-pink-300',
        urgency: isEvening ? 3 : 8
      },
      
      // Cocon d'urgence - toujours disponible
      {
        id: 'nyvee-cocon',
        title: 'Cocon d\'urgence',
        subtitle: 'Quand tu n\'en peux plus',
        duration: '6min',
        icon: Star,
        path: '/app/scan',
        tone: 'soft',
        color: 'from-indigo-400 to-purple-400',
        urgency: 1 // Toujours prioritaire
      }
    ];
    
    // Trier par urgence et prendre les 2 plus pertinentes
    return actionPool
      .sort((a, b) => a.urgency - b.urgency)
      .slice(0, 2);
  };

  // Pépites du jour qui changent chaque matin
  const generateDailyPepites = (): Pepite[] => {
    const today = new Date().toDateString();
    const pepitePool = [
      "Un souffle profond vaut mille décisions précipitées",
      "Ta fatigue mérite autant de douceur que ta joie",
      "Chaque pause est un acte de résistance bienveillante",
      "Tu n'as pas à porter le monde sur tes épaules",
      "Même les étoiles prennent le temps de scintiller",
      "Ton rythme n'a pas à ressembler à celui des autres",
      "Une micro-action vaut mieux qu'un grand projet figé"
    ];
    
    // Sélectionner 3 pépites basées sur la date (consistant jour par jour)
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedPepites = [];
    
    for (let i = 0; i < 3; i++) {
      const index = (seed + i * 7) % pepitePool.length;
      selectedPepites.push({
        id: `pepite-${i}`,
        text: pepitePool[index],
        completed: false,
        glow: 20 + i * 10
      });
    }
    
    return selectedPepites;
  };

  // Canvas qui se réorganise doucement
  const reorganizeCanvas = () => {
    setIsReorganizing(true);
    
    setTimeout(() => {
      setCurrentActions(generateAdaptiveActions());
      setIsReorganizing(false);
    }, 800);
  };

  useEffect(() => {
    setCurrentActions(generateAdaptiveActions());
    setPepites(generateDailyPepites());
    
    // Réorganisation douce toutes les 15 minutes
    const interval = setInterval(reorganizeCanvas, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleActionTap = (action: MicroAction) => {
    playMicroSound('tap');
    navigate(action.path);
  };

  const completePepite = (pepiteId: string) => {
    playMicroSound('complete');
    setPepites(prev => prev.map(p => 
      p.id === pepiteId 
        ? { ...p, completed: true, glow: Math.min(100, p.glow + 20) }
        : p
    ));
    
    // Augmenter l'aura globale
    setAura(prev => ({ 
      ...prev, 
      glow: Math.min(100, prev.glow + 5),
      color: prev.glow > 80 ? 'from-gold-400 to-yellow-300' : prev.color
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Aura utilisateur */}
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`inline-block p-6 rounded-full bg-gradient-to-br ${aura.color} opacity-${Math.floor(aura.glow/10)*10}`}>
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <h1 className="text-2xl font-light mt-4 text-gray-700">
            Bonjour {user?.email?.split('@')[0] || 'ami'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ton plan du jour s'adapte à toi
          </p>
        </motion.div>

        {/* Micro-actions adaptatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="sync">{/* Fixed multiple children warning */}
            {currentActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => playMicroSound('hover')}
                className={`${isReorganizing ? 'blur-sm' : ''} transition-all duration-500`}
              >
                <Card 
                  className="cursor-pointer border-0 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => handleActionTap(action)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} mb-4 flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">{action.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{action.subtitle}</p>
                    <Badge variant="secondary" className="text-xs">
                      {action.duration}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pépites du jour */}
        <Card className="bg-white/50 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="font-medium text-gray-800">Pépites du jour</h2>
            </div>
            
            <div className="space-y-3">
              {pepites.map((pepite) => (
                <motion.div
                  key={pepite.id}
                  className={`p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                    pepite.completed 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-gray-50 hover:bg-yellow-50'
                  }`}
                  onClick={() => !pepite.completed && completePepite(pepite.id)}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    boxShadow: pepite.completed 
                      ? `0 0 20px rgba(251, 191, 36, ${pepite.glow / 100 * 0.3})` 
                      : 'none'
                  }}
                >
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {pepite.text}
                  </p>
                  {pepite.completed && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-yellow-600">Intégrée</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bouton cocon d'urgence - toujours visible */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl"
            onClick={() => {
              playMicroSound('tap');
              navigate('/app/scan');
            }}
            onMouseEnter={() => playMicroSound('hover')}
          >
            <Star className="w-8 h-8 text-white" />
          </Button>
        </motion.div>

        {/* Indicateur de réorganisation */}
        {isReorganizing && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-purple-500" />
              </motion.div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default LivingDashboard;