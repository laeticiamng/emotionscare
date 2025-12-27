import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Music, Save, RefreshCw, PlayCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MusicMixerProps {
  className?: string;
  onPlay?: (mixSettings: MixSettings) => void;
}

interface Track {
  id: string;
  name: string;
  type: string;
  volume: number;
  enabled: boolean;
}

interface MixSettings {
  name: string;
  tracks: Track[];
  tempo: number;
  masterVolume: number;
}

/**
 * Composant de mixage de musique permettant de créer des ambiances personnalisées
 */
const MusicMixer: React.FC<MusicMixerProps> = ({ className, onPlay }) => {
  const { toast } = useToast();
  const [mixSettings, setMixSettings] = useState<MixSettings>({
    name: 'Mon mix personnalisé',
    tracks: [
      { id: '1', name: 'Ambiance forêt', type: 'nature', volume: 70, enabled: true },
      { id: '2', name: 'Pluie légère', type: 'nature', volume: 40, enabled: false },
      { id: '3', name: 'Mélodie piano', type: 'instrument', volume: 60, enabled: true },
      { id: '4', name: 'Nappes synthé', type: 'synth', volume: 50, enabled: true },
      { id: '5', name: 'Battements binauraux', type: 'binaural', volume: 30, enabled: false }
    ],
    tempo: 60,
    masterVolume: 80
  });
  
  // Mettre à jour le volume d'une piste
  const updateTrackVolume = (trackId: string, volume: number) => {
    setMixSettings({
      ...mixSettings,
      tracks: mixSettings.tracks.map(track => 
        track.id === trackId ? { ...track, volume } : track
      )
    });
  };
  
  // Activer/désactiver une piste
  const toggleTrack = (trackId: string) => {
    setMixSettings({
      ...mixSettings,
      tracks: mixSettings.tracks.map(track => 
        track.id === trackId ? { ...track, enabled: !track.enabled } : track
      )
    });
  };
  
  // Jouer le mix
  const handlePlayMix = () => {
    if (onPlay) {
      onPlay(mixSettings);
    }
    
    toast({
      title: "Mix lancé",
      description: `"${mixSettings.name}" est en cours de lecture`
    });
  };
  
  // Sauvegarder le mix
  const saveMix = () => {
    toast({
      title: "Mix sauvegardé",
      description: `"${mixSettings.name}" a été ajouté à votre bibliothèque`
    });
  };
  
  // Réinitialiser le mix
  const resetMix = () => {
    setMixSettings({
      ...mixSettings,
      tracks: mixSettings.tracks.map(track => ({ ...track, volume: 50 })),
      tempo: 60,
      masterVolume: 80
    });
    
    toast({
      title: "Mix réinitialisé",
      description: "Tous les paramètres ont été remis à zéro"
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Mixage personnalisé
        </CardTitle>
        <CardDescription>Créez votre ambiance sonore idéale</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {mixSettings.tracks.map((track) => (
            <div key={track.id} className="grid grid-cols-[auto_1fr] gap-3 items-center">
              <Button 
                variant={track.enabled ? "default" : "outline"} 
                size="sm"
                className="w-28"
                onClick={() => toggleTrack(track.id)}
              >
                {track.name}
              </Button>
              <Slider
                value={[track.volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => updateTrackVolume(track.id, value[0])}
                disabled={!track.enabled}
                className={track.enabled ? "" : "opacity-50"}
              />
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Tempo: {mixSettings.tempo} BPM
            </label>
            <Slider
              value={[mixSettings.tempo]}
              min={40}
              max={200}
              step={1}
              onValueChange={(value) => setMixSettings({ ...mixSettings, tempo: value[0] })}
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">
              Volume principal: {mixSettings.masterVolume}%
            </label>
            <Slider
              value={[mixSettings.masterVolume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setMixSettings({ ...mixSettings, masterVolume: value[0] })}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-between">
          <Button variant="default" onClick={handlePlayMix} className="flex-1">
            <PlayCircle className="h-4 w-4 mr-2" />
            Jouer
          </Button>
          <Button variant="outline" onClick={saveMix}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="ghost" onClick={resetMix}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicMixer;
