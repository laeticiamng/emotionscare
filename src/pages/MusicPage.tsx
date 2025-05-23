
import React, { useState, useEffect, useRef } from 'react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import {
  Music, Mic, Pause, Play, SkipBack, SkipForward, Volume2, Volume,
  Heart, RefreshCw, Shuffle, ListMusic, Wand2, Headphones
} from 'lucide-react';
import { toast } from 'sonner';
import useMusicGen from '@/hooks/api/useMusicGen';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl: string;
  genre?: string;
  emotion?: string;
}

const MusicPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { generateMusic, isGenerating } = useMusicGen();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<{ name: string; tracks: MusicTrack[] }[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [newPrompt, setNewPrompt] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [favoriteTrackIds, setFavoriteTrackIds] = useState<string[]>([]);
  
  // Initialize audio context for Web Audio API
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Listen for ended event
    audioRef.current.addEventListener('ended', handleTrackEnd);
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, []);
  
  // Update audio when currentTrack changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = volume / 100;
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast.error('Erreur lors de la lecture audio');
        });
      }
    }
  }, [currentTrack]);
  
  // Update isPlaying state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          toast.error('Erreur lors de la lecture audio');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Update current time
  useEffect(() => {
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Fetch music data
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setLoading(true);
        
        // Mock data for playlists
        const mockPlaylists = [
          {
            name: 'Recommandé pour vous',
            tracks: [
              {
                id: '1',
                title: 'Calm Morning Meditation',
                artist: 'Healing Sounds',
                duration: 180,
                url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-492.mp3',
                coverUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                genre: 'Méditation',
                emotion: 'Calme'
              },
              {
                id: '2',
                title: 'Joyful Day',
                artist: 'Positive Vibes',
                duration: 210,
                url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                coverUrl: 'https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                genre: 'Électronique',
                emotion: 'Joie'
              },
              {
                id: '3',
                title: 'Peaceful River',
                artist: 'Nature Sounds',
                duration: 240,
                url: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
                coverUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                genre: 'Nature',
                emotion: 'Sérénité'
              }
            ]
          },
          {
            name: 'Pour la méditation',
            tracks: [
              {
                id: '4',
                title: 'Deep Meditation',
                artist: 'Zen Master',
                duration: 300,
                url: 'https://assets.mixkit.co/music/preview/mixkit-deep-meditation-112.mp3',
                coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                genre: 'Méditation',
                emotion: 'Calme'
              },
              {
                id: '5',
                title: 'Morning Light',
                artist: 'Peaceful Sounds',
                duration: 270,
                url: 'https://assets.mixkit.co/music/preview/mixkit-peaceful-morning-light-130.mp3',
                coverUrl: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                genre: 'Méditation',
                emotion: 'Paix'
              }
            ]
          },
          {
            name: 'Pour l\'énergie',
            tracks: [
              {
                id: '6',
                title: 'Motivation Boost',
                artist: 'Energy Flow',
                duration: 190,
                url: 'https://assets.mixkit.co/music/preview/mixkit-raising-me-higher-34.mp3',
                coverUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                genre: 'Électronique',
                emotion: 'Motivation'
              },
              {
                id: '7',
                title: 'Workout Power',
                artist: 'Fitness Beats',
                duration: 220,
                url: 'https://assets.mixkit.co/music/preview/mixkit-creepy-insect-movement-19.mp3',
                coverUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                genre: 'Électronique',
                emotion: 'Énergie'
              }
            ]
          }
        ];
        
        setPlaylists(mockPlaylists);
        setFavoriteTrackIds(['1', '4']); // Mock favorite tracks
      } catch (error) {
        console.error('Error fetching music data:', error);
        toast.error('Erreur lors du chargement des playlists');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMusicData();
  }, []);
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleTrackEnd = () => {
    // Find next track in current playlist
    if (currentTrack) {
      const currentPlaylist = playlists.find(playlist => 
        playlist.tracks.some(track => track.id === currentTrack.id)
      );
      
      if (currentPlaylist) {
        const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
        if (currentIndex < currentPlaylist.tracks.length - 1) {
          // Play next track
          setCurrentTrack(currentPlaylist.tracks[currentIndex + 1]);
        } else {
          // End of playlist
          setIsPlaying(false);
          setCurrentTime(0);
        }
      }
    }
  };
  
  const handlePlay = (track: MusicTrack) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // Play new track
      setCurrentTrack(track);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };
  
  const handlePrevious = () => {
    if (!currentTrack) return;
    
    const currentPlaylist = playlists.find(playlist => 
      playlist.tracks.some(track => track.id === currentTrack.id)
    );
    
    if (currentPlaylist) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > 0) {
        setCurrentTrack(currentPlaylist.tracks[currentIndex - 1]);
        setCurrentTime(0);
        setIsPlaying(true);
      }
    }
  };
  
  const handleNext = () => {
    if (!currentTrack) return;
    
    const currentPlaylist = playlists.find(playlist => 
      playlist.tracks.some(track => track.id === currentTrack.id)
    );
    
    if (currentPlaylist) {
      const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex < currentPlaylist.tracks.length - 1) {
        setCurrentTrack(currentPlaylist.tracks[currentIndex + 1]);
        setCurrentTime(0);
        setIsPlaying(true);
      }
    }
  };
  
  const handleToggleFavorite = (trackId: string) => {
    if (favoriteTrackIds.includes(trackId)) {
      setFavoriteTrackIds(favoriteTrackIds.filter(id => id !== trackId));
      toast.success('Retiré des favoris');
    } else {
      setFavoriteTrackIds([...favoriteTrackIds, trackId]);
      toast.success('Ajouté aux favoris');
    }
  };
  
  const handleGenerateMusic = async () => {
    if (!newPrompt.trim()) {
      toast.error('Veuillez entrer une description pour générer de la musique');
      return;
    }
    
    try {
      const track = await generateMusic({
        prompt: newPrompt,
        title: `Généré à partir de: ${newPrompt.substring(0, 20)}...`
      });
      
      if (track) {
        // Add generated track to playlists
        const updatedPlaylists = [...playlists];
        const generatedPlaylist = updatedPlaylists.find(playlist => playlist.name === 'Généré par l\'IA');
        
        if (generatedPlaylist) {
          generatedPlaylist.tracks.unshift(track as unknown as MusicTrack);
        } else {
          updatedPlaylists.push({
            name: 'Généré par l\'IA',
            tracks: [track as unknown as MusicTrack]
          });
        }
        
        setPlaylists(updatedPlaylists);
        setCurrentTrack(track as unknown as MusicTrack);
        setIsPlaying(true);
        setNewPrompt('');
        toast.success('Musique générée avec succès');
      }
    } catch (error) {
      console.error('Error generating music:', error);
      toast.error('Erreur lors de la génération de musique');
    }
  };
  
  return (
    <UnifiedLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thérapie musicale</h1>
            <p className="text-muted-foreground">
              Explorez des playlists conçues pour améliorer votre bien-être émotionnel
            </p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="recommended">Recommandé</TabsTrigger>
            <TabsTrigger value="moods">Par humeur</TabsTrigger>
            <TabsTrigger value="generate">Générer</TabsTrigger>
            <TabsTrigger value="favorites">Favoris</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="space-y-6">
            {loading ? (
              <div className="space-y-8">
                {[1, 2].map(i => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map(j => (
                        <Skeleton key={j} className="h-[220px] w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : playlists.length > 0 ? (
              <div className="space-y-8">
                {playlists.map((playlist, index) => (
                  <div key={index} className="space-y-4">
                    <h2 className="text-2xl font-semibold">{playlist.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {playlist.tracks.map(track => (
                        <Card key={track.id} className="overflow-hidden">
                          <div 
                            className="h-40 bg-cover bg-center cursor-pointer"
                            style={{ backgroundImage: `url(${track.coverUrl})` }}
                            onClick={() => handlePlay(track)}
                          >
                            <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                              <Button 
                                variant="secondary" 
                                size="icon" 
                                className="h-12 w-12 rounded-full"
                              >
                                {isPlaying && currentTrack?.id === track.id ? (
                                  <Pause className="h-6 w-6" />
                                ) : (
                                  <Play className="h-6 w-6 ml-0.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold truncate">{track.title}</h3>
                                <p className="text-sm text-muted-foreground">{track.artist}</p>
                                <div className="flex gap-2 mt-2">
                                  {track.genre && <Badge variant="outline">{track.genre}</Badge>}
                                  {track.emotion && <Badge>{track.emotion}</Badge>}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={favoriteTrackIds.includes(track.id) ? 'text-red-500' : ''}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(track.id);
                                }}
                              >
                                <Heart className="h-5 w-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Music className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucune playlist disponible</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Essayez de générer de la musique personnalisée
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('generate')}
                >
                  Générer de la musique
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="moods" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Calme', color: 'bg-blue-100 dark:bg-blue-900', icon: <Volume className="h-6 w-6" /> },
                { name: 'Joie', color: 'bg-yellow-100 dark:bg-yellow-900', icon: <Headphones className="h-6 w-6" /> },
                { name: 'Motivation', color: 'bg-green-100 dark:bg-green-900', icon: <Music className="h-6 w-6" /> },
                { name: 'Concentration', color: 'bg-purple-100 dark:bg-purple-900', icon: <Headphones className="h-6 w-6" /> },
                { name: 'Détente', color: 'bg-teal-100 dark:bg-teal-900', icon: <Volume className="h-6 w-6" /> },
                { name: 'Méditation', color: 'bg-indigo-100 dark:bg-indigo-900', icon: <Music className="h-6 w-6" /> }
              ].map((mood, index) => (
                <Card key={index} className={`${mood.color} hover:bg-opacity-80 transition-all cursor-pointer`}>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-4 mb-4">
                      {mood.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{mood.name}</h3>
                    <Button 
                      className="mt-4" 
                      variant="secondary"
                      onClick={() => {
                        toast.success(`Playlist ${mood.name} chargée`);
                        setActiveTab('recommended');
                      }}
                    >
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Générer de la musique avec l'IA</CardTitle>
                <CardDescription>
                  Créez une ambiance musicale personnalisée basée sur votre description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Décrivez l'ambiance musicale que vous souhaitez (ex: musique calme avec sons de la nature pour méditer)"
                  className="min-h-[100px]"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                />
                <Button 
                  onClick={handleGenerateMusic}
                  disabled={isGenerating || !newPrompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? 'Génération en cours...' : 'Générer'}
                  <Wand2 className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
              <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                <p>La génération peut prendre jusqu'à 30 secondes selon la complexité de votre demande.</p>
              </CardFooter>
            </Card>
            
            {playlists.some(playlist => playlist.name === 'Généré par l\'IA') && (
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-semibold">Mes créations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists
                    .find(playlist => playlist.name === 'Généré par l\'IA')
                    ?.tracks.map(track => (
                      <Card key={track.id} className="overflow-hidden">
                        <div 
                          className="h-40 bg-cover bg-center cursor-pointer"
                          style={{ backgroundImage: `url(${track.coverUrl})` }}
                          onClick={() => handlePlay(track)}
                        >
                          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-12 w-12 rounded-full"
                            >
                              {isPlaying && currentTrack?.id === track.id ? (
                                <Pause className="h-6 w-6" />
                              ) : (
                                <Play className="h-6 w-6 ml-0.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold truncate">{track.title}</h3>
                              <p className="text-sm text-muted-foreground">{track.artist || 'IA Composer'}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={favoriteTrackIds.includes(track.id) ? 'text-red-500' : ''}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(track.id);
                              }}
                            >
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-[220px] w-full" />
                ))}
              </div>
            ) : favoriteTrackIds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playlists
                  .flatMap(playlist => playlist.tracks)
                  .filter(track => favoriteTrackIds.includes(track.id))
                  .map(track => (
                    <Card key={track.id} className="overflow-hidden">
                      <div 
                        className="h-40 bg-cover bg-center cursor-pointer"
                        style={{ backgroundImage: `url(${track.coverUrl})` }}
                        onClick={() => handlePlay(track)}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-12 w-12 rounded-full"
                          >
                            {isPlaying && currentTrack?.id === track.id ? (
                              <Pause className="h-6 w-6" />
                            ) : (
                              <Play className="h-6 w-6 ml-0.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold truncate">{track.title}</h3>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                            <div className="flex gap-2 mt-2">
                              {track.genre && <Badge variant="outline">{track.genre}</Badge>}
                              {track.emotion && <Badge>{track.emotion}</Badge>}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(track.id);
                            }}
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-10">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucun favori</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajoutez des morceaux à vos favoris pour les retrouver ici
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('recommended')}
                >
                  Parcourir les recommandations
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Music Player */}
        {currentTrack && (
          <Card className="fixed bottom-0 left-0 right-0 z-50 border-t">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 w-1/4">
                  <div 
                    className="h-12 w-12 bg-cover bg-center rounded"
                    style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
                  ></div>
                  <div className="truncate">
                    <p className="font-medium truncate">{currentTrack.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center w-2/4">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={handlePrevious} disabled={!currentTrack}>
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext} disabled={!currentTrack}>
                      <SkipForward className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 w-full mt-2">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <div className="w-full bg-muted rounded-full h-1.5 relative">
                      <div 
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 w-1/4 justify-end">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-5 w-5" />
                    <Slider 
                      value={[volume]} 
                      min={0} 
                      max={100} 
                      step={1} 
                      className="w-24"
                      onValueChange={(value) => setVolume(value[0])}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={favoriteTrackIds.includes(currentTrack.id) ? 'text-red-500' : ''}
                    onClick={() => handleToggleFavorite(currentTrack.id)}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ListMusic className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </UnifiedLayout>
  );
};

export default MusicPage;
