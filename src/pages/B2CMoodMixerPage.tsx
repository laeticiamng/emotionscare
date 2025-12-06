// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Heart, Zap, Smile, CloudRain, Sun, Moon, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';

interface MoodComponent {
  id: string;
  name: string;
  color: string;
  icon: React.ElementType;
  description: string;
  value: number;
}

const B2CMoodMixerPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [moodComponents, setMoodComponents] = useState<MoodComponent[]>([
    {
      id: 'energy',
      name: 'Énergie',
      color: 'from-red-400 to-orange-500',
      icon: Zap,
      description: 'Niveau d\'activation et de dynamisme',
      value: 50
    },
    {
      id: 'calm',
      name: 'Calme',
      color: 'from-blue-400 to-cyan-500',
      icon: CloudRain,
      description: 'Sensation de paix et tranquillité',
      value: 70
    },
    {
      id: 'joy',
      name: 'Joie',
      color: 'from-yellow-400 to-orange-500',
      icon: Sun,
      description: 'Sentiment de bonheur et optimisme',
      value: 60
    },
    {
      id: 'focus',
      name: 'Focus',
      color: 'from-purple-400 to-indigo-500',
      icon: Sparkles,
      description: 'Concentration et clarté mentale',
      value: 40
    },
    {
      id: 'comfort',
      name: 'Réconfort',
      color: 'from-pink-400 to-rose-500',
      icon: Heart,
      description: 'Sensation de sécurité et bien-être',
      value: 80
    },
    {
      id: 'serenity',
      name: 'Sérénité',
      color: 'from-green-400 to-emerald-500',
      icon: Moon,
      description: 'Équilibre et harmonie intérieure',
      value: 55
    }
  ]);

  const updateMoodComponent = (id: string, value: number) => {
    setMoodComponents(prev => 
      prev.map(comp => comp.id === id ? { ...comp, value } : comp)
    );
  };

  const resetMixer = () => {
    setMoodComponents(prev =>
      prev.map(comp => ({ ...comp, value: 50 }))
    );
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const getCurrentMoodDescription = () => {
    const avgValue = moodComponents.reduce((sum, comp) => sum + comp.value, 0) / moodComponents.length;
    
    if (avgValue > 75) return "Humeur très positive et équilibrée";
    if (avgValue > 50) return "Humeur stable et agréable";
    if (avgValue > 25) return "Humeur modérée, quelques ajustements possibles";
    return "Humeur à améliorer, explorez nos suggestions";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Mood Mixer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Créez votre recette émotionnelle parfaite en mélangeant différents états d'esprit.
          </p>
        </motion.div>

        <Tabs defaultValue="mixer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mixer">Mixer Personnel</TabsTrigger>
            <TabsTrigger value="presets">Presets Émotion</TabsTrigger>
          </TabsList>

          <TabsContent value="mixer" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Smile className="w-5 h-5" />
                      Votre Mix Actuel
                    </CardTitle>
                    <CardDescription>
                      {getCurrentMoodDescription()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isPlaying ? "default" : "outline"}
                      onClick={togglePlayback}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? "Pause" : "Écouter"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetMixer}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Visualisation globale */}
                <div className="relative h-20 bg-muted rounded-lg overflow-hidden mb-6">
                  <div className="flex h-full">
                    {moodComponents.map((comp, index) => (
                      <motion.div
                        key={comp.id}
                        className={`bg-gradient-to-t ${comp.color} opacity-80`}
                        style={{ width: `${comp.value}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${comp.value}%` }}
                        transition={{ delay: index * 0.1 }}
                      />
                    ))}
                  </div>
                  
                  {isPlaying && (
                    <motion.div
                      className="absolute top-0 left-0 w-1 h-full bg-white"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>

                {/* Curseurs de composants */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moodComponents.map((component) => {
                    const Icon = component.icon;
                    return (
                      <motion.div
                        key={component.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${component.color}`} />
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{component.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {component.value}%
                          </Badge>
                        </div>
                        
                        <Slider
                          value={[component.value]}
                          onValueChange={(values) => updateMoodComponent(component.id, values[0])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        
                        <p className="text-xs text-muted-foreground">
                          {component.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Presets à venir</h3>
              <p className="text-muted-foreground">
                Les presets émotionnels seront bientôt disponibles pour des expériences personnalisées.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CMoodMixerPage;