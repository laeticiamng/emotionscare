import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VrHeadset, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, AlertCircle, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  audioUrl?: string;
  thumbnail: string;
  duration: number; // en secondes
  category: 'nature' | 'meditation' | 'space' | 'underwater' | 'fantasy';
  benefits: string[];
  emoji: string;
}

const vrEnvironments: VREnvironment[] = [
  {
    id: 'forest-meditation',
    name: 'Forêt Mystique',
    description: 'Une forêt enchantée avec des sons apaisants de la nature',
    videoUrl: '/videos/forest-360.mp4',
    audioUrl: '/audio/forest-ambience.mp3',
    thumbnail: '/images/forest-thumb.jpg',
    duration: 900, // 15 minutes
    category: 'nature',
    benefits: ['Réduction du stress', 'Connexion avec la nature', 'Amélioration de l\'humeur'],
    emoji: '🌲',
  },
  {
    id: 'ocean-depths',
    name: 'Profondeurs Océaniques',
    description: 'Plongez dans les profondeurs calmes de l\'océan',
    videoUrl: '/videos/ocean-360.mp4',
    audioUrl: '/audio/ocean-waves.mp3',
    thumbnail: '/images/ocean-thumb.jpg',
    duration: 1200, // 20 minutes
    category: 'underwater',
    benefits: ['Relaxation profonde', 'Sensation de flottement', 'Paix intérieure'],
    emoji: '🌊',
  },
  {
    id: 'mountain-sunrise',
    name: 'Lever de Soleil en Montagne',
    description: 'Assistez à un magnifique lever de soleil depuis un sommet',
    videoUrl: '/videos/mountain-360.mp4',
    audioUrl: '/audio/mountain-wind.mp3',
    thumbnail: '/images/mountain-thumb.jpg',
    duration: 600, // 10 minutes
    category: 'nature',
    benefits: ['Sentiment d\'élévation', 'Énergie positive', 'Clarté mentale'],
    emoji: '🏔️',
  },
  {
    id: 'space-meditation',
    name: 'Méditation Spatiale',
    description: 'Flottez dans l\'espace parmi les étoiles et les galaxies',
    videoUrl: '/videos/space-360.mp4',
    audioUrl: '/audio/space-ambience.mp3',
    thumbnail: '/images/space-thumb.jpg',
    duration: 1800, // 30 minutes
    category: 'space',
    benefits: ['Perspective cosmique', 'Transcendance', 'Sérénité absolue'],
    emoji: '🌌',
  },
  {
    id: 'zen-garden',
    name: 'Jardin Zen',
    description: 'Un jardin japonais traditionnel avec fontaine et bambous',
    videoUrl: '/videos/zen-garden-360.mp4',
    audioUrl: '/audio/zen-ambience.mp3',
    thumbnail: '/images/zen-thumb.jpg',
    duration: 1500, // 25 minutes
    category: 'meditation',
    benefits: ['Méditation profonde', 'Équilibre intérieur', 'Paix de l\'esprit'],
    emoji: '🎋',
  },
];

type VRSessionState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';

