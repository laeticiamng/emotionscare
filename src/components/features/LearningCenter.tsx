// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Clock, MessageCircle, ThumbsUp, Star, PlayCircle, PauseCircle } from 'lucide-react';

const LearningCenter: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'breathing', name: 'Respiration' },
    { id: 'meditation', name: 'Méditation' },
    { id: 'journaling', name: 'Journal' },
    { id: 'social', name: 'Relations' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const tutorials = [
    {
      id: 'tuto1',
      title: "Comment méditer en 5 minutes",
      duration: "4:30",
      category: "meditation",
      thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500&auto=format&fit=crop",
      views: 1243,
      rating: 4.8,
      new: true
    },
    {
      id: 'tuto2',
      title: "Technique de respiration 4-7-8",
      duration: "3:15",
      category: "breathing",
      thumbnail: "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?q=80&w=500&auto=format&fit=crop",
      views: 876,
      rating: 4.6
    },
    {
      id: 'tuto3',
      title: "Démarrer son journal émotionnel",
      duration: "5:45",
      category: "journaling",
      thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=500&auto=format&fit=crop",
      views: 592,
      rating: 4.7,
      new: true
    },
    {
      id: 'tuto4',
      title: "Cultiver l'intelligence émotionnelle",
      duration: "6:20",
      category: "social",
      thumbnail: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=500&auto=format&fit=crop",
      views: 731,
      rating: 4.5
    }
  ];

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(tuto => tuto.category === selectedCategory);
  
  const handlePlayVideo = (id: string) => {
    if (activeVideo === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveVideo(id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-primary" />
          Tutoriels vidéo
        </h3>
        <Button variant="ghost" size="sm" className="text-xs">
          Voir tout
        </Button>
      </div>
      
      {/* Catégories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(category => (
          <Button 
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {activeVideo && (
        <Card className="overflow-hidden relative">
          <div className="aspect-video bg-black/90 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <PauseCircle className="h-8 w-8" />
                ) : (
                  <PlayCircle className="h-8 w-8" />
                )}
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="font-medium">
                {tutorials.find(t => t.id === activeVideo)?.title}
              </h4>
              <div className="text-sm opacity-80 flex items-center mt-1">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{tutorials.find(t => t.id === activeVideo)?.duration}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTutorials.map((tutorial) => (
          <Card 
            key={tutorial.id} 
            className={`overflow-hidden transition-all ${activeVideo === tutorial.id ? 'border-primary' : ''}`}
          >
            <div 
              className="aspect-video bg-muted relative cursor-pointer group"
              style={{ 
                backgroundImage: `url(${tutorial.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={() => handlePlayVideo(tutorial.id)}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20"
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              
              {tutorial.new && (
                <Badge className="absolute top-2 right-2 bg-primary text-white">
                  Nouveau
                </Badge>
              )}
              
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {tutorial.duration}
              </div>
            </div>
            
            <CardContent className="p-3">
              <h4 className="font-medium line-clamp-1">{tutorial.title}</h4>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-amber-400 stroke-amber-400 mr-1" />
                  <span>{tutorial.rating}</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  <span>{tutorial.views} vues</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-0">
        <div className="flex items-start">
          <BookOpen className="h-5 w-5 text-primary mt-1 mr-3" />
          <div>
            <h4 className="font-medium">Témoignages vidéo</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Découvrez comment d'autres utilisateurs ont transformé leur vie grâce à nos outils émotionnels.
            </p>
            <Button variant="link" className="p-0 mt-2 h-auto" size="sm">
              Voir les témoignages
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LearningCenter;
