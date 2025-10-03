import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Moon, Heart, Zap, Play, Pause } from 'lucide-react';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { useRewardsStore } from '@/store/rewards.store';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { UNIVERSE_CONFIGS } from '@/data/universes/config';
import { Button } from '@/components/ui/button';

interface Story {
  id: string;
  title: string;
  theme: 'calm' | 'confidence' | 'sleep' | 'energy';
  icon: React.ElementType;
  duration: number;
  description: string;
  content: string[];
}

const StorySynthPage: React.FC = () => {
  const [isEntering, setIsEntering] = useState(true);
  const [phase, setPhase] = useState<'setup' | 'selection' | 'listening' | 'complete'>('setup');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReward, setShowReward] = useState(false);
  
  const { addReward } = useRewardsStore();
  const { entranceVariants, cssAnimationClasses } = useOptimizedAnimation();

  const universe = UNIVERSE_CONFIGS.storySynth;

  const stories: Story[] = [
    {
      id: 'calm-ocean',
      title: 'L\'Océan Éternel',
      theme: 'calm',
      icon: Heart,
      duration: 5,
      description: 'Une histoire pour apaiser le mental',
      content: [
        "Tu te trouves sur une plage de sable fin, les vagues caressent doucement le rivage...",
        "Le bruit de l'océan devient une mélodie apaisante qui ralentit ton rythme cardiaque...",
        "Chaque respiration synchronise avec le mouvement des vagues...",
        "Tu ressens une paix profonde s'installer en toi...",
        "Cette sérénité t'accompagnera bien au-delà de ce moment."
      ]
    },
    {
      id: 'mountain-strength',
      title: 'La Montagne Intérieure',
      theme: 'confidence',
      icon: Zap,
      duration: 4,
      description: 'Découvre ta force intérieure',
      content: [
        "Tu gravits un sentier de montagne, chaque pas te rend plus fort...",
        "La vue devient plus claire à mesure que tu montes...",
        "Tu réalises que cette force était en toi depuis toujours...",
        "Au sommet, tu vois tout ce dont tu es capable."
      ]
    },
    {
      id: 'starlight-sleep',
      title: 'La Lumière des Étoiles',
      theme: 'sleep',
      icon: Moon,
      duration: 6,
      description: 'Un voyage vers un sommeil réparateur',
      content: [
        "Les étoiles brillent doucement au-dessus de toi...",
        "Chaque étoile emporte une tension de ta journée...",
        "Ton corps devient de plus en plus lourd et détendu...",
        "Les soucis s'évaporent dans la nuit cosmique...",
        "Tu dérivs vers un sommeil profond et réparateur...",
        "Demain sera un nouveau jour plein de possibilités."
      ]
    }
  ];

  const handleEnterComplete = useCallback(() => {
    setIsEntering(false);
    setPhase('selection');
  }, []);

  const selectStory = useCallback((story: Story) => {
    setSelectedStory(story);
    setPhase('listening');
    setCurrentSegment(0);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const nextSegment = useCallback(() => {
    if (!selectedStory) return;
    
    if (currentSegment < selectedStory.content.length - 1) {
      setCurrentSegment(prev => prev + 1);
    } else {
      completeStory();
    }
  }, [selectedStory, currentSegment]);

  const completeStory = useCallback(() => {
    if (!selectedStory) return;
    
    setPhase('complete');
    setIsPlaying(false);
    
    const reward = addReward({
      type: 'sticker',
      name: 'Phrase-Poème',
      description: `Souvenir de "${selectedStory.title}"`
    });

    setTimeout(() => {
      setShowReward(true);
    }, 800);
  }, [selectedStory, addReward]);

  // Auto-advance segments when playing
  React.useEffect(() => {
    if (!isPlaying || !selectedStory) return;

    const timer = setTimeout(() => {
      nextSegment();
    }, 8000); // 8 seconds per segment

    return () => clearTimeout(timer);
  }, [isPlaying, currentSegment, selectedStory, nextSegment]);

  if (phase === 'setup' || phase === 'selection') {
    return (
      <UniverseEngine
        universe={universe}
        isEntering={isEntering}
        onEnterComplete={handleEnterComplete}
        enableParticles={true}
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center mb-12"
            variants={entranceVariants}
            initial="hidden"
            animate={phase === 'selection' ? "visible" : "hidden"}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-light text-white">La Bibliothèque Vivante</h1>
            </div>
            <p className="text-white/70 text-lg max-w-md">
              Chaque histoire est un chemin vers ton mieux-être
            </p>
          </motion.div>

          {phase === 'selection' && (
            <div className="grid gap-4 max-w-md w-full">
              <h3 className="text-white/80 text-center mb-4">Choisis ton voyage</h3>
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Button
                    onClick={() => selectStory(story)}
                    className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-2xl p-6 border border-purple-400/30"
                  >
                    <story.icon className="w-6 h-6 mr-3 text-purple-400" />
                    <div className="text-left flex-1">
                      <p className="font-medium">{story.title}</p>
                      <p className="text-sm text-white/60">{story.description}</p>
                      <p className="text-xs text-white/40">{story.duration} min</p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </UniverseEngine>
    );
  }

  if (phase === 'listening') {
    const progress = selectedStory ? (currentSegment / selectedStory.content.length) * 100 : 0;
    
    return (
      <UniverseEngine
        universe={universe}
        isEntering={false}
        onEnterComplete={() => {}}
        enableParticles={true}
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-light text-white mb-2">
              {selectedStory?.title}
            </h2>
            <div className="w-64 bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/60 text-sm">
              Segment {currentSegment + 1} sur {selectedStory?.content.length}
            </p>
          </motion.div>

          {/* Story Content */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full mb-8"
            key={currentSegment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white text-lg leading-relaxed text-center">
              {selectedStory?.content[currentSegment]}
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex gap-4">
            <Button
              onClick={togglePlayback}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button
              onClick={nextSegment}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full"
            >
              Suivant
            </Button>
          </div>
        </div>
      </UniverseEngine>
    );
  }

  return (
    <UniverseEngine
      universe={universe}
      isEntering={false}
      onEnterComplete={() => {}}
      enableParticles={true}
      className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
    >
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center ${cssAnimationClasses.pulse}`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-light text-white">Histoire vécue</h2>
          </div>
          <p className="text-white/70">
            Emporte cette sérénité avec toi
          </p>
        </motion.div>

        {/* Poetic Quote */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 max-w-md w-full mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white text-center italic font-light">
            "Dans chaque histoire se cache une vérité qui nous aide à grandir"
          </p>
        </motion.div>

        {showReward && (
          <RewardSystem
            type="sticker"
            message="Belle histoire vécue"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </UniverseEngine>
  );
};

export default StorySynthPage;