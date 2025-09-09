/**
 * MoodMixerPage - Module Mood Mixer (/app/mood-mixer)
 * Mélangeur d'humeurs et de sons créatifs
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Save,
  Share2,
  Download,
  Shuffle,
  ArrowLeft,
  Sparkles,
  Heart,
  Zap,
  Sun,
  Moon,
  Coffee,
  Wind,
  Waves,
  Flame,
  Snowflake,
  Music,
  Settings
} from 'lucide-react';

interface MoodElement {
  id: string;
  name: string;
  type: 'emotion' | 'environment' | 'energy' | 'time';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  baseFrequency: number;
  intensity: number;
  isActive: boolean;
}

interface MixPreset {
  id: string;
  name: string;
  description: string;
  elements: string[];
  color: string;
  mood: string;
}

const MoodMixerPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMix, setCurrentMix] = useState<string | null>(null);
  const [playTime, setPlayTime] = useState(0);

  const [moodElements, setMoodElements] = useState<MoodElement[]>([
    {
      id: 'joy',
      name: 'Joie',
      type: 'emotion',
      icon: Sun,
      color: 'text-yellow-600',
      baseFrequency: 528,
      intensity: 0,
      isActive: false
    },
    {
      id: 'calm',
      name: 'Calme',
      type: 'emotion',
      icon: Moon,
      color: 'text-blue-600',
      baseFrequency: 432,
      intensity: 0,
      isActive: false
    },
    {
      id: 'energy',
      name: 'Énergie',
      type: 'energy',
      icon: Zap,
      color: 'text-orange-600',
      baseFrequency: 741,
      intensity: 0,
      isActive: false
    },
    {
      id: 'focus',
      name: 'Focus',
      type: 'energy',
      icon: Coffee,
      color: 'text-purple-600',
      baseFrequency: 40,
      intensity: 0,
      isActive: false
    },
    {
      id: 'nature',
      name: 'Nature',
      type: 'environment',
      icon: Wind,
      color: 'text-green-600',
      baseFrequency: 136,
      intensity: 0,
      isActive: false
    },
    {
      id: 'ocean',
      name: 'Océan',
      type: 'environment',
      icon: Waves,
      color: 'text-cyan-600',
      baseFrequency: 111,
      intensity: 0,
      isActive: false
    },
    {
      id: 'fire',
      name: 'Feu',
      type: 'energy',
      icon: Flame,
      color: 'text-red-600',
      baseFrequency: 963,
      intensity: 0,
      isActive: false
    },
    {
      id: 'winter',
      name: 'Fraîcheur',
      type: 'environment',
      icon: Snowflake,
      color: 'text-teal-600',
      baseFrequency: 174,
      intensity: 0,
      isActive: false
    }
  ]);

  const presets: MixPreset[] = [
    {
      id: 'morning',
      name: 'Réveil Énergisant',
      description: 'Parfait pour commencer la journée avec dynamisme',
      elements: ['joy', 'energy', 'nature'],
      color: 'bg-gradient-to-r from-yellow-100 to-orange-100',
      mood: 'Énergique'
    },
    {
      id: 'focus',
      name: 'Concentration Profonde',
      description: 'Ambiance optimale pour le travail et l\'étude',
      elements: ['focus', 'calm', 'ocean'],
      color: 'bg-gradient-to-r from-purple-100 to-blue-100',
      mood: 'Concentré'
    },
    {
      id: 'relax',
      name: 'Détente Absolue',
      description: 'Relaxation et méditation profonde',
      elements: ['calm', 'nature', 'winter'],
      color: 'bg-gradient-to-r from-blue-100 to-teal-100',
      mood: 'Paisible'
    },
    {
      id: 'creative',
      name: 'Inspiration Créative',
      description: 'Stimule la créativité et l\'innovation',
      elements: ['joy', 'fire', 'energy'],
      color: 'bg-gradient-to-r from-pink-100 to-red-100',
      mood: 'Inspiré'
    },
    {
      id: 'healing',
      name: 'Guérison Émotionnelle',
      description: 'Apaisement et reconstruction intérieure',
      elements: ['calm', 'nature', 'ocean'],
      color: 'bg-gradient-to-r from-green-100 to-blue-100',
      mood: 'Curatif'
    },
    {
      id: 'power',
      name: 'Force Intérieure',
      description: 'Renforcement de la confiance et du courage',
      elements: ['fire', 'energy', 'focus'],
      color: 'bg-gradient-to-r from-red-100 to-orange-100',
      mood: 'Puissant'
    }
  ];

  const updateElementIntensity = (elementId: string, intensity: number) => {
    setMoodElements(prev => prev.map(element => 
      element.id === elementId 
        ? { ...element, intensity, isActive: intensity > 0 }
        : element
    ));
  };

  const loadPreset = (preset: MixPreset) => {
    setCurrentMix(preset.id);
    
    // Reset tous les éléments
    setMoodElements(prev => prev.map(element => ({
      ...element,
      intensity: 0,
      isActive: false
    })));
    
    // Activation progressive des éléments du preset
    setTimeout(() => {
      setMoodElements(prev => prev.map(element => {
        if (preset.elements.includes(element.id)) {
          return {
            ...element,
            intensity: Math.floor(Math.random() * 40) + 60, // Entre 60-100
            isActive: true
          };
        }
        return element;
      }));
    }, 100);
  };

  const resetMixer = () => {
    setMoodElements(prev => prev.map(element => ({
      ...element,
      intensity: 0,
      isActive: false
    })));
    setCurrentMix(null);
    setIsPlaying(false);
    setPlayTime(0);
  };

  const randomizeMix = () => {
    setMoodElements(prev => prev.map(element => ({
      ...element,
      intensity: Math.random() > 0.6 ? Math.floor(Math.random() * 100) : 0,
      isActive: Math.random() > 0.6
    })));
    setCurrentMix('random');
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const saveMix = () => {
    const activeMix = moodElements.filter(e => e.isActive);
    console.log('Sauvegarde du mix:', activeMix);
  };

  const getActiveElements = () => {
    return moodElements.filter(e => e.isActive);
  };

  const getMixComplexity = () => {
    const activeCount = getActiveElements().length;
    if (activeCount === 0) return 'Silence';
    if (activeCount <= 2) return 'Simple';
    if (activeCount <= 4) return 'Équilibré';
    if (activeCount <= 6) return 'Riche';
    return 'Complexe';
  };

  // Timer de lecture
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatPlayTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Palette className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Mood Mixer</h1>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Créatif
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Créez votre ambiance sonore parfaite
                </h2>
                <p className="text-muted-foreground">
                  Mélangez différents éléments pour composer l'atmosphère idéale selon votre humeur
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mixer Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contrôles de lecture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Console de mixage
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Music className="h-4 w-4" />
                      {getMixComplexity()}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contrôles de lecture */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        size="lg"
                        onClick={togglePlayback}
                        disabled={getActiveElements().length === 0}
                        className="gap-2"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? 'Pause' : 'Lecture'}
                      </Button>
                      
                      <div className="text-lg font-mono">
                        {formatPlayTime(playTime)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <div className="w-24">
                          <Slider
                            value={volume}
                            onValueChange={setVolume}
                            max={100}
                            step={1}
                            className="cursor-pointer"
                          />
                        </div>
                        <span className="text-sm w-8">{volume[0]}%</span>
                      </div>

                      <Button variant="outline" size="sm" onClick={randomizeMix} className="gap-2">
                        <Shuffle className="h-4 w-4" />
                        Aléatoire
                      </Button>

                      <Button variant="outline" size="sm" onClick={resetMixer} className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                  </div>

                  {/* Barre de progression si en lecture */}
                  {isPlaying && (
                    <div className="space-y-2">
                      <Progress value={(playTime % 60) * (100/60)} className="h-1" />
                      <div className="text-xs text-muted-foreground text-center">
                        Mix en cours • {getActiveElements().length} éléments actifs
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Éléments de mood */}
              <Card>
                <CardHeader>
                  <CardTitle>Éléments de mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {moodElements.map(element => {
                      const Icon = element.icon;
                      return (
                        <div key={element.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className={`p-2 rounded-lg transition-all ${
                                  element.isActive 
                                    ? 'bg-primary/20 scale-110' 
                                    : 'bg-muted'
                                }`}
                              >
                                <Icon className={`h-4 w-4 ${element.isActive ? element.color : 'text-muted-foreground'}`} />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{element.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {element.baseFrequency}Hz
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-medium min-w-[3rem] text-right">
                              {element.intensity}%
                            </div>
                          </div>
                          
                          <Slider
                            value={[element.intensity]}
                            onValueChange={(value) => updateElementIntensity(element.id, value[0])}
                            max={100}
                            step={1}
                            className="cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  onClick={saveMix}
                  disabled={getActiveElements().length === 0}
                  className="flex-1 gap-2"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder le mix
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>

            {/* Presets et informations */}
            <div className="space-y-6">
              {/* Mix actuel */}
              {getActiveElements().length > 0 && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Mix Actuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">
                          {currentMix === 'random' ? 'Mix Aléatoire' :
                           currentMix ? presets.find(p => p.id === currentMix)?.name || 'Mix Personnalisé' :
                           'Mix Personnalisé'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getActiveElements().length} éléments • {getMixComplexity()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Éléments actifs :</h4>
                        <div className="flex gap-1 flex-wrap">
                          {getActiveElements().map(element => {
                            const Icon = element.icon;
                            return (
                              <div key={element.id} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                                <Icon className={`h-3 w-3 ${element.color}`} />
                                <span className="text-xs">{element.name}</span>
                                <span className="text-xs font-medium">{element.intensity}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Presets */}
              <Card>
                <CardHeader>
                  <CardTitle>Presets Populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {presets.map(preset => (
                      <div
                        key={preset.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          currentMix === preset.id ? 'ring-2 ring-primary' : ''
                        } ${preset.color}`}
                        onClick={() => loadPreset(preset)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{preset.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {preset.mood}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {preset.description}
                        </p>
                        <div className="flex gap-1">
                          {preset.elements.map(elementId => {
                            const element = moodElements.find(e => e.id === elementId);
                            if (!element) return null;
                            const Icon = element.icon;
                            return (
                              <Icon key={elementId} className={`h-3 w-3 ${element.color}`} />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Vos Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Mix créés</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temps d'écoute</span>
                      <span className="font-medium">14h 32m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Élément préféré</span>
                      <span className="font-medium flex items-center gap-1">
                        <Sun className="h-3 w-3 text-yellow-600" />
                        Joie
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mix favori</span>
                      <span className="font-medium">Concentration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoodMixerPage;