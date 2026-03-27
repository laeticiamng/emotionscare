// @ts-nocheck
/**
 * Hume AI Real-time Emotion Analysis Page
 * Multimodal emotion detection: facial, vocal, and text analysis
 */

import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Mic,
  MessageSquare,
  ArrowLeft,
  Activity,
  Loader2,
  Power,
  PowerOff,
  BarChart3,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import PageRoot from '@/components/common/PageRoot';
import { useHumeStream } from '@/hooks/useHumeStream';
import { cn } from '@/lib/utils';

const EMOTION_COLORS: Record<string, string> = {
  joy: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  calm: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  sadness: 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30',
  anger: 'bg-red-500/20 text-red-700 border-red-500/30',
  fear: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  surprise: 'bg-amber-500/20 text-amber-700 border-amber-500/30',
  neutral: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  disgust: 'bg-green-500/20 text-green-700 border-green-500/30',
};

const EMOTION_LABELS: Record<string, string> = {
  joy: 'Joie',
  calm: 'Calme',
  sadness: 'Tristesse',
  anger: 'Colère',
  fear: 'Peur',
  surprise: 'Surprise',
  neutral: 'Neutre',
  disgust: 'Dégoût',
};

function getValenceLabel(valence: number): string {
  if (valence > 0.7) return 'Très positif';
  if (valence > 0.55) return 'Positif';
  if (valence > 0.45) return 'Neutre';
  if (valence > 0.3) return 'Négatif';
  return 'Très négatif';
}

function getArousalLabel(arousal: number): string {
  if (arousal > 0.7) return 'Haute énergie';
  if (arousal > 0.55) return 'Énergie modérée';
  if (arousal > 0.45) return 'Calme';
  if (arousal > 0.3) return 'Très calme';
  return 'Repos profond';
}

