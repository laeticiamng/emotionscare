// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  Save, 
  RefreshCw, 
  Headphones, 
  Volume2, 
  Music2,
  Play 
} from 'lucide-react';
import AudioEqualizer from '@/components/music/AudioEqualizer';
import MusicMoodVisualization from './MusicMoodVisualization';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';

interface MixPreset {
  id: string;
  name: string;
  mood: string;
  settings: {
    bass: number;
    mid: number;
    treble: number;
    volume: number;
    tempo: number;
  }
}

const MusicMixer: React.FC = () => {
  const { toast } = useToast();
  const { currentTrack, playTrack } = useMusic();
  const [selectedMood, setSelectedMood] = useState<string>('calm');
  const [mixSettings, setMixSettings] = useState({
    bass: 50,
    mid: 50,
    treble: 50,
    volume: 75,
    tempo: 60
  });
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Predefined mix presets
  const mixPresets: MixPreset[] = [
    {
      id: 'focus-boost',
      name: 'Focus Boost',
      mood: 'focused',
      settings: { bass: 40, mid: 60, treble: 70, volume: 65, tempo: 70 }
    },
    {
      id: 'deep-calm',
      name: 'Deep Calm',
      mood: 'calm',
      settings: { bass: 60, mid: 45, treble: 30, volume: 50, tempo: 50 }
    },
    {
      id: 'energy-up',
      name: 'Energy Up',
      mood: 'energetic',
      settings: { bass: 80, mid: 70, treble: 75, volume: 85, tempo: 90 }
    },
    {
      id: 'sleep-aid',
      name: 'Sleep Aid',
      mood: 'calm',
      settings: { bass: 65, mid: 30, treble: 20, volume: 40, tempo: 40 }
    }
  ];

  // Apply a preset
  const applyPreset = (preset: MixPreset) => {
    setMixSettings(preset.settings);
    setSelectedMood(preset.mood);
    setActivePreset(preset.id);
    
    toast({
      title: "Preset appliqué",
      description: `"${preset.name}" est maintenant actif`
    });
  };

  // Handle slider changes
  const handleSettingChange = (setting: keyof typeof mixSettings, value: number[]) => {
    setMixSettings(prev => ({
      ...prev,
      [setting]: value[0]
    }));
    
    // When user changes settings manually, clear active preset
    setActivePreset(null);
  };

  // Save current mix as custom preset
  const saveCurrentMix = () => {
    // In a real app, this would save to a database
    toast({
      title: "Mix sauvegardé",
      description: "Votre mix personnalisé a été sauvegardé"
    });
  };

  // Reset to default settings
  const resetMix = () => {
    setMixSettings({
      bass: 50,
      mid: 50,
      treble: 50,
      volume: 75,
      tempo: 60
    });
    setActivePreset(null);
    
    toast({
      title: "Mix réinitialisé",
      description: "Tous les paramètres ont été remis à zéro"
    });
  };

  // Apply the mix and start playing
  const applyMix = () => {
    if (currentTrack) {
      playTrack(currentTrack);
    }
    
    toast({
      title: "Mix appliqué",
      description: "Vos paramètres de mixage sont maintenant actifs"
    });
  };

  return (
    <div className="space-y-6">
      {/* Audio Equalizer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="h-5 w-5 text-primary" />
            Mixage audio
          </CardTitle>
          <CardDescription>Ajustez les paramètres audio pour une expérience personnalisée</CardDescription>
        </CardHeader>
        <CardContent>
          <AudioEqualizer />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Réglages personnalisés</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block mb-1 text-sm">
                    Basse: {mixSettings.bass}%
                  </label>
                  <Slider
                    value={[mixSettings.bass]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleSettingChange('bass', value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm">
                    Medium: {mixSettings.mid}%
                  </label>
                  <Slider
                    value={[mixSettings.mid]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleSettingChange('mid', value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm">
                    Aigus: {mixSettings.treble}%
                  </label>
                  <Slider
                    value={[mixSettings.treble]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleSettingChange('treble', value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm">
                    Volume: {mixSettings.volume}%
                  </label>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[mixSettings.volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleSettingChange('volume', value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm">
                    Tempo: {mixSettings.tempo} BPM
                  </label>
                  <Slider
                    value={[mixSettings.tempo]}
                    min={40}
                    max={180}
                    step={1}
                    onValueChange={(value) => handleSettingChange('tempo', value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="default" onClick={applyMix} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Appliquer
                </Button>
                <Button variant="outline" onClick={saveCurrentMix}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="ghost" onClick={resetMix}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Presets recommandés</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mixPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant={activePreset === preset.id ? "default" : "outline"}
                    className="justify-start h-auto py-2"
                    onClick={() => applyPreset(preset)}
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="text-sm">{preset.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {preset.mood}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MusicMoodVisualization mood={selectedMood} />
        <MusicMoodVisualization mood={selectedMood === 'calm' ? 'focused' : 'calm'} />
      </div>
    </div>
  );
};

export default MusicMixer;
