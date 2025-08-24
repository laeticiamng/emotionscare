import React, { useState, useRef, useEffect } from 'react';
import { PageRoot } from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Mic, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const EmotionScanPage = () => {
  const [scanMode, setScanMode] = useState<'voice' | 'face' | 'mood-cards' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { currentMood, updateMood } = useMood();
  const { logActivity } = useActivityLogger();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    logActivity('/scan', 'emotion_scan_page');
  }, [logActivity]);

  const startCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
      setScanMode('face');
      toast({
        title: "📸 Caméra activée",
        description: "Placez votre visage bien en face pour un scan optimal",
      });
    } catch (error) {
      toast({
        title: "Caméra non disponible",
        description: "Utilisons les mood cards à la place !",
        variant: "destructive",
      });
      setScanMode('mood-cards');
    }
  };

  const startVoiceAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setScanMode('voice');
      toast({
        title: "🎤 Micro activé",
        description: "Parlez-nous de votre journée pendant 30 secondes",
      });
    } catch (error) {
      toast({
        title: "Micro non disponible",
        description: "Utilisons les mood cards à la place !",
        variant: "destructive",
      });
      setScanMode('mood-cards');
    }
  };

  const performScan = async () => {
    setIsScanning(true);
    
    try {
      // Call Edge Function for emotion scan
      const { data, error } = await supabase.functions.invoke('emotion-scan', {
        body: {
          mode: scanMode,
          currentMood: currentMood,
        }
      });

      if (error) throw error;

      setScanResult(data);
      
      // Update mood if we got results
      if (data.mood) {
        await updateMood(data.mood.valence, data.mood.arousal);
      }

      toast({
        title: "✨ Analyse terminée",
        description: data.insight || "Votre état émotionnel a été capturé avec douceur",
      });

    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Erreur temporaire",
        description: "Réessayons dans un moment",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const resetScan = () => {
    setScanMode(null);
    setScanResult(null);
    stopMediaStream();
  };

  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, []);

  const MoodCardsSelector = () => {
    const moodCards = [
      { emoji: '😊', label: 'Rayonnant', valence: 0.8, arousal: 0.7 },
      { emoji: '😌', label: 'Paisible', valence: 0.6, arousal: 0.3 },
      { emoji: '😐', label: 'Neutre', valence: 0.5, arousal: 0.5 },
      { emoji: '😔', label: 'Pensif', valence: 0.3, arousal: 0.4 },
      { emoji: '😰', label: 'Stressé', valence: 0.2, arousal: 0.8 },
      { emoji: '😴', label: 'Épuisé', valence: 0.4, arousal: 0.2 },
    ];

    return (
      <div className="grid grid-cols-2 gap-4">
        <h3 className="col-span-2 text-lg font-medium text-center mb-4">
          Comment vous sentez-vous maintenant ?
        </h3>
        {moodCards.map((card) => (
          <Button
            key={card.label}
            variant="outline"
            className="h-20 flex flex-col items-center gap-2 hover:bg-primary/10"
            onClick={async () => {
              await updateMood(card.valence, card.arousal);
              setScanResult({
                mood: { valence: card.valence, arousal: card.arousal },
                insight: `Merci d'avoir partagé que vous vous sentez ${card.label.toLowerCase()}. Nous adaptons l'expérience pour vous.`,
                recommendations: ['Respirations profondes', 'Musique adaptée', 'Micro-pause']
              });
            }}
          >
            <span className="text-2xl">{card.emoji}</span>
            <span className="text-sm">{card.label}</span>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <PageRoot className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Scanner de bien-être ✨
          </h1>
          <p className="text-muted-foreground">
            Découvrons ensemble votre état du moment pour vous accompagner au mieux
          </p>
        </div>

        {!scanMode && !scanResult && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Scan visuel doux
                </CardTitle>
                <CardDescription>
                  Un regard bienveillant sur votre expression du moment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={startCameraAccess} className="w-full">
                  Activer la caméra
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Écoute émotionnelle
                </CardTitle>
                <CardDescription>
                  Partagez votre voix, nous écoutons avec attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={startVoiceAccess} className="w-full">
                  Activer le micro
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Cartes d'humeur
                </CardTitle>
                <CardDescription>
                  Une approche simple et intuitive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setScanMode('mood-cards')} variant="outline" className="w-full">
                  Choisir mon humeur
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {scanMode === 'face' && !scanResult && (
          <Card>
            <CardHeader>
              <CardTitle>Scan visuel en cours</CardTitle>
              <CardDescription>
                Regardez la caméra avec naturel, le scan prend quelques secondes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg bg-muted"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={performScan} 
                  disabled={isScanning}
                  className="flex-1"
                >
                  {isScanning ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  {isScanning ? 'Analyse...' : 'Lancer le scan'}
                </Button>
                <Button variant="outline" onClick={resetScan}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {scanMode === 'voice' && !scanResult && (
          <Card>
            <CardHeader>
              <CardTitle>Écoute active</CardTitle>
              <CardDescription>
                Racontez-nous votre journée, vos ressentis, vos pensées...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Mic className="h-8 w-8 mx-auto mb-2 text-primary animate-pulse" />
                  <p className="text-sm text-muted-foreground">En écoute...</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={performScan} 
                  disabled={isScanning}
                  className="flex-1"
                >
                  {isScanning ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  {isScanning ? 'Analyse...' : 'Analyser la voix'}
                </Button>
                <Button variant="outline" onClick={resetScan}>
                  Arrêter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {scanMode === 'mood-cards' && !scanResult && (
          <Card>
            <CardHeader>
              <CardTitle>Cartes d'humeur</CardTitle>
              <CardDescription>
                Choisissez celle qui correspond le mieux à votre état actuel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodCardsSelector />
              <Button variant="outline" onClick={resetScan} className="w-full mt-4">
                Retour aux options
              </Button>
            </CardContent>
          </Card>
        )}

        {scanResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Analyse terminée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <p className="text-center font-medium">
                  {scanResult.insight}
                </p>
              </div>
              
              {scanResult.recommendations && (
                <div>
                  <h4 className="font-medium mb-2">Suggestions personnalisées :</h4>
                  <ul className="space-y-1">
                    {scanResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={resetScan} variant="outline" className="flex-1">
                  Nouveau scan
                </Button>
                <Button className="flex-1" onClick={() => window.location.href = '/music'}>
                  Découvrir la musique adaptée
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageRoot>
  );
};

export default EmotionScanPage;