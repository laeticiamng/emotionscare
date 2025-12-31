/**
 * ScanVoicePage - Page de scan émotionnel par analyse vocale
 */

import React, { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Mic, MicOff, ArrowLeft, RefreshCw, Loader2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import PageRoot from '@/components/common/PageRoot';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, ConfidenceLevel } from '@/types/emotion-unified';

const getConfidenceValue = (confidence: number | ConfidenceLevel | undefined): number => {
  if (confidence === undefined) return 0;
  if (typeof confidence === 'number') return confidence;
  return confidence.overall ?? 0;
};

const SimpleResultCard: React.FC<{ result: EmotionResult }> = ({ result }) => {
  const confidenceValue = getConfidenceValue(result.confidence);
  return (
    <Card>
      <CardHeader><CardTitle>Résultat</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-bold text-center">{result.emotion || 'Neutre'}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span>Valence</span><span>{Math.round(result.valence || 50)}%</span></div>
          <Progress value={result.valence || 50} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span>Arousal</span><span>{Math.round(result.arousal || 50)}%</span></div>
          <Progress value={result.arousal || 50} className="h-2" />
        </div>
        {confidenceValue > 0 && <Badge variant="secondary">Confiance: {Math.round(confidenceValue)}%</Badge>}
      </CardContent>
    </Card>
  );
};

const ScanVoicePage: React.FC = () => {
  usePageSEO({
    title: 'Scan Vocal - Analyse des émotions par la voix',
    description: 'Analysez vos émotions à travers votre voix. IA de reconnaissance prosodique.',
    keywords: 'scan vocal, analyse voix, prosodie, IA émotionnelle, reconnaissance vocale'
  });

  const { scanEmotion, isScanning, lastResult, reset } = useEmotionScan();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        if (audioBlob.size > 0) {
          try {
            await scanEmotion('voice', audioBlob, { saveToHistory: true });
            toast({
              title: '✅ Analyse vocale terminée',
              description: 'Votre émotion a été détectée avec succès.'
            });
          } catch (error) {
            // Error handled in hook
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Auto-stop après 30 secondes
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 30000);

    } catch (error) {
      toast({
        title: 'Accès micro refusé',
        description: 'Veuillez autoriser l\'accès au microphone.',
        variant: 'destructive'
      });
    }
  }, [scanEmotion, toast]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setRecordingTime(0);
  }, [reset]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
        <div className="container mx-auto flex flex-col gap-8 px-4 py-10">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link to="/app/scan">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            </Link>
          </div>

          <header className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1 text-xs font-medium text-orange-500">
              <Mic className="h-4 w-4" />
              Analyse vocale
            </span>
            <h1 className="text-4xl font-semibold text-foreground">
              Scan Vocal IA
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Parlez naturellement pendant quelques secondes. Notre IA analyse la prosodie, 
              le ton et le rythme de votre voix pour identifier votre état émotionnel.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Recording Section */}
            <Card>
              <CardHeader>
                <CardTitle>Enregistrement</CardTitle>
                <CardDescription>
                  Parlez pendant 5 à 30 secondes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visualizer */}
                <div className="relative h-32 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {isRecording ? (
                    <div className="flex items-center gap-1">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-primary rounded-full animate-pulse"
                          style={{
                            height: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.05}s`
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Mic className="h-16 w-16 text-muted-foreground/30" />
                  )}
                </div>

                {/* Timer and Progress */}
                {isRecording && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Temps d'enregistrement</span>
                      <span className="font-mono">{formatTime(recordingTime)}</span>
                    </div>
                    <Progress value={(recordingTime / 30) * 100} className="h-2" />
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording} 
                      className="flex-1 gap-2"
                      disabled={isScanning}
                    >
                      <Mic className="h-4 w-4" />
                      Commencer l'enregistrement
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording} 
                      variant="destructive"
                      className="flex-1 gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Arrêter et analyser
                    </Button>
                  )}
                </div>

                {isScanning && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyse en cours...</span>
                  </div>
                )}

                {/* Tips */}
                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">💡 Conseils</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Parlez naturellement, comme si vous racontiez votre journée</li>
                    <li>Évitez les bruits de fond</li>
                    <li>5 à 10 secondes suffisent pour une bonne analyse</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Result Section */}
            <div className="space-y-4">
              {lastResult ? (
                <>
                  <SimpleResultCard result={lastResult} />
                  <Button variant="outline" onClick={handleReset} className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Nouveau scan
                  </Button>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MicOff className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      Enregistrez votre voix pour voir les résultats de l'analyse
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageRoot>
  );
};

export default ScanVoicePage;
