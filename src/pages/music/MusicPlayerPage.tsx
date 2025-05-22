
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, ListMusic, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Données simulées pour les morceaux de musique
const musicTracks = {
  '1': {
    id: '1',
    title: 'Méditation matinale',
    description: 'Sons apaisants pour commencer la journée en pleine conscience',
    category: 'Méditation',
    duration: 900, // 15 minutes in seconds
    artist: 'Emma Calmwell',
    image: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=600&auto=format&fit=crop',
    effects: ['Réduction du stress', 'Clarté mentale', 'Concentration améliorée'],
    audioUrl: '/sounds/ambient-calm.mp3',
    similarTracks: ['2', '3']
  },
  '2': {
    id: '2',
    title: 'Concentration profonde',
    description: 'Musique ambiante pour améliorer la concentration',
    category: 'Productivité',
    duration: 2700, // 45 minutes in seconds
    artist: 'Mind Architects',
    image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=600&auto=format&fit=crop',
    effects: ['Focus prolongé', 'Productivité accrue', 'Clarté cognitive'],
    audioUrl: '/sounds/ambient-calm.mp3',
    similarTracks: ['1', '4']
  },
  '3': {
    id: '3',
    title: 'Sérénité nocturne',
    description: 'Sons apaisants pour faciliter l\'endormissement',
    category: 'Sommeil',
    duration: 1800, // 30 minutes in seconds
    artist: 'Dream Soundscapes',
    image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=600&auto=format&fit=crop',
    effects: ['Qualité de sommeil améliorée', 'Réduction de l\'anxiété', 'Relaxation profonde'],
    audioUrl: '/sounds/ambient-calm.mp3',
    similarTracks: ['1', '4']
  },
  '4': {
    id: '4',
    title: 'Énergie positive',
    description: 'Mélodies rythmées pour se dynamiser',
    category: 'Énergie',
    duration: 1200, // 20 minutes in seconds
    artist: 'Vibe Collective',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    effects: ['Stimulation de l\'énergie', 'Humeur positive', 'Motivation accrue'],
    audioUrl: '/sounds/ambient-calm.mp3',
    similarTracks: ['2', '3']
  }
};

const MusicPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const track = id ? musicTracks[id] : null;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [audio] = useState(new Audio(track?.audioUrl || ''));

  // Formater le temps en minutes:secondes
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Gérer la lecture/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => {
        console.error("Erreur lors de la lecture audio:", e);
        toast.error("Impossible de lire l'audio. Veuillez réessayer.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Effets pour gérer l'audio
  useEffect(() => {
    if (track) {
      audio.src = track.audioUrl;
      audio.volume = volume[0] / 100;
      
      const updateProgress = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', () => setIsPlaying(false));
      
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', () => setIsPlaying(false));
        audio.pause();
      };
    }
  }, [track, audio, volume]);

  // Gérer le changement de volume
  useEffect(() => {
    audio.volume = volume[0] / 100;
  }, [volume, audio]);

  // Gérer le changement de position de lecture
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    audio.currentTime = newTime;
  };

  // Gérer les favoris
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  if (!track) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Morceau non trouvé</h2>
          <p className="mb-8 text-muted-foreground">
            Le morceau musical que vous recherchez n'existe pas.
          </p>
          <Button asChild>
            <Link to="/music">Retour à la bibliothèque</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/music')} 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour à la bibliothèque
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <motion.div 
                className="relative rounded-lg overflow-hidden aspect-square mb-6"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={track.image} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button 
                    size="icon"
                    className="h-16 w-16 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? 
                      <Pause className="h-8 w-8" /> : 
                      <Play className="h-8 w-8 ml-1" />
                    }
                  </Button>
                </div>
              </motion.div>

              <div className="mb-8">
                <Badge className="mb-3">{track.category}</Badge>
                <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
                <p className="text-muted-foreground mb-4">{track.artist}</p>
                <p>{track.description}</p>
              </div>

              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Bienfaits</h3>
                  <div className="space-y-2">
                    {track.effects.map((effect, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>{effect}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex flex-col space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(track.duration)}</span>
                    </div>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={track.duration}
                      step={1}
                      onValueChange={handleSeek}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex justify-center items-center gap-6">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10">
                            <SkipBack size={20} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Précédent</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Button 
                      onClick={togglePlayPause} 
                      size="icon" 
                      className="h-14 w-14 rounded-full"
                    >
                      {isPlaying ? 
                        <Pause size={24} /> : 
                        <Play size={24} className="ml-1" />
                      }
                    </Button>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10">
                            <SkipForward size={20} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Suivant</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Volume2 size={18} className="text-muted-foreground" />
                    <Slider
                      value={volume}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={setVolume}
                      className="flex-1"
                    />
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      variant={isFavorite ? "default" : "outline"} 
                      onClick={toggleFavorite}
                      className="flex items-center gap-2"
                    >
                      <Heart size={16} className={isFavorite ? "fill-current" : ""} />
                      {isFavorite ? "Favori" : "Ajouter aux favoris"}
                    </Button>
                    
                    <Button variant="outline" asChild className="flex items-center gap-2">
                      <Link to="/music">
                        <ListMusic size={16} />
                        Bibliothèque
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Vous pourriez aussi aimer</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {track.similarTracks.map((trackId) => {
                    const similarTrack = musicTracks[trackId];
                    return (
                      <Card key={trackId} className="overflow-hidden">
                        <div className="flex">
                          <img 
                            src={similarTrack.image} 
                            alt={similarTrack.title}
                            className="h-24 w-24 object-cover"
                          />
                          <div className="p-3 flex flex-col justify-between flex-1">
                            <div>
                              <h4 className="font-medium line-clamp-1">{similarTrack.title}</h4>
                              <p className="text-sm text-muted-foreground">{similarTrack.artist}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="text-xs">
                                {similarTrack.category}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                asChild
                                className="h-8 w-8 p-0"
                              >
                                <Link to={`/music/player/${similarTrack.id}`}>
                                  <Play size={14} />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default MusicPlayerPage;