export const VRTherapy: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment>(vrEnvironments[0]);
  const [sessionState, setSessionState] = useState<VRSessionState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasVRSupport, setHasVRSupport] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Vérifier le support VR
  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
        setHasVRSupport(supported);
      });
    }
  }, []);

  // Gestion du temps de lecture
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const onEnded = () => setSessionState('ended');
    const onLoadStart = () => setSessionState('loading');
    const onCanPlay = () => {
      if (sessionState === 'loading') {
        setSessionState('idle');
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', onEnded);
    video.addEventListener('loadstart', onLoadStart);
    video.addEventListener('canplay', onCanPlay);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadstart', onLoadStart);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [sessionState]);

  // Gestion du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const startSession = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (!video) return;

    try {
      setSessionState('loading');
      
      if (audio && selectedEnvironment.audioUrl) {
        audio.src = selectedEnvironment.audioUrl;
        audio.loop = true;
      }
      
      video.src = selectedEnvironment.videoUrl;
      
      await video.play();
      if (audio) {
        await audio.play();
      }
      
      setSessionState('playing');
      setCurrentTime(0);
      toast.success(`Session VR démarrée: ${selectedEnvironment.name}`);
    } catch (error) {
      console.error('Error starting VR session:', error);
      toast.error('Erreur lors du démarrage de la session VR');
      setSessionState('idle');
    }
  };

  const pauseSession = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (video) video.pause();
    if (audio) audio.pause();
    
    setSessionState('paused');
    toast.info('Session VR mise en pause');
  };

  const resumeSession = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    try {
      if (video) await video.play();
      if (audio) await audio.play();
      
      setSessionState('playing');
      toast.info('Session VR reprise');
    } catch (error) {
      console.error('Error resuming session:', error);
      toast.error('Erreur lors de la reprise');
    }
  };

  const stopSession = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setSessionState('idle');
    setCurrentTime(0);
    toast.info('Session VR arrêtée');
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast.error('Erreur lors du passage en plein écran');
    }
  };

  const enterVRMode = async () => {
    if (!hasVRSupport) {
      toast.error('Votre appareil ne supporte pas la VR');
      return;
    }

    try {
      // Code pour entrer en mode VR (nécessite WebXR)
      toast.info('Mode VR non encore implémenté - Version de démo');
    } catch (error) {
      console.error('VR mode error:', error);
      toast.error('Erreur lors de l\'activation du mode VR');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'nature': return 'bg-green-500';
      case 'meditation': return 'bg-purple-500';
      case 'space': return 'bg-indigo-500';
      case 'underwater': return 'bg-blue-500';
      case 'fantasy': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
            <p className="text-muted-foreground">
              Vous devez être connecté pour accéder à la thérapie VR.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <VrHeadset className="h-10 w-10 text-primary" />
            Thérapie VR Immersive
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explorez des environnements virtuels apaisants pour votre bien-être mental
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sélection d'environnements */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Environnements</CardTitle>
                  <CardDescription>
                    Choisissez votre expérience immersive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vrEnvironments.map((env) => (
                    <button
                      key={env.id}
                      onClick={() => {
                        setSelectedEnvironment(env);
                        stopSession();
                      }}
                      className={cn(
                        "w-full p-4 rounded-lg text-left transition-all duration-300",
                        selectedEnvironment.id === env.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                      disabled={sessionState === 'loading'}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{env.emoji}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{env.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              getCategoryColor(env.category),
                              "text-white"
                            )}>
                              {env.category}
                            </span>
                            <span className="text-xs opacity-70">
                              {formatDuration(env.duration)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs opacity-80">
                        {env.description}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Bénéfices */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Bénéfices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedEnvironment.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Support VR */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <VrHeadset className="h-4 w-4" />
                    Mode VR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "flex items-center gap-2 p-3 rounded-lg text-sm",
                    hasVRSupport 
                      ? "bg-green-500/10 text-green-700" 
                      : "bg-yellow-500/10 text-yellow-700"
                  )}>
                    <span>{hasVRSupport ? '✅' : '⚠️'}</span>
                    <span>
                      {hasVRSupport 
                        ? "VR supportée" 
                        : "VR non détectée"
                      }
                    </span>
                  </div>
                  {hasVRSupport && (
                    <Button
                      onClick={enterVRMode}
                      size="sm"
                      className="w-full mt-3"
                      disabled={sessionState !== 'playing'}
                    >
                      Entrer en VR
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lecteur VR principal */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-2xl">{selectedEnvironment.emoji}</span>
                        {selectedEnvironment.name}
                      </CardTitle>
                      <CardDescription>
                        {selectedEnvironment.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleFullscreen}
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Lecteur vidéo 360° */}
                  <div
                    ref={containerRef}
                    className="relative bg-black rounded-lg overflow-hidden mb-6"
                    style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
                  >
                    <video
                      ref={videoRef}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      playsInline
                      muted={false}
                      style={{ 
                        filter: sessionState === 'loading' ? 'blur(5px)' : 'none',
                      }}
                    />
                    
                    {/* Audio séparé pour l'ambiance */}
                    <audio ref={audioRef} loop />
                    
                    {/* Overlay de chargement */}
                    {sessionState === 'loading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p>Chargement de l'environnement...</p>
                        </div>
                      </div>
                    )}

                    {/* Overlay de fin */}
                    {sessionState === 'ended' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-white text-center">
                          <h3 className="text-2xl mb-4">Session terminée</h3>
                          <p className="mb-6">Vous avez terminé votre session de thérapie VR</p>
                          <Button onClick={stopSession}>
                            Retour au menu
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contrôles */}
                  <div className="space-y-4">
                    {/* Barre de progression */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="min-w-[3rem]">
                        {formatDuration(currentTime)}
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedEnvironment.duration ? 
                              (currentTime / selectedEnvironment.duration) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="min-w-[3rem]">
                        {formatDuration(selectedEnvironment.duration)}
                      </span>
                    </div>

                    {/* Boutons de contrôle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {sessionState === 'idle' || sessionState === 'ended' ? (
                          <Button
                            onClick={startSession}
                            size="lg"
                            disabled={sessionState === 'loading'}
                          >
                            <Play className="mr-2 h-5 w-5" />
                            Démarrer la session
                          </Button>
                        ) : sessionState === 'playing' ? (
                          <Button onClick={pauseSession} variant="outline" size="lg">
                            <Pause className="mr-2 h-5 w-5" />
                            Pause
                          </Button>
                        ) : (
                          <Button onClick={resumeSession} size="lg">
                            <Play className="mr-2 h-5 w-5" />
                            Reprendre
                          </Button>
                        )}

                        <Button
                          onClick={stopSession}
                          variant="outline"
                          size="lg"
                          disabled={sessionState === 'idle'}
                        >
                          <RotateCcw className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Contrôle du volume */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};