import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, Heart, Smile, Palette, Play, Square, RotateCcw } from 'lucide-react';

const B2CARFiltersPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filters = [
    {
      id: 'calm',
      name: 'Sérénité',
      description: 'Filtre apaisant aux tons bleus',
      icon: Heart,
      color: 'bg-blue-500'
    },
    {
      id: 'joy',
      name: 'Joie',
      description: 'Filtre énergisant aux tons dorés',
      icon: Smile,
      color: 'bg-yellow-500'
    },
    {
      id: 'focus',
      name: 'Concentration',
      description: 'Filtre favorisant la focus',
      icon: Sparkles,
      color: 'bg-purple-500'
    },
    {
      id: 'energy',
      name: 'Énergie',
      description: 'Filtre dynamisant',
      icon: Palette,
      color: 'bg-red-500'
    }
  ];

  const handleFilterSelect = (filterId: string) => {
    setActiveFilter(filterId === activeFilter ? null : filterId);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const resetFilters = () => {
    setActiveFilter(null);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Filtres AR Émotionnels
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expérimentez avec nos filtres de réalité augmentée conçus pour influencer positivement votre état émotionnel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de prévisualisation */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Prévisualisation AR
                </CardTitle>
                <CardDescription>
                  {activeFilter ? `Filtre actif: ${filters.find(f => f.id === activeFilter)?.name}` : 'Aucun filtre sélectionné'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm opacity-75">Caméra AR simulée</p>
                    </div>
                  </div>
                  
                  {/* Overlay de filtre simulé */}
                  {activeFilter && (
                    <div 
                      className={`absolute inset-0 mix-blend-overlay opacity-30 ${
                        filters.find(f => f.id === activeFilter)?.color
                      }`}
                    />
                  )}

                  {/* Badge d'état */}
                  {isRecording && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive" className="animate-pulse">
                        ● Enregistrement
                      </Badge>
                    </div>
                  )}

                  {/* Contrôles de capture */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      size="lg"
                      variant={isRecording ? "destructive" : "default"}
                      onClick={toggleRecording}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      {isRecording ? <Square className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={resetFilters}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau des filtres */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Filtres Émotionnels
                </CardTitle>
                <CardDescription>
                  Sélectionnez un filtre pour améliorer votre bien-être
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = activeFilter === filter.id;
                  
                  return (
                    <motion.div
                      key={filter.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={isActive ? "default" : "outline"}
                        className="w-full h-auto p-4 flex flex-col items-start gap-2"
                        onClick={() => handleFilterSelect(filter.id)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className={`w-3 h-3 rounded-full ${filter.color}`} />
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{filter.name}</span>
                          {isActive && <Badge size="sm" className="ml-auto">Actif</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground text-left">
                          {filter.description}
                        </p>
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CARFiltersPage;