import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, 
         Heart, Shuffle, Repeat, Music, Headphones, Clock, List } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  mood: string;
  category: string;
  cover: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  mood: string;
  duration: string;
}

const B2CMusicPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'recommended' | 'playlists' | 'library'>('recommended');

  const sampleTracks: Track[] = [
    {
      id: '1',
      title: 'Sérénité Matinale',
      artist: 'Sounds of Nature',
      duration: '4:32',
      mood: 'calm',
      category: 'méditation',
      cover: '🌅'
    },
    {
      id: '2',
      title: 'Énergie Positive',
      artist: 'Wellness Beats',
      duration: '3:45',
      mood: 'energetic',
      category: 'motivation',
      cover: '⚡'
    },
    {
      id: '3',
      title: 'Focus Profond',
      artist: 'Concentration Mix',
      duration: '6:12',
      mood: 'focused',
      category: 'travail',
      cover: '🧠'
    },
    {
      id: '4',
      title: 'Détente Océanique',
      artist: 'Ocean Waves',
      duration: '8:00',
      mood: 'relaxed',
      category: 'relaxation',
      cover: '🌊'
    }
  ];

  const playlists: Playlist[] = [
    {
      id: '1',
      name: 'Méditation Quotidienne',
      description: 'Sons apaisants pour votre pratique méditative',
      tracks: sampleTracks.filter(t => t.category === 'méditation'),
      mood: 'calm',
      duration: '32 min'
    },
    {
      id: '2',
      name: 'Boost d\'Énergie',
      description: 'Musiques motivantes pour commencer la journée',
      tracks: sampleTracks.filter(t => t.category === 'motivation'),
      mood: 'energetic',
      duration: '28 min'
    },
    {
      id: '3',
      name: 'Zone de Focus',
      description: 'Concentrez-vous avec ces ambiances sonores',
      tracks: sampleTracks.filter(t => t.category === 'travail'),
      mood: 'focused',
      duration: '45 min'
    },
    {
      id: '4',
      name: 'Relaxation Totale',
      description: 'Détendez-vous après une journée intense',
      tracks: sampleTracks.filter(t => t.category === 'relaxation'),
      mood: 'relaxed',
      duration: '38 min'
    }
  ];

  const handlePlayPause = (track?: Track) => {
    if (track && track.id !== currentTrack?.id) {
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'calm': return 'bg-blue-500';
      case 'energetic': return 'bg-yellow-500';
      case 'focused': return 'bg-purple-500';
      case 'relaxed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'calm': return 'Calme';
      case 'energetic': return 'Énergique';
      case 'focused': return 'Focus';
      case 'relaxed': return 'Relaxant';
      default: return mood;
    }
  };

  // Simulation de progression audio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/b2c/dashboard')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Musicothérapie</h1>
              <p className="text-gray-600">Musique adaptée à votre état émotionnel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Mode Casque
            </Button>
          </div>
        </div>

        {/* Lecteur principal */}
        {currentTrack && (
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="text-6xl">{currentTrack.cover}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">{currentTrack.title}</h3>
                  <p className="text-purple-100 mb-3">{currentTrack.artist}</p>
                  
                  {/* Contrôles de lecture */}
                  <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button 
                      onClick={() => handlePlayPause()} 
                      size="lg"
                      className="bg-white text-purple-500 hover:bg-gray-100"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Barre de progression */}
                  <div className="space-y-2">
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div 
                        className="bg-white h-1 rounded-full transition-all duration-200" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-purple-100">
                      <span>1:23</span>
                      <span>{currentTrack.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Contrôle volume */}
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation par onglets */}
        <div className="flex gap-2 border-b">
          {[
            { id: 'recommended', label: 'Recommandé', icon: Heart },
            { id: 'playlists', label: 'Playlists', icon: List },
            { id: 'library', label: 'Ma Bibliothèque', icon: Music }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Contenu par onglet */}
        {activeTab === 'recommended' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recommandé pour vous</h2>
              <p className="text-gray-600 mb-6">Basé sur votre dernier scan émotionnel</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sampleTracks.map((track) => (
                  <Card key={track.id} className="cursor-pointer hover:shadow-lg transition-all group">
                    <CardContent className="p-4">
                      <div className="text-center mb-3">
                        <div className="text-4xl mb-2">{track.cover}</div>
                        <h3 className="font-semibold text-sm">{track.title}</h3>
                        <p className="text-xs text-gray-600">{track.artist}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getMoodColor(track.mood)}>
                          {getMoodLabel(track.mood)}
                        </Badge>
                        <span className="text-xs text-gray-500">{track.duration}</span>
                      </div>
                      
                      <Button 
                        onClick={() => handlePlayPause(track)}
                        size="sm" 
                        className="w-full"
                        variant={currentTrack?.id === track.id && isPlaying ? "default" : "outline"}
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-3 h-3 mr-1" />
                        ) : (
                          <Play className="w-3 h-3 mr-1" />
                        )}
                        {currentTrack?.id === track.id && isPlaying ? 'En lecture' : 'Écouter'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Playlists Thématiques</h2>
              <p className="text-gray-600 mb-6">Collections musicales pour différents moments</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {playlists.map((playlist) => (
                  <Card key={playlist.id} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-2xl">
                          🎵
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{playlist.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{playlist.description}</p>
                          
                          <div className="flex items-center gap-4 mb-4">
                            <Badge className={getMoodColor(playlist.mood)}>
                              {getMoodLabel(playlist.mood)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              {playlist.duration}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Music className="w-3 h-3" />
                              {playlist.tracks.length} titres
                            </div>
                          </div>

                          <Button 
                            onClick={() => playlist.tracks[0] && handlePlayPause(playlist.tracks[0])}
                            className="w-full"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Écouter la playlist
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Ma Bibliothèque</h2>
              <p className="text-gray-600 mb-6">Vos morceaux et playlists favorites</p>
              
              <Card>
                <CardContent className="p-8 text-center">
                  <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Votre bibliothèque est vide</h3>
                  <p className="text-gray-600 mb-4">
                    Commencez à ajouter des morceaux à vos favoris pour les retrouver ici
                  </p>
                  <Button onClick={() => setActiveTab('recommended')}>
                    Explorer la musique
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section des statistiques d'écoute */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Vos Statistiques d'Écoute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">2h 34min</div>
                <div className="text-sm text-gray-600">Temps d'écoute cette semaine</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">156</div>
                <div className="text-sm text-gray-600">Titres écoutés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">Calme</div>
                <div className="text-sm text-gray-600">Humeur favorite</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CMusicPage;