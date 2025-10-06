// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Sparkles, Loader2, AlertCircle, Play } from 'lucide-react';
import { useHumeAI } from '@/hooks/useHumeAI';
import { useEmotionMusic } from '@/hooks/useEmotionMusic';
import { useSunoCallback } from '@/hooks/useSunoCallback';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const EmotionMusicPanel: React.FC = () => {
  const [analysisText, setAnalysisText] = useState('');
  const { analyzeEmotion, isProcessing: isAnalyzing, emotionResult } = useHumeAI();
  const { generateFromEmotion, isGenerating, emotionBadge, currentTask, error, rateLimitStatus, reset } = useEmotionMusic();
  const [manualPollResult, setManualPollResult] = useState<any>(null);
  const [isManualPolling, setIsManualPolling] = useState(false);
  
  const { latestCallback, isWaiting } = useSunoCallback({
    taskId: currentTask,
    onComplete: (callback) => {
      console.log('✅ Musique complète:', callback);
    },
    onError: (error) => {
      console.error('❌ Erreur génération:', error);
    }
  });

  const handleManualPoll = async () => {
    if (!currentTask) return;
    
    setIsManualPolling(true);
    try {
      const { data, error } = await supabase.functions.invoke('suno-poll-status', {
        body: { taskId: currentTask }
      });
      
      if (data && !error) {
        console.log('✅ Poll manuel résultat:', data);
        setManualPollResult(data);
        toast.success('État récupéré depuis Suno !');
      } else {
        toast.error('Impossible de récupérer l\'état');
      }
    } catch (err) {
      console.error('Erreur poll manuel:', err);
      toast.error('Erreur de polling');
    } finally {
      setIsManualPolling(false);
    }
  };

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

        {/* Gestion des erreurs améliorée */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-destructive/10 border border-destructive/30 rounded-md"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-destructive">Erreur de génération</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  {error.includes('not configured') && (
                    <p className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded border">
                      💡 <strong>Action requise:</strong> Les clés API (OPENAI_API_KEY, SUNO_API_KEY) 
                      doivent être configurées dans Supabase Edge Functions secrets.
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={reset}
                    className="mt-2"
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
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

        {/* Task ID et Status */}
        {currentTask && (
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md text-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Génération en cours</p>
                {isWaiting && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </div>
              <p className="text-muted-foreground text-xs font-mono mt-1">
                ID: {currentTask.substring(0, 16)}...
              </p>
              <p className="text-xs mt-2">
                {!latestCallback && !manualPollResult && 'Initialisation...'}
                {latestCallback?.callbackType === 'text' && '📝 Transcription en cours...'}
                {latestCallback?.callbackType === 'first' && '🎵 Streaming disponible !'}
                {latestCallback?.callbackType === 'complete' && '✅ Musique prête !'}
                {manualPollResult?.stage === 'first' && '🎵 Preview récupérée manuellement !'}
                {manualPollResult?.stage === 'complete' && '✅ Audio final récupéré !'}
              </p>
              
              {/* Bouton de polling manuel */}
              {!latestCallback && !manualPollResult && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleManualPoll}
                  disabled={isManualPolling}
                  className="w-full mt-3"
                >
                  {isManualPolling ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      🔍 Forcer la récupération
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Audio player si callback disponible */}
            {latestCallback?.data?.stream_url && (
              <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Play className="h-5 w-5 text-primary" />
                  <p className="font-medium text-sm">Écouter le streaming</p>
                </div>
                <audio 
                  controls 
                  className="w-full"
                  src={latestCallback.data.stream_url}
                  autoPlay={true}
                />
              </div>
            )}

            {latestCallback?.data?.audio_url && (
              <div className="p-4 bg-green-500/5 rounded-md border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-sm">Qualité finale disponible</p>
                </div>
                <audio 
                  controls 
                  className="w-full"
                  src={latestCallback.data.audio_url}
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => window.open(latestCallback.data.audio_url, '_blank')}
                >
                  Télécharger
                </Button>
              </div>
            )}

            {/* Audio player depuis poll manuel */}
            {manualPollResult?.streamUrl && (
              <div className="p-4 bg-primary/5 rounded-md border border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Play className="h-5 w-5 text-primary" />
                  <p className="font-medium text-sm">Preview (récupérée manuellement)</p>
                </div>
                <audio 
                  controls 
                  className="w-full"
                  src={manualPollResult.streamUrl}
                  autoPlay={true}
                />
              </div>
            )}

            {manualPollResult?.downloadUrl && (
              <div className="p-4 bg-green-500/5 rounded-md border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-sm">Audio final (récupéré manuellement)</p>
                </div>
                <audio 
                  controls 
                  className="w-full"
                  src={manualPollResult.downloadUrl}
                  autoPlay={true}
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => window.open(manualPollResult.downloadUrl, '_blank')}
                >
                  Télécharger
                </Button>
              </div>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                reset();
                setManualPollResult(null);
              }}
              className="w-full"
            >
              Nouvelle génération
            </Button>
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
