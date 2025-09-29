
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, SkipBack, Volume2, Clock, Heart, Share2, Download } from 'lucide-react';

const PodcastPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [activePodcast, setActivePodcast] = useState<string | null>(null);
  
  const podcasts = [
    {
      id: 'pod1',
      title: "Comprendre ses émotions",
      host: "Dr. Sophie Martin",
      duration: "24:15",
      image: "https://images.unsplash.com/photo-1567596388756-f6d710c8fc07?q=80&w=300&auto=format&fit=crop",
      description: "Une exploration des mécanismes émotionnels et comment les identifier au quotidien.",
      category: "Psychologie",
      popular: true
    },
    {
      id: 'pod2',
      title: "Méditation guidée pour débutants",
      host: "Claire Dubois",
      duration: "18:30",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=300&auto=format&fit=crop",
      description: "Une séance de méditation accessible pour libérer le stress quotidien.",
      category: "Méditation",
      new: true
    },
    {
      id: 'pod3',
      title: "Émotions au travail",
      host: "Marc Leroy",
      duration: "32:45",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=300&auto=format&fit=crop",
      description: "Comment gérer ses émotions dans un environnement professionnel exigeant.",
      category: "Travail",
      popular: true
    }
  ];
  
  const handlePlay = (id: string) => {
    if (activePodcast === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActivePodcast(id);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Convertir la durée en secondes pour la simulation
  const getDurationInSeconds = (duration: string) => {
    const [mins, secs] = duration.split(':').map(Number);
    return mins * 60 + secs;
  };
  
  const activePodcastData = activePodcast ? podcasts.find(p => p.id === activePodcast) : null;
  const totalDuration = activePodcastData ? getDurationInSeconds(activePodcastData.duration) : 0;
  
  return (
    <div className="space-y-6">
      {/* Lecteur principal */}
      {activePodcast && (
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-24 h-24 bg-muted rounded-md overflow-hidden shrink-0">
              <img 
                src={activePodcastData?.image} 
                alt={activePodcastData?.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2">{activePodcastData?.category}</Badge>
                  <h3 className="font-medium">{activePodcastData?.title}</h3>
                  <p className="text-sm text-muted-foreground">{activePodcastData?.host}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="icon" 
                    className="h-10 w-10 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-8">
                      {formatTime(currentTime)}
                    </span>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={totalDuration}
                      step={1}
                      className="flex-1"
                      onValueChange={(value) => setCurrentTime(value[0])}
                    />
                    <span className="text-xs text-muted-foreground w-8">
                      {activePodcastData?.duration}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    className="w-24"
                    onValueChange={(value) => setVolume(value[0])}
                  />
                  <span className="text-xs text-muted-foreground">{volume}%</span>
                  
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span className="text-xs">Télécharger</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Liste des podcasts */}
      <div className="space-y-4">
        <h3 className="font-medium">EmotionsCare Talks</h3>
        
        {podcasts.map((podcast) => (
          <Card 
            key={podcast.id}
            className={`overflow-hidden transition-all hover:bg-muted/20 ${
              activePodcast === podcast.id ? 'border-primary' : ''
            }`}
            onClick={() => handlePlay(podcast.id)}
          >
            <div className="flex p-3 items-center gap-3 cursor-pointer">
              <div className="w-16 h-16 bg-muted rounded overflow-hidden shrink-0">
                <img 
                  src={podcast.image} 
                  alt={podcast.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h4 className="font-medium truncate">{podcast.title}</h4>
                    <p className="text-xs text-muted-foreground">{podcast.host}</p>
                  </div>
                  
                  {(podcast.new || podcast.popular) && (
                    <Badge className={podcast.new ? 'bg-blue-500' : 'bg-amber-500'} variant="secondary">
                      {podcast.new ? 'Nouveau' : 'Populaire'}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {podcast.description}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{podcast.duration}</span>
                  </div>
                  
                  <Button 
                    variant={activePodcast === podcast.id && isPlaying ? "default" : "outline"} 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(podcast.id);
                    }}
                  >
                    {activePodcast === podcast.id && isPlaying ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Écouter
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PodcastPlayer;