export default function HumeAIRealtimePage() {
  const {
    isConnected,
    currentEmotion,
    error,
    isAnalyzing,
    connect,
    disconnect,
    sendText,
  } = useHumeStream();

  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [history, setHistory] = useState<
    Array<{ emotion: string; valence: number; arousal: number; confidence: number; timestamp: number; source: string }>
  >([]);

  const handleTextAnalysis = useCallback(async () => {
    if (!textInput.trim() || !isConnected) return;
    await sendText(textInput);
    setTextInput('');
  }, [textInput, isConnected, sendText]);

  // Track emotion history
  React.useEffect(() => {
    if (currentEmotion) {
      setHistory((prev) => [
        {
          emotion: currentEmotion.dominantEmotion,
          valence: currentEmotion.valence,
          arousal: currentEmotion.arousal,
          confidence: currentEmotion.confidence,
          timestamp: currentEmotion.timestamp,
          source: activeTab,
        },
        ...prev.slice(0, 19), // Keep last 20
      ]);
    }
  }, [currentEmotion, activeTab]);

  const dominantEmotion = currentEmotion?.dominantEmotion || 'neutral';
  const emotionColor = EMOTION_COLORS[dominantEmotion] || EMOTION_COLORS.neutral;
  const emotionLabel = EMOTION_LABELS[dominantEmotion] || dominantEmotion;

  return (
    <PageRoot>
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/app/scan" aria-label="Retour au scan">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Analyse émotionnelle IA</h1>
              <p className="text-sm text-muted-foreground">
                Détection multimodale par Hume AI
              </p>
            </div>
          </div>
          <Button
            variant={isConnected ? 'destructive' : 'default'}
            onClick={isConnected ? disconnect : connect}
            className="gap-2"
          >
            {isConnected ? (
              <>
                <PowerOff className="h-4 w-4" />
                Déconnecter
              </>
            ) : (
              <>
                <Power className="h-4 w-4" />
                Activer l'analyse
              </>
            )}
          </Button>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Status bar */}
        <Card>
          <CardContent className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
                )}
              />
              <span className="text-sm">
                {isConnected ? 'Analyse active' : 'En attente de connexion'}
              </span>
            </div>
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyse en cours...
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Input modes */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text" className="gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  Texte
                </TabsTrigger>
                <TabsTrigger value="voice" className="gap-1.5">
                  <Mic className="h-4 w-4" />
                  Voix
                </TabsTrigger>
                <TabsTrigger value="facial" className="gap-1.5">
                  <Camera className="h-4 w-4" />
                  Facial
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analyse textuelle</CardTitle>
                    <CardDescription>
                      Écrivez un texte pour analyser les émotions sous-jacentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Décrivez comment vous vous sentez, partagez une pensée ou un événement récent..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={4}
                      disabled={!isConnected}
                      maxLength={2000}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {textInput.length}/2000 caractères
                      </span>
                      <Button
                        onClick={handleTextAnalysis}
                        disabled={!isConnected || !textInput.trim() || isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyse...
                          </>
                        ) : (
                          'Analyser'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analyse vocale</CardTitle>
                    <CardDescription>
                      Analysez la prosodie et le ton de votre voix
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div
                        className={cn(
                          'h-24 w-24 rounded-full flex items-center justify-center border-2 transition-all',
                          isConnected
                            ? 'border-primary bg-primary/10 cursor-pointer hover:bg-primary/20'
                            : 'border-muted bg-muted/30'
                        )}
                      >
                        <Mic className={cn('h-10 w-10', isConnected ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        {isConnected
                          ? 'L\'analyse vocale détecte les émotions dans le ton, le rythme et l\'intonation de votre voix.'
                          : 'Activez l\'analyse pour commencer la détection vocale.'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-3 w-3" />
                        Nécessite l'accès au microphone
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="facial" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analyse faciale</CardTitle>
                    <CardDescription>
                      Détection des expressions faciales en temps réel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div
                        className={cn(
                          'h-24 w-24 rounded-full flex items-center justify-center border-2 transition-all',
                          isConnected
                            ? 'border-primary bg-primary/10'
                            : 'border-muted bg-muted/30'
                        )}
                      >
                        <Camera className={cn('h-10 w-10', isConnected ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        {isConnected
                          ? 'L\'analyse faciale détecte plus de 30 émotions à partir de vos expressions.'
                          : 'Activez l\'analyse pour commencer la détection faciale.'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-3 w-3" />
                        Nécessite l'accès à la caméra
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Results panel */}
          <div className="space-y-6">
            {/* Current emotion */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  État émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentEmotion ? (
                  <>
                    <div className="text-center">
                      <Badge className={cn('text-lg px-4 py-1.5 border', emotionColor)}>
                        {emotionLabel}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Confiance: {Math.round(currentEmotion.confidence * 100)}%
                      </p>
                    </div>

                    {/* Valence */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Valence</span>
                        <span className="font-medium">{getValenceLabel(currentEmotion.valence)}</span>
                      </div>
                      <Progress value={currentEmotion.valence * 100} className="h-2" />
                    </div>

                    {/* Arousal */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Activation</span>
                        <span className="font-medium">{getArousalLabel(currentEmotion.arousal)}</span>
                      </div>
                      <Progress value={currentEmotion.arousal * 100} className="h-2" />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isConnected
                        ? 'En attente d\'un input à analyser'
                        : 'Activez l\'analyse pour commencer'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Historique de session
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune analyse effectuée
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((entry, index) => {
                      const color = EMOTION_COLORS[entry.emotion] || EMOTION_COLORS.neutral;
                      const label = EMOTION_LABELS[entry.emotion] || entry.emotion;
                      return (
                        <div
                          key={`${entry.timestamp}-${index}`}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn('text-xs', color)}>
                              {label}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(entry.confidence * 100)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info card */}
        <Card className="bg-muted/30">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                L'analyse émotionnelle utilise Hume AI pour détecter les émotions à travers le texte, la voix et les expressions faciales.
                Toutes les données sont traitées de manière sécurisée via nos Edge Functions.
              </p>
              <p>
                Les résultats sont indicatifs et ne constituent pas un diagnostic médical.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </PageRoot>
  );
}
