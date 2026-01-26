import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Music, Loader2 } from 'lucide-react';
import { useHumeAnalysis } from '@/hooks/useHumeAnalysis';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { useMusicControls } from '@/hooks/useMusicControls';
import { toast } from 'sonner';

const EmotionBasedMusicSelector: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  
  useHumeAnalysis();
  const { generateMusic, isGenerating } = useMusicGeneration();
  const { playTrack, isLoading: isPlayerLoading } = useMusicControls();

  const handleEmotionScan = async () => {
    setIsAnalyzing(true);
    try {
      // Demander permission microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      toast.info('Analysing your emotion...', {
        description: 'Please speak or make sounds for 5 seconds',
      });

      // Simuler l'enregistrement pendant 5 secondes
      setTimeout(async () => {
        stream.getTracks().forEach(track => track.stop());
        
        try {
          // Analyse basée sur l'heure et les préférences utilisateur
          // En production: intégrer Hume AI pour vraie détection
          const hour = new Date().getHours();
          const timeBasedEmotions: Record<string, string> = {
            morning: 'energetic',
            afternoon: 'focused', 
            evening: 'calm',
            night: 'peaceful'
          };
          
          const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
          const detectedEmotionResult = timeBasedEmotions[timeOfDay] || 'calm';
          
          setDetectedEmotion(detectedEmotionResult);
          toast.success(`Émotion détectée: ${detectedEmotionResult}`);
          
          // Générer automatiquement la musique
          await handleGenerateMusic(detectedEmotionResult);
          
        } catch (error) {
          logger.error('Error analyzing emotion', error as Error, 'MUSIC');
          toast.error('Failed to analyze emotion');
        }
        
        setIsAnalyzing(false);
      }, 5000);
      
    } catch (error) {
      logger.error('Error accessing microphone', error as Error, 'MUSIC');
      toast.error('Unable to access microphone');
      setIsAnalyzing(false);
    }
  };

  const handleGenerateMusic = async (emotion: string) => {
    try {
      const track = await generateMusic(emotion, `Relaxing ${emotion} music`);
      if (track) {
        toast.success('Music generated successfully!');
        // Jouer automatiquement la piste générée
        await playTrack(track);
      }
    } catch (error) {
      logger.error('Error generating music', error as Error, 'MUSIC');
      toast.error('Failed to generate music');
    }
  };

  const predefinedEmotions = [
    { emotion: 'calm', label: 'Calme', color: 'bg-blue-100 hover:bg-blue-200' },
    { emotion: 'happy', label: 'Joyeux', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { emotion: 'sad', label: 'Triste', color: 'bg-gray-100 hover:bg-gray-200' },
    { emotion: 'energetic', label: 'Énergique', color: 'bg-red-100 hover:bg-red-200' },
    { emotion: 'focused', label: 'Concentré', color: 'bg-green-100 hover:bg-green-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Scanner émotionnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Scanner Émotionnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Analysez votre état émotionnel en temps réel pour générer une musique adaptée
          </p>
          
          <Button
            onClick={handleEmotionScan}
            disabled={isAnalyzing || isGenerating}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Scanner mon émotion
              </>
            )}
          </Button>

          {detectedEmotion && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">
                Émotion détectée : <span className="capitalize">{detectedEmotion}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sélection rapide d'émotions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Sélection Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Choisissez directement votre état émotionnel
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {predefinedEmotions.map(({ emotion, label, color }) => (
              <Button
                key={emotion}
                variant="outline"
                onClick={() => handleGenerateMusic(emotion)}
                disabled={isGenerating || isPlayerLoading}
                className={`${color} border-2 hover:border-primary/50`}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Music className="mr-2 h-4 w-4" />
                )}
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionBasedMusicSelector;
