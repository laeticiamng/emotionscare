
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Palette, Play, Shuffle } from 'lucide-react';

const MoodMixerPage: React.FC = () => {
  const [energy, setEnergy] = useState([50]);
  const [focus, setFocus] = useState([50]);
  const [calm, setCalmm] = useState([50]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mood Mixer</h1>
          <p className="text-muted-foreground">Créez votre cocktail émotionnel parfait</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Votre Mix Émotionnel
              </CardTitle>
              <CardDescription>Ajustez les curseurs selon votre état souhaité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Énergie</label>
                <Slider value={energy} onValueChange={setEnergy} max={100} step={1} />
                <span className="text-xs text-muted-foreground">{energy[0]}%</span>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Focus</label>
                <Slider value={focus} onValueChange={setFocus} max={100} step={1} />
                <span className="text-xs text-muted-foreground">{focus[0]}%</span>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Calme</label>
                <Slider value={calm} onValueChange={setCalmm} max={100} step={1} />
                <span className="text-xs text-muted-foreground">{calm[0]}%</span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Lancer le Mix
                </Button>
                <Button variant="outline">
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Résultat du Mix</CardTitle>
              <CardDescription>Votre profil émotionnel optimal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">Mix Créatif</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Ce mix favorise la créativité et la concentration douce.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodMixerPage;
