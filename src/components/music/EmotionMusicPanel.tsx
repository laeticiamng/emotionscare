// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useHumeAI } from '@/hooks/useHumeAI';
import { useEmotionMusic } from '@/hooks/useEmotionMusic';
import { motion, AnimatePresence } from 'framer-motion';

export const EmotionMusicPanel: React.FC = () => {
  const [analysisText, setAnalysisText] = useState('');
  const { analyzeEmotion, isProcessing: isAnalyzing, emotionResult } = useHumeAI();
  const { generateFromEmotion, isGenerating, emotionBadge, currentTask, error, rateLimitStatus } = useEmotionMusic();

  const handleAnalyzeAndGenerate = async () => {
    if (!analysisText.trim()) {
      return;
    }

    try {
      // 1. Analyser l'émotion via Hume (simulation pour l'instant)
      const result = await analyzeEmotion(analysisText);
      
      if (!result) return;

      // 2. Générer la musique basée sur l'émotion
      const emotionState = {
        valence: result.confidence || 0.7,
        arousal: 0.5,
        dominantEmotion: result.emotion,
        labels: [result.emotion]
      };

      await generateFromEmotion(emotionState);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Musique Émotionnelle
        </CardTitle>
        <CardDescription>
          Générez une musique personnalisée basée sur votre état émotionnel actuel
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Zone de saisie */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Comment vous sentez-vous ?</label>
          <textarea
            value={analysisText}
            onChange={(e) => setAnalysisText(e.target.value)}
            placeholder="Décrivez vos émotions, votre humeur du moment..."
            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
            disabled={isAnalyzing || isGenerating}
          />
        </div>

        {/* Badge émotionnel */}
        <AnimatePresence>
          {emotionBadge && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Badge variant="secondary" className="text-sm py-2 px-4">
                <Sparkles className="h-4 w-4 mr-2" />
                {emotionBadge}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rate limit status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Générations disponibles: {rateLimitStatus.remaining} / {rateLimitStatus.max}
          </span>
          <span>Fenêtre: 10 secondes</span>
        </div>

        {/* Bouton principal */}
        <Button
          onClick={handleAnalyzeAndGenerate}
          disabled={!analysisText.trim() || isAnalyzing || isGenerating}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création de votre musique...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyser et Générer
            </>
          )}
        </Button>

        {/* Task ID */}
        {currentTask && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="font-medium">Génération en cours</p>
            <p className="text-muted-foreground text-xs font-mono mt-1">
              ID: {currentTask.substring(0, 16)}...
            </p>
            <p className="text-xs mt-2">
              Votre musique sera prête dans ~30-40 secondes
            </p>
          </div>
        )}

        {/* Erreurs */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
          >
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="flex-1 text-sm text-destructive">
              {error}
            </div>
          </motion.div>
        )}

        {/* Informations RGPD */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>🔒 Vos données émotionnelles sont anonymisées</p>
          <p>🎵 Aucun audio brut n'est stocké par défaut</p>
          <p>✅ Conforme RGPD et respect de la vie privée</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicPanel;
