
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Palette, Music, Heart, Sparkles, Play, Pause } from 'lucide-react';

const MoodMixerPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [moodMix, setMoodMix] = useState({
    energy: [65],
    calm: [40],
    joy: [80],
    focus: [30]
  });

  const togglePlayback = () => setIsPlaying(!isPlaying);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Palette className="w-4 h-4 mr-2" />
              Mixage Émotionnel
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mood Mixer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Créez votre cocktail émotionnel parfait en ajustant les niveaux d'énergie, de calme, de joie et de focus
          </p>
        </div>

        {/* Mood Mixer Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-600" />
                Ajustements Émotionnels
              </CardTitle>
              <CardDescription>
                Personnalisez votre état d'esprit idéal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Energy */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-orange-600">Énergie</label>
                  <Badge variant="outline" className="text-orange-600">{moodMix.energy[0]}%</Badge>
                </div>
                <Slider
                  value={moodMix.energy}
                  onValueChange={(value) => setMoodMix({...moodMix, energy: value})}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Calm */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-blue-600">Calme</label>
                  <Badge variant="outline" className="text-blue-600">{moodMix.calm[0]}%</Badge>
                </div>
                <Slider
                  value={moodMix.calm}
                  onValueChange={(value) => setMoodMix({...moodMix, calm: value})}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Joy */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-pink-600">Joie</label>
                  <Badge variant="outline" className="text-pink-600">{moodMix.joy[0]}%</Badge>
                </div>
                <Slider
                  value={moodMix.joy}
                  onValueChange={(value) => setMoodMix({...moodMix, joy: value})}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Focus */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-green-600">Focus</label>
                  <Badge variant="outline" className="text-green-600">{moodMix.focus[0]}%</Badge>
                </div>
                <Slider
                  value={moodMix.focus}
                  onValueChange={(value) => setMoodMix({...moodMix, focus: value})}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Votre Mix Émotionnel
              </CardTitle>
              <CardDescription>
                Visualisation en temps réel de votre état ciblé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">
                    {moodMix.joy[0] > 70 ? '😊' : 
                     moodMix.calm[0] > 70 ? '😌' : 
                     moodMix.energy[0] > 70 ? '⚡' : 
                     moodMix.focus[0] > 70 ? '🎯' : '🙂'}
                  </div>
                  <div className="text-lg font-semibold">
                    {moodMix.joy[0] > 70 ? 'État Joyeux' : 
                     moodMix.calm[0] > 70 ? 'État Serein' : 
                     moodMix.energy[0] > 70 ? 'État Énergique' : 
                     moodMix.focus[0] > 70 ? 'État Concentré' : 'État Équilibré'}
                  </div>
                  <Button onClick={togglePlayback} className="bg-purple-600 hover:bg-purple-700">
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Activer le Mix'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="w-5 h-5 mr-2 text-orange-600" />
                Boost Matinal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Énergie</span>
                  <span className="text-sm font-semibold text-orange-600">90%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Joie</span>
                  <span className="text-sm font-semibold text-pink-600">80%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Focus</span>
                  <span className="text-sm font-semibold text-green-600">70%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-blue-600" />
                Détente Profonde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Calme</span>
                  <span className="text-sm font-semibold text-blue-600">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Joie</span>
                  <span className="text-sm font-semibold text-pink-600">60%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Énergie</span>
                  <span className="text-sm font-semibold text-orange-600">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-green-600" />
                Zone de Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Focus</span>
                  <span className="text-sm font-semibold text-green-600">90%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Calme</span>
                  <span className="text-sm font-semibold text-blue-600">75%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Énergie</span>
                  <span className="text-sm font-semibold text-orange-600">60%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodMixerPage;
