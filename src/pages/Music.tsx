
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Music as MusicIcon, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  Heart,
  Brain,
  Leaf,
  Zap,
  Moon,
  Sun,
  Shuffle,
  Repeat
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Music: React.FC = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes par défaut
  const [volume, setVolume] = useState(70);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isDemo = user?.email?.endsWith('@exemple.fr');

  const moodCategories = [
    {
      id: 'calm',
      name: 'Calme & Sérénité',
      icon: Leaf,
      color: 'bg-green-500',
      description: 'Musiques apaisantes pour la relaxation',
      tracks: [
        { id: 1, title: 'Forêt Enchantée', artist: 'Nature Sounds', duration: '4:23', url: '/audio/calm1.mp3' },
        { id: 2, title: 'Méditation Océanique', artist: 'Zen Masters', duration: '6:15', url: '/audio/calm2.mp3' },
        { id: 3, title: 'Jardin Paisible', artist: 'Ambient Nature', duration: '5:42', url: '/audio/calm3.mp3' }
      ]
    },
    {
      id: 'energy',
      name: 'Énergie & Motivation',
      icon: Zap,
      color: 'bg-yellow-500',
      description: 'Rythmes dynamisants pour se motiver',
      tracks: [
        { id: 4, title: 'Nouvelle Journée', artist: 'Motivational Beats', duration: '3:45', url: '/audio/energy1.mp3' },
        { id: 5, title: 'Force Intérieure', artist: 'Power Vibes', duration: '4:12', url: '/audio/energy2.mp3' },
        { id: 6, title: 'Dépassement', artist: 'Epic Soundtracks', duration: '5:30', url: '/audio/energy3.mp3' }
      ]
    },
    {
      id: 'focus',
      name: 'Focus & Concentration',
      icon: Brain,
      color: 'bg-blue-500',
      description: 'Sons pour améliorer la concentration',
      tracks: [
        { id: 7, title: 'Ondes Alpha', artist: 'Brainwave Therapy', duration: '8:00', url: '/audio/focus1.mp3' },
        { id: 8, title: 'Café Studieux', artist: 'Lo-Fi Collective', duration: '3:28', url: '/audio/focus2.mp3' },
        { id: 9, title: 'Pluie Productive', artist: 'White Noise Studio', duration: '10:00', url: '/audio/focus3.mp3' }
      ]
    },
    {
      id: 'joy',
      name: 'Joie & Bonheur',
      icon: Sun,
      color: 'bg-orange-500',
      description: 'Mélodies joyeuses pour égayer l\'humeur',
      tracks: [
        { id: 10, title: 'Sourire du Matin', artist: 'Happy Melodies', duration: '3:15', url: '/audio/joy1.mp3' },
        { id: 11, title: 'Danse de Joie', artist: 'Uplifting Sounds', duration: '4:05', url: '/audio/joy2.mp3' },
        { id: 12, title: 'Éclat de Rire', artist: 'Joyful Tunes', duration: '2:58', url: '/audio/joy3.mp3' }
      ]
    },
    {
      id: 'sleep',
      name: 'Sommeil & Repos',
      icon: Moon,
      color: 'bg-purple-500',
      description: 'Sons doux pour favoriser l\'endormissement',
      tracks: [
        { id: 13, title: 'Berceuse Étoilée', artist: 'Sleep Therapy', duration: '12:00', url: '/audio/sleep1.mp3' },
        { id: 14, title: 'Nuit Paisible', artist: 'Dream Sounds', duration: '15:30', url: '/audio/sleep2.mp3' },
        { id: 15, title: 'Vagues Nocturnes', artist: 'Ocean Dreams', duration: '20:00', url: '/audio/sleep3.mp3' }
      ]
    },
    {
      id: 'love',
      name: 'Amour & Bienveillance',
      icon: Heart,
      color: 'bg-pink-500',
      description: 'Musiques douces pour cultiver l\'amour',
      tracks: [
        { id: 16, title: 'Cœur Ouvert', artist: 'Love Frequencies', duration: '5:45', url: '/audio/love1.mp3' },
        { id: 17, title: 'Compassion Infinie', artist: 'Healing Hearts', duration: '6:20', url: '/audio/love2.mp3' },
        { id: 18, title: 'Tendresse', artist: 'Soft Emotions', duration: '4:33', url: '/audio/love3.mp3' }
      ]
    }
  ];

  const playTrack = (track: any) => {
    if (isDemo) {
      // Simulation pour les comptes démo
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]));
      toast.success(`Lecture : ${track.title}`);
      
      // Simulation de progression
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      // Intégration réelle avec les APIs de musique
      setCurrentTrack(track);
      setIsPlaying(true);
      toast.success(`Lecture : ${track.title}`);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      toast.info('Pause');
    } else {
      toast.success('Lecture reprise');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectMood = (moodId: string) => {
    setSelectedMood(moodId);
    const mood = moodCategories.find(m => m.id === moodId);
    if (mood) {
      toast.success(`Playlist "${mood.name}" sélectionnée`);
    }
  };

  const selectedMoodData = moodCategories.find(m => m.id === selectedMood);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mb-4">
            <MusicIcon className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Musicothérapie</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Musiques personnalisées selon votre état émotionnel pour optimiser votre bien-être
          </p>
          {isDemo && (
            <Badge variant="secondary" className="mt-4">
              Mode démo - Aperçu des fonctionnalités
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Lecteur de musique */}
      {currentTrack && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <MusicIcon className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{currentTrack.title}</h3>
                  <p className="text-muted-foreground">{currentTrack.artist}</p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <Progress 
                      value={(currentTime / duration) * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={togglePlayPause}
                    size="icon"
                    className="h-12 w-12"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <Progress value={volume} className="w-20 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sélection d'humeur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Choisissez votre humeur</CardTitle>
            <CardDescription>
              Sélectionnez le type de musique adapté à votre état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodCategories.map((mood, index) => (
                <motion.div
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Button
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    onClick={() => selectMood(mood.id)}
                    className="h-auto flex flex-col items-center gap-3 p-6 w-full"
                  >
                    <div className={`p-3 rounded-full ${mood.color} text-white`}>
                      <mood.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{mood.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {mood.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des pistes */}
      {selectedMoodData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${selectedMoodData.color} text-white`}>
                  <selectedMoodData.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{selectedMoodData.name}</CardTitle>
                  <CardDescription>{selectedMoodData.description}</CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Aléatoire
                </Button>
                <Button variant="outline" size="sm">
                  <Repeat className="h-4 w-4 mr-2" />
                  Répéter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedMoodData.tracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                      currentTrack?.id === track.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center">
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="h-4 w-4 text-white" />
                        ) : (
                          <Play className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {track.duration}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bienfaits de la musicothérapie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Bienfaits de la musicothérapie</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Effets sur le cerveau :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stimule la production d'endorphines</li>
                  <li>• Améliore la concentration et la mémoire</li>
                  <li>• Réduit le cortisol (hormone du stress)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Bienfaits émotionnels :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Régule l'humeur naturellement</li>
                  <li>• Favorise la relaxation profonde</li>
                  <li>• Améliore la qualité du sommeil</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Music;
