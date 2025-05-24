
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Music as MusicIcon,
  Headphones,
  Download,
  Plus,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
  genre: string;
  url?: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  mood: string;
  duration: string;
}

const Music: React.FC = () => {
  const { user } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const demoPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Relaxation profonde',
      description: 'Sons apaisants pour la méditation',
      mood: 'calm',
      duration: '45 min',
      tracks: [
        { id: '1', title: 'Océan paisible', artist: 'Nature Sounds', duration: '10:30', mood: 'calm', genre: 'ambient' },
        { id: '2', title: 'Forêt mystique', artist: 'Zen Garden', duration: '8:45', mood: 'calm', genre: 'ambient' },
        { id: '3', title: 'Pluie douce', artist: 'Rainy Moods', duration: '12:20', mood: 'calm', genre: 'nature' }
      ]
    },
    {
      id: '2',
      name: 'Énergisant',
      description: 'Musiques motivantes pour commencer la journée',
      mood: 'energetic',
      duration: '38 min',
      tracks: [
        { id: '4', title: 'Morning Sunshine', artist: 'Upbeat Collective', duration: '3:45', mood: 'energetic', genre: 'pop' },
        { id: '5', title: 'Power Up', artist: 'Motivation Music', duration: '4:20', mood: 'energetic', genre: 'electronic' },
        { id: '6', title: 'Rise and Shine', artist: 'Energy Boost', duration: '3:55', mood: 'energetic', genre: 'indie' }
      ]
    },
    {
      id: '3',
      name: 'Focus & Concentration',
      description: 'Ambiances pour améliorer votre concentration',
      mood: 'focused',
      duration: '60 min',
      tracks: [
        { id: '7', title: 'Deep Work', artist: 'Productivity Sounds', duration: '15:00', mood: 'focused', genre: 'ambient' },
        { id: '8', title: 'Brain Waves', artist: 'Focus Masters', duration: '20:30', mood: 'focused', genre: 'instrumental' },
        { id: '9', title: 'Concentration Flow', artist: 'Study Music', duration: '18:15', mood: 'focused', genre: 'classical' }
      ]
    }
  ];

  const moods = [
    { id: 'all', name: 'Toutes', color: 'bg-gray-100 text-gray-800' },
    { id: 'calm', name: 'Calme', color: 'bg-blue-100 text-blue-800' },
    { id: 'energetic', name: 'Énergique', color: 'bg-orange-100 text-orange-800' },
    { id: 'focused', name: 'Concentration', color: 'bg-green-100 text-green-800' },
    { id: 'happy', name: 'Joyeux', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'relaxed', name: 'Détendu', color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredPlaylists = demoPlaylists.filter(playlist => {
    const matchesMood = selectedMood === 'all' || playlist.mood === selectedMood;
    const matchesSearch = playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMood && matchesSearch;
  });

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      toast.success(`Lecture : ${track.title}`);
    }
  };

  const handleGeneratePlaylist = () => {
    toast.success('Génération d\'une playlist personnalisée basée sur votre humeur actuelle...');
    // Here you would integrate with MusicGen API
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Musique thérapeutique</h1>
            <p className="text-muted-foreground mt-1">
              Musiques et sons adaptés à votre état émotionnel
            </p>
          </div>
          
          <Button onClick={handleGeneratePlaylist} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Générer une playlist IA
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une playlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    {mood.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="space-y-6">
            {filteredPlaylists.length > 0 ? (
              filteredPlaylists.map((playlist, index) => (
                <Card key={playlist.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <MusicIcon className="h-5 w-5" />
                          <span>{playlist.name}</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {playlist.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={moods.find(m => m.id === playlist.mood)?.color}>
                          {moods.find(m => m.id === playlist.mood)?.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {playlist.duration}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {playlist.tracks.map((track, trackIndex) => (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                            currentTrack?.id === track.id ? 'bg-primary/10 border-primary' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handlePlayTrack(track)}
                            >
                              {currentTrack?.id === track.id && isPlaying ? 
                                <Pause className="h-4 w-4" /> : 
                                <Play className="h-4 w-4" />
                              }
                            </Button>
                            <div>
                              <p className="font-medium">{track.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {track.artist} • {track.genre}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {track.duration}
                            </span>
                            <Button size="icon" variant="ghost">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MusicIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {isDemoAccount 
                      ? 'Aucune playlist trouvée avec ces critères'
                      : 'Aucune playlist disponible'
                    }
                  </p>
                  <Button onClick={handleGeneratePlaylist}>
                    Créer ma première playlist
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Music Player & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Current Player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Headphones className="h-5 w-5" />
                <span>Lecture en cours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTrack ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <MusicIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-medium">{currentTrack.title}</h4>
                    <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="bg-muted h-1 rounded-full">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all"
                        style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{currentTrack.duration}</span>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-center items-center space-x-4">
                    <Button size="icon" variant="ghost">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon"
                      onClick={() => handlePlayTrack(currentTrack)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Volume */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <VolumeX className="h-4 w-4" />
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <Volume2 className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Additional Controls */}
                  <div className="flex justify-center space-x-2">
                    <Button size="icon" variant="ghost">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Repeat className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MusicIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une musique pour commencer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood-based Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>
                Basées sur votre état émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isDemoAccount ? (
                <>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Méditation guidée</p>
                    <p className="text-xs text-muted-foreground">Pour réduire le stress</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Sons de la nature</p>
                    <p className="text-xs text-muted-foreground">Pour la relaxation</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Musique classique</p>
                    <p className="text-xs text-muted-foreground">Pour la concentration</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Effectuez une analyse émotionnelle pour des recommandations personnalisées
                  </p>
                  <Button size="sm" variant="outline">
                    Analyser mes émotions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />
    </div>
  );
};

export default Music;
