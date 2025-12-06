
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Activity, Zap, Music2, Headphones } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

interface AudioAnalysis {
  bpm: number;
  key: string;
  energy: number; // 0-1
  valence: number; // 0-1 (happiness)
  danceability: number; // 0-1
  acousticness: number; // 0-1
  instrumentalness: number; // 0-1
  loudness: number; // dB
  speechiness: number; // 0-1
  tempo_confidence: number; // 0-1
}

interface AudioAnalysisDisplayProps {
  className?: string;
}

const AudioAnalysisDisplay: React.FC<AudioAnalysisDisplayProps> = ({ className }) => {
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { currentTrack } = useMusic();

  // Simulation d'analyse audio avancée
  useEffect(() => {
    if (currentTrack) {
      setIsAnalyzing(true);
      
      // Simulation d'une API d'analyse audio
      setTimeout(() => {
        const mockAnalysis: AudioAnalysis = {
          bpm: Math.floor(Math.random() * 60) + 80, // 80-140 BPM
          key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.floor(Math.random() * 12)],
          energy: Math.random(),
          valence: Math.random(),
          danceability: Math.random(),
          acousticness: Math.random(),
          instrumentalness: Math.random(),
          loudness: -30 + Math.random() * 25, // -30 to -5 dB
          speechiness: Math.random() * 0.3, // Generally low for music
          tempo_confidence: 0.8 + Math.random() * 0.2
        };
        
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
      }, 1500);
    }
  }, [currentTrack]);

  const getEnergyLabel = (energy: number) => {
    if (energy < 0.3) return { label: 'Calme', color: 'bg-blue-500' };
    if (energy < 0.7) return { label: 'Modéré', color: 'bg-yellow-500' };
    return { label: 'Énergique', color: 'bg-red-500' };
  };

  const getValenceLabel = (valence: number) => {
    if (valence < 0.3) return { label: 'Mélancolique', color: 'bg-blue-600' };
    if (valence < 0.7) return { label: 'Neutre', color: 'bg-gray-500' };
    return { label: 'Joyeux', color: 'bg-green-500' };
  };

  const getKeyMode = (key: string) => {
    // Simulation majeur/mineur
    return Math.random() > 0.5 ? `${key} majeur` : `${key} mineur`;
  };

  if (!currentTrack) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analyse Audio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Sélectionnez une piste pour voir l'analyse
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analyse Audio
          {isAnalyzing && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ) : analysis ? (
          <>
            {/* Informations principales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium">Tempo</span>
                </div>
                <div className="text-2xl font-bold">{analysis.bpm} BPM</div>
                <Progress value={analysis.tempo_confidence * 100} className="h-1" />
                <span className="text-xs text-muted-foreground">
                  {Math.round(analysis.tempo_confidence * 100)}% confiance
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Tonalité</span>
                </div>
                <div className="text-xl font-bold">{getKeyMode(analysis.key)}</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(analysis.loudness)} dB
                </div>
              </div>
            </div>

            {/* Caractéristiques émotionnelles */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Caractéristiques
              </h4>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Énergie</span>
                    <Badge variant="outline" className={getEnergyLabel(analysis.energy).color}>
                      {getEnergyLabel(analysis.energy).label}
                    </Badge>
                  </div>
                  <Progress value={analysis.energy * 100} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Humeur</span>
                    <Badge variant="outline" className={getValenceLabel(analysis.valence).color}>
                      {getValenceLabel(analysis.valence).label}
                    </Badge>
                  </div>
                  <Progress value={analysis.valence * 100} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Dansabilité</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(analysis.danceability * 100)}%
                    </span>
                  </div>
                  <Progress value={analysis.danceability * 100} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Acoustique</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(analysis.acousticness * 100)}%
                    </span>
                  </div>
                  <Progress value={analysis.acousticness * 100} />
                </div>
              </div>
            </div>

            {/* Détails techniques */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Instrumental</div>
                <div className="text-sm font-medium">
                  {Math.round(analysis.instrumentalness * 100)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Paroles</div>
                <div className="text-sm font-medium">
                  {Math.round(analysis.speechiness * 100)}%
                </div>
              </div>
            </div>

            {/* Recommandation basée sur l'analyse */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Recommandation</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {analysis.energy > 0.7 && analysis.danceability > 0.7 
                  ? "Parfait pour l'entraînement ou la danse !"
                  : analysis.valence < 0.3 
                    ? "Idéal pour la réflexion et la méditation"
                    : analysis.acousticness > 0.7
                      ? "Excellent pour un moment de détente"
                      : "Polyvalent pour différentes activités"
                }
              </p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Erreur lors de l'analyse
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioAnalysisDisplay;
