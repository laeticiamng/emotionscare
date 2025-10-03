/**
 * MUSIC ODYSSEY - Voyage musical thérapeutique immersif
 * Collection évolutive de playlists émotionnelles avec système de découverte
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Music, Play, Pause, SkipForward, Volume2, Heart, Brain, 
  Sparkles, Sun, Moon, Zap, Cloud, Star, Flame, Waves 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageRoot from '@/components/common/PageRoot';

interface MusicRealm {
  id: string;
  name: string;
  description: string;
  story: string;
  mood: string;
  color: string;
  icon: any;
  unlockLevel: number;
  tracks: MusicTrack[];
  visualEffect: 'particles' | 'waves' | 'spiral' | 'galaxy';
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  emotion: string;
  intensity: number;
}

const musicRealms: MusicRealm[] = [
  {
    id: 'dawn-serenity',
    name: 'L\'Éveil Serein',
    description: 'Commence ta journée en douceur',
    story: 'Les premières lueurs du jour caressent ton âme. Chaque note est un rayon de soleil qui éveille ton potentiel.',
    mood: 'Calme énergisant',
    color: 'from-orange-300 via-amber-200 to-yellow-300',
    icon: Sun,
    unlockLevel: 1,
    visualEffect: 'particles',
    tracks: [
      { id: 't1', title: 'Aube Dorée', artist: 'Harmonies Matinales', duration: 240, emotion: 'peaceful', intensity: 3 },
      { id: 't2', title: 'Premier Souffle', artist: 'Éther Sound', duration: 280, emotion: 'hopeful', intensity: 4 },
      { id: 't3', title: 'Éveil Lumineux', artist: 'Dawn Collective', duration: 300, emotion: 'gentle', intensity: 3 }
    ]
  },
  {
    id: 'flow-cascade',
    name: 'La Cascade du Flow',
    description: 'Entre dans ta zone de productivité optimale',
    story: 'Tel un torrent de créativité, tu glisses sans effort dans ton flow. Chaque rythme synchronise ton cerveau avec l\'univers.',
    mood: 'Focus créatif',
    color: 'from-cyan-400 via-blue-400 to-indigo-400',
    icon: Waves,
    unlockLevel: 2,
    visualEffect: 'waves',
    tracks: [
      { id: 't4', title: 'Fluide Mental', artist: 'Focus Architects', duration: 420, emotion: 'focused', intensity: 6 },
      { id: 't5', title: 'Cascade Cognitive', artist: 'Neural Waves', duration: 380, emotion: 'productive', intensity: 7 },
      { id: 't6', title: 'Rivière de Pensées', artist: 'Mind Stream', duration: 450, emotion: 'immersive', intensity: 6 }
    ]
  },
  {
    id: 'electric-pulse',
    name: 'Le Pouls Électrique',
    description: 'Libère ton énergie explosive',
    story: 'L\'électricité pure parcourt tes veines. Tu deviens force brute, mouvement pur, énergie incarnée.',
    mood: 'Boost maximal',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    icon: Zap,
    unlockLevel: 3,
    visualEffect: 'spiral',
    tracks: [
      { id: 't7', title: 'Décharge Vitale', artist: 'Energy Surge', duration: 180, emotion: 'energetic', intensity: 9 },
      { id: 't8', title: 'Voltage Maximum', artist: 'Power Beats', duration: 200, emotion: 'explosive', intensity: 10 },
      { id: 't9', title: 'Fusion Nucléaire', artist: 'Core Reactor', duration: 220, emotion: 'intense', intensity: 9 }
    ]
  },
  {
    id: 'dream-nebula',
    name: 'La Nébuleuse des Rêves',
    description: 'Plonge dans les profondeurs oniriques',
    story: 'Tu flottes dans un océan de possibilités infinies. Chaque son est une étoile dans ta galaxie intérieure.',
    mood: 'Exploration profonde',
    color: 'from-purple-500 via-pink-500 to-rose-500',
    icon: Cloud,
    unlockLevel: 4,
    visualEffect: 'galaxy',
    tracks: [
      { id: 't10', title: 'Voyage Astral', artist: 'Cosmic Dreamers', duration: 360, emotion: 'dreamy', intensity: 5 },
      { id: 't11', title: 'Éther Psychédélique', artist: 'Nebula Sounds', duration: 420, emotion: 'transcendent', intensity: 6 },
      { id: 't12', title: 'Conscience Élargie', artist: 'Infinity Mind', duration: 480, emotion: 'expansive', intensity: 5 }
    ]
  },
  {
    id: 'midnight-alchemy',
    name: 'L\'Alchimie de Minuit',
    description: 'Transforme ta nuit en régénération',
    story: 'La nuit est ton laboratoire. Tu transmutes tes expériences du jour en sagesse. Le repos devient pouvoir.',
    mood: 'Régénération nocturne',
    color: 'from-indigo-900 via-purple-800 to-blue-900',
    icon: Moon,
    unlockLevel: 5,
    visualEffect: 'particles',
    tracks: [
      { id: 't13', title: 'Sommeil Réparateur', artist: 'Night Healers', duration: 600, emotion: 'restful', intensity: 2 },
      { id: 't14', title: 'Rêves Lucides', artist: 'Dream Weavers', duration: 540, emotion: 'mystical', intensity: 3 },
      { id: 't15', title: 'Régénération Totale', artist: 'Nocturnal Alchemy', duration: 720, emotion: 'restorative', intensity: 2 }
    ]
  },
  {
    id: 'phoenix-fire',
    name: 'Le Feu du Phénix',
    description: 'Renaîs de tes cendres plus fort',
    story: 'Tu es le Phénix. Chaque difficulté t\'a forgé. Maintenant, tu t\'envoles dans ta gloire la plus pure.',
    mood: 'Renaissance puissante',
    color: 'from-red-600 via-orange-500 to-amber-400',
    icon: Flame,
    unlockLevel: 6,
    visualEffect: 'spiral',
    tracks: [
      { id: 't16', title: 'Ascension Flamboyante', artist: 'Phoenix Rising', duration: 300, emotion: 'empowering', intensity: 8 },
      { id: 't17', title: 'Gloire Éternelle', artist: 'Immortal Fire', duration: 340, emotion: 'triumphant', intensity: 9 },
      { id: 't18', title: 'Renaissance Ultime', artist: 'Rebirth Symphony', duration: 420, emotion: 'victorious', intensity: 8 }
    ]
  },
  {
    id: 'cosmic-unity',
    name: 'L\'Unité Cosmique',
    description: 'Fusionne avec l\'univers entier',
    story: 'Tu n\'es plus séparé. Tu ES la musique, tu ES le cosmos, tu ES tout ce qui existe en parfaite harmonie.',
    mood: 'Transcendance absolue',
    color: 'from-violet-600 via-purple-500 to-fuchsia-500',
    icon: Star,
    unlockLevel: 7,
    visualEffect: 'galaxy',
    tracks: [
      { id: 't19', title: 'Om Universel', artist: 'Unity Collective', duration: 900, emotion: 'transcendent', intensity: 7 },
      { id: 't20', title: 'Conscience Infinie', artist: 'Cosmic Oneness', duration: 840, emotion: 'enlightened', intensity: 6 },
      { id: 't21', title: 'Fusion Totale', artist: 'All Is One', duration: 1080, emotion: 'unified', intensity: 7 }
    ]
  }
];

const MusicOdysseyPage: React.FC = () => {
  const { toast } = useToast();
  
  // Progression utilisateur
  const [userLevel, setUserLevel] = useState(1);
  const [listenTime, setListenTime] = useState(0);
  const [completedRealms, setCompletedRealms] = useState<string[]>([]);
  
  // État de lecture
  const [currentRealm, setCurrentRealm] = useState<MusicRealm | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([70]);
  
  // Effets visuels
  const [visualParticles, setVisualParticles] = useState<Array<any>>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calcul du niveau basé sur le temps d'écoute
  useEffect(() => {
    const level = Math.floor(listenTime / 1800) + 1; // Niveau up tous les 30 min
    setUserLevel(Math.min(level, 7));
  }, [listenTime]);

  // Timer d'écoute
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1);
      setListenTime(prev => prev + 1);
      
      // Génération de particules visuelles
      if (currentRealm) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          velocity: Math.random() * 2 + 1
        };
        setVisualParticles(prev => [...prev.slice(-20), newParticle]);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentRealm]);

  const startRealm = (realm: MusicRealm) => {
    setCurrentRealm(realm);
    setCurrentTrack(realm.tracks[0]);
    setIsPlaying(true);
    setCurrentTime(0);

    toast({
      title: `🎵 ${realm.name}`,
      description: realm.story,
      duration: 5000
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!currentRealm || !currentTrack) return;
    
    const currentIndex = currentRealm.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentRealm.tracks.length;
    
    setCurrentTrack(currentRealm.tracks[nextIndex]);
    setCurrentTime(0);
    
    // Marquer le royaume comme terminé si tous les tracks écoutés
    if (nextIndex === 0 && !completedRealms.includes(currentRealm.id)) {
      setCompletedRealms(prev => [...prev, currentRealm.id]);
      toast({
        title: '✨ Royaume complété !',
        description: `Tu as terminé ${currentRealm.name}`,
        duration: 3000
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const unlockedRealms = musicRealms.filter(r => userLevel >= r.unlockLevel);
  const nextRealm = musicRealms.find(r => userLevel < r.unlockLevel);

  return (
    <PageRoot className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Lecteur en plein écran */}
        <AnimatePresence>
          {isPlaying && currentRealm && currentTrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background"
            >
              <div className="relative h-full w-full overflow-hidden">
                {/* Fond animé avec particules */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentRealm.color} opacity-30`}>
                  {visualParticles.map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ x: p.x + '%', y: p.y + '%', scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 0.6, 0],
                        y: [p.y + '%', (p.y - 20) + '%']
                      }}
                      transition={{ duration: 3, ease: 'easeOut' }}
                      className="absolute rounded-full bg-white blur-xl"
                      style={{ width: p.size, height: p.size }}
                    />
                  ))}
                </div>

                {/* Contrôles centraux */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-8 max-w-2xl px-4">
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className={`mx-auto w-64 h-64 rounded-full bg-gradient-to-br ${currentRealm.color} flex items-center justify-center shadow-2xl`}
                    >
                      <div className="w-56 h-56 rounded-full bg-background/90 flex items-center justify-center">
                        <Music className="w-24 h-24" />
                      </div>
                    </motion.div>

                    <div className="space-y-4">
                      <Badge className={`bg-gradient-to-r ${currentRealm.color} text-white border-0`}>
                        {currentRealm.mood}
                      </Badge>
                      <h2 className="text-4xl font-bold">{currentTrack.title}</h2>
                      <p className="text-xl text-muted-foreground">{currentTrack.artist}</p>
                      
                      <div className="space-y-2">
                        <Progress 
                          value={(currentTime / currentTrack.duration) * 100} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(currentTrack.duration)}</span>
                        </div>
                      </div>

                      {/* Contrôles */}
                      <div className="flex items-center justify-center gap-6">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={togglePlay}
                          className="w-20 h-20 rounded-full"
                        >
                          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={nextTrack}
                          className="w-16 h-16 rounded-full"
                        >
                          <SkipForward className="w-6 h-6" />
                        </Button>
                      </div>

                      {/* Volume */}
                      <div className="flex items-center gap-4 max-w-xs mx-auto">
                        <Volume2 className="w-5 h-5" />
                        <Slider
                          value={volume}
                          onValueChange={setVolume}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => setIsPlaying(false)}
                      className="mt-8"
                    >
                      Retour aux royaumes
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vue principale */}
        {!isPlaying && (
          <>
            {/* Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Music className="w-10 h-10" />
                    Odyssée Musicale
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Explore 7 royaumes sonores thérapeutiques
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">Niveau {userLevel}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(listenTime / 60)} min d'écoute
                  </div>
                </div>
              </div>

              <Progress value={(userLevel / 7) * 100} className="h-3" />
            </div>

            {/* Grille des royaumes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicRealms.map((realm, idx) => {
                const isUnlocked = userLevel >= realm.unlockLevel;
                const isCompleted = completedRealms.includes(realm.id);
                const Icon = realm.icon;

                return (
                  <motion.div
                    key={realm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden h-full ${!isUnlocked && 'opacity-50'}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${realm.color} opacity-20`} />
                      
                      <CardContent className="p-6 relative space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`p-4 rounded-full bg-gradient-to-br ${realm.color}`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          {isCompleted && (
                            <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                          )}
                        </div>

                        <div>
                          <Badge variant="secondary" className="mb-2">
                            Niveau {realm.unlockLevel}
                          </Badge>
                          <h3 className="font-bold text-2xl mb-2">{realm.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {realm.description}
                          </p>
                          <p className="text-sm italic">
                            {realm.story.slice(0, 100)}...
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Heart className="w-4 h-4" />
                            <span>{realm.mood}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {realm.tracks.length} pistes • {Math.floor(realm.tracks.reduce((sum, t) => sum + t.duration, 0) / 60)} min
                          </div>
                        </div>

                        {isUnlocked ? (
                          <Button
                            onClick={() => startRealm(realm)}
                            className={`w-full bg-gradient-to-r ${realm.color}`}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Explorer ce royaume
                          </Button>
                        ) : (
                          <Button disabled className="w-full">
                            🔒 Niveau {realm.unlockLevel} requis
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Prochain royaume */}
            {nextRealm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">Prochain royaume</h3>
                        <p className="text-muted-foreground">
                          {nextRealm.name} • Niveau {nextRealm.unlockLevel}
                        </p>
                      </div>
                      <Progress 
                        value={((userLevel - (nextRealm.unlockLevel - 1)) / 1) * 100}
                        className="w-32 h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>
    </PageRoot>
  );
};

export default MusicOdysseyPage;
