
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Palette, Plus, Shuffle, Save, Share2, Trash2, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface Emotion {
  name: string;
  color: string;
  intensity: number;
  icon: string;
}

interface MoodMix {
  id: string;
  name: string;
  emotions: Emotion[];
  totalIntensity: number;
  createdAt: string;
}

const MoodMixerPage: React.FC = () => {
  const [currentMix, setCurrentMix] = useState<Emotion[]>([]);
  const [savedMixes, setSavedMixes] = useState<MoodMix[]>([
    {
      id: '1',
      name: 'Morning Energy',
      emotions: [
        { name: 'Joie', color: '#FEF08A', intensity: 80, icon: '😊' },
        { name: 'Motivation', color: '#FFA500', intensity: 70, icon: '💪' },
        { name: 'Optimisme', color: '#87CEEB', intensity: 60, icon: '🌟' }
      ],
      totalIntensity: 70,
      createdAt: '2024-01-15'
    }
  ]);

  const availableEmotions = [
    { name: 'Joie', color: '#FEF08A', icon: '😊' },
    { name: 'Calme', color: '#E0F2FE', icon: '😌' },
    { name: 'Motivation', color: '#FFA500', icon: '💪' },
    { name: 'Gratitude', color: '#F0E68C', icon: '🙏' },
    { name: 'Confiance', color: '#9370DB', icon: '👑' },
    { name: 'Curiosité', color: '#20B2AA', icon: '🔍' },
    { name: 'Compassion', color: '#FFB6C1', icon: '💖' },
    { name: 'Créativité', color: '#FF6347', icon: '🎨' },
    { name: 'Paix', color: '#E6E6FA', icon: '☮️' },
    { name: 'Détermination', color: '#CD5C5C', icon: '🎯' },
    { name: 'Optimisme', color: '#87CEEB', icon: '🌟' },
    { name: 'Amour', color: '#FF69B4', icon: '❤️' },
  ];

  const addEmotionToMix = (emotion: { name: string; color: string; icon: string }) => {
    const newEmotion: Emotion = {
      ...emotion,
      intensity: 50
    };
    setCurrentMix(prev => [...prev, newEmotion]);
  };

  const updateEmotionIntensity = (index: number, intensity: number) => {
    setCurrentMix(prev => prev.map((emotion, i) => 
      i === index ? { ...emotion, intensity } : emotion
    ));
  };

  const removeEmotionFromMix = (index: number) => {
    setCurrentMix(prev => prev.filter((_, i) => i !== index));
  };

  const saveMix = () => {
    if (currentMix.length === 0) return;
    
    const totalIntensity = currentMix.reduce((sum, emotion) => sum + emotion.intensity, 0) / currentMix.length;
    const newMix: MoodMix = {
      id: Date.now().toString(),
      name: `Mix ${savedMixes.length + 1}`,
      emotions: [...currentMix],
      totalIntensity: Math.round(totalIntensity),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setSavedMixes(prev => [...prev, newMix]);
  };

  const loadMix = (mix: MoodMix) => {
    setCurrentMix([...mix.emotions]);
  };

  const generateRandomMix = () => {
    const shuffled = [...availableEmotions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
    const newMix = selected.map(emotion => ({
      ...emotion,
      intensity: 30 + Math.floor(Math.random() * 50)
    }));
    setCurrentMix(newMix);
  };

  const getMixColor = () => {
    if (currentMix.length === 0) return '#E5E7EB';
    
    // Blend colors based on intensity
    let r = 0, g = 0, b = 0, totalWeight = 0;
    
    currentMix.forEach(emotion => {
      const color = emotion.color;
      const weight = emotion.intensity;
      const rgb = hexToRgb(color);
      if (rgb) {
        r += rgb.r * weight;
        g += rgb.g * weight;
        b += rgb.b * weight;
        totalWeight += weight;
      }
    });
    
    if (totalWeight === 0) return '#E5E7EB';
    
    r = Math.round(r / totalWeight);
    g = Math.round(g / totalWeight);
    b = Math.round(b / totalWeight);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            <Palette className="w-4 h-4 mr-2" />
            Mood Mixer - Créateur d'Émotions
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Mixez vos Émotions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Créez des mélanges d'émotions personnalisés pour cultiver l'état d'esprit parfait. 
            Explorez, sauvegardez et partagez vos recettes de bien-être.
          </p>
        </div>

        {/* Current Mix Visualizer */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Votre Mix Actuel</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={generateRandomMix}>
                  <Shuffle className="w-4 h-4 mr-2" />
                  Aléatoire
                </Button>
                <Button variant="outline" size="sm" onClick={saveMix} disabled={currentMix.length === 0}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Preview */}
            <div 
              className="h-24 rounded-lg flex items-center justify-center text-white font-medium text-lg shadow-inner"
              style={{ backgroundColor: getMixColor() }}
            >
              {currentMix.length === 0 ? 'Ajoutez des émotions pour voir le mélange' : `Mix de ${currentMix.length} émotions`}
            </div>

            {/* Current Emotions */}
            {currentMix.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Émotions dans votre mix :</h3>
                {currentMix.map((emotion, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-white/50">
                    <span className="text-2xl">{emotion.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{emotion.name}</span>
                        <span className="text-sm text-muted-foreground">{emotion.intensity}%</span>
                      </div>
                      <Slider
                        value={[emotion.intensity]}
                        onValueChange={([value]) => updateEmotionIntensity(index, value)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeEmotionFromMix(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="saved">Mix Sauvegardés</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Palette d'Émotions</CardTitle>
                <p className="text-muted-foreground">Cliquez sur une émotion pour l'ajouter à votre mix</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {availableEmotions.map((emotion, index) => (
                    <button
                      key={index}
                      onClick={() => addEmotionToMix(emotion)}
                      className="p-4 border rounded-lg hover:shadow-md transition-all hover:scale-105 bg-white/70 backdrop-blur-sm"
                      style={{ borderColor: emotion.color }}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl">{emotion.icon}</div>
                        <div className="text-sm font-medium">{emotion.name}</div>
                        <div 
                          className="w-full h-2 rounded"
                          style={{ backgroundColor: emotion.color }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMixes.map((mix) => (
                <Card key={mix.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{mix.name}</span>
                      <Badge variant="outline">{mix.totalIntensity}%</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Créé le {mix.createdAt}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      {mix.emotions.map((emotion, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xl">{emotion.icon}</div>
                          <div className="text-xs text-muted-foreground">{emotion.intensity}%</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => loadMix(mix)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Charger
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Énergie Matinale',
                  description: 'Démarrez la journée du bon pied',
                  emotions: ['😊', '💪', '🌟'],
                  color: 'from-yellow-400 to-orange-500'
                },
                {
                  name: 'Calme Profond',
                  description: 'Pour la relaxation et la méditation',
                  emotions: ['😌', '☮️', '💙'],
                  color: 'from-blue-400 to-purple-500'
                },
                {
                  name: 'Focus Créatif',
                  description: 'Boostez votre créativité',
                  emotions: ['🎨', '🔍', '✨'],
                  color: 'from-purple-400 to-pink-500'
                },
                {
                  name: 'Confiance en Soi',
                  description: 'Renforcez votre estime personnelle',
                  emotions: ['👑', '💪', '🎯'],
                  color: 'from-red-400 to-pink-500'
                }
              ].map((preset, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`h-16 rounded-lg bg-gradient-to-r ${preset.color} flex items-center justify-center mb-4`}>
                      <div className="flex gap-2 text-2xl">
                        {preset.emotions.map((emoji, i) => (
                          <span key={i}>{emoji}</span>
                        ))}
                      </div>
                    </div>
                    <CardTitle>{preset.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Utiliser ce preset
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MoodMixerPage;
