// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { useClinicalMusicGeneration } from '@/hooks/useClinicalMusicGeneration';
import { Progress } from '@/components/ui/progress';

interface ClinicalMusicGeneratorProps {
  className?: string;
}

/**
 * Composant pour générer de la musique basée sur l'historique émotionnel
 * stocké dans clinical_signals
 */
const ClinicalMusicGenerator: React.FC<ClinicalMusicGeneratorProps> = ({ className }) => {
  const { 
    isAnalyzing, 
    isGenerating, 
    trend, 
    analyzeEmotionalTrend,
    generateMusicFromHistory 
  } = useClinicalMusicGeneration();

  const [timeWindow, setTimeWindow] = useState(30); // minutes

  const handleAnalyze = () => {
    analyzeEmotionalTrend({ timeWindowMinutes: timeWindow });
  };

  const handleGenerate = () => {
    generateMusicFromHistory({ timeWindowMinutes: timeWindow });
  };

  const getEmotionColor = (valence: number, arousal: number) => {
    if (valence >= 60 && arousal >= 60) return 'text-green-500';
    if (valence >= 60 && arousal < 40) return 'text-blue-500';
    if (valence < 40 && arousal >= 60) return 'text-orange-500';
    if (valence < 40 && arousal < 40) return 'text-purple-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Génération musicale depuis votre historique
        </CardTitle>
        <CardDescription>
          Créez une musique personnalisée basée sur vos émotions récentes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sélection fenêtre temporelle */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Fenêtre d'analyse</label>
          <div className="flex gap-2">
            {[10, 30, 60].map((minutes) => (
              <Button
                key={minutes}
                variant={timeWindow === minutes ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeWindow(minutes)}
              >
                <Clock className="h-3 w-3 mr-1" />
                {minutes}min
              </Button>
            ))}
          </div>
        </div>

        {/* Bouton d'analyse */}
        <Button 
          onClick={handleAnalyze} 
          variant="outline" 
          className="w-full"
          disabled={isAnalyzing}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser mes émotions'}
        </Button>

        {/* Résultats de l'analyse */}
        {trend && (
          <div className="space-y-3 p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Émotion dominante</span>
              <Badge variant="secondary" className="capitalize">
                {trend.dominantEmotion}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Valence (humeur)</span>
                <span className={getEmotionColor(trend.avgValence, trend.avgArousal)}>
                  {trend.avgValence}%
                </span>
              </div>
              <Progress value={trend.avgValence} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Arousal (énergie)</span>
                <span className={getEmotionColor(trend.avgValence, trend.avgArousal)}>
                  {trend.avgArousal}%
                </span>
              </div>
              <Progress value={trend.avgArousal} className="h-2" />
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              Analyse sur {trend.timeWindow} • {Object.keys(trend.emotionCount).length} émotions détectées
            </div>
          </div>
        )}

        {/* Bouton de génération */}
        <Button 
          onClick={handleGenerate} 
          className="w-full"
          disabled={isGenerating || isAnalyzing}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? 'Génération en cours...' : 'Générer ma musique'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          💡 La musique sera créée en fonction de votre état émotionnel moyen
        </p>
      </CardContent>
    </Card>
  );
};

export default ClinicalMusicGenerator;
