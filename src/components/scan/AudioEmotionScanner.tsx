
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionResult } from '@/types/emotion';
import { Loader2, Mic, MicOff, Play, Stop } from 'lucide-react';
import { toast } from 'sonner';

interface AudioEmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  onCancel: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  onScanComplete,
  onCancel,
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Démarrer le compteur
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success('Enregistrement démarré');
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      toast.error('Impossible d\'accéder au microphone');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      toast.success('Enregistrement terminé');
    }
  };
  
  const analyzeAudio = async () => {
    if (!audioUrl) {
      toast.error('Aucun enregistrement à analyser');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simuler une analyse audio
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // En production, intégration avec Whisper pour transcription + Hume AI pour analyse
      const emotions = ['calm', 'joy', 'sadness', 'anger', 'fear', 'surprise', 'excitement'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomIntensity = Math.random() * 0.8 + 0.2;
      
      const result: EmotionResult = {
        emotion: randomEmotion,
        intensity: randomIntensity,
        source: 'voice',
        score: Math.floor(randomIntensity * 100),
        audioUrl,
        ai_feedback: generateAudioFeedback(randomEmotion, randomIntensity),
        date: new Date().toISOString()
      };
      
      onScanComplete(result);
      toast.success('Analyse vocale terminée');
    } catch (error) {
      console.error('Erreur lors de l\'analyse audio:', error);
      toast.error('Erreur lors de l\'analyse audio');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const generateAudioFeedback = (emotion: string, intensity: number): string => {
    const baseMessages = {
      calm: 'Votre voix exprime un état de calme et de sérénité.',
      joy: 'Votre voix rayonne de joie et d\'enthousiasme.',
      sadness: 'Votre voix reflète de la tristesse.',
      anger: 'Votre voix exprime de la colère ou de la frustration.',
      fear: 'Votre voix traduit de l\'anxiété ou de la peur.',
      surprise: 'Votre voix exprime de la surprise.',
      excitement: 'Votre voix déborde d\'excitation.'
    };
    
    const intensityNote = intensity > 0.7 ? ' Cette émotion est très intense.' : 
                         intensity > 0.4 ? ' Cette émotion est modérée.' : 
                         ' Cette émotion est légère.';
    
    return (baseMessages[emotion] || 'Votre état émotionnel est intéressant.') + intensityNote;
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyse vocale</CardTitle>
          <CardDescription>
            Enregistrez votre voix pour analyser vos émotions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {!isRecording && !audioUrl ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="w-32 h-32 rounded-full"
                disabled={isProcessing}
              >
                <Mic className="h-8 w-8" />
              </Button>
            ) : isRecording ? (
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                  className="w-32 h-32 rounded-full animate-pulse"
                >
                  <MicOff className="h-8 w-8" />
                </Button>
                <div className="text-center">
                  <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
                  <div className="text-sm text-muted-foreground">Enregistrement en cours...</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div className="text-lg font-medium">Enregistrement prêt</div>
                  <div className="text-sm text-muted-foreground">Durée: {formatTime(recordingTime)}</div>
                </div>
                
                {audioUrl && (
                  <audio controls src={audioUrl} className="w-full max-w-sm" />
                )}
                
                <div className="flex space-x-2">
                  <Button onClick={startRecording} variant="outline">
                    <Mic className="mr-2 h-4 w-4" />
                    Réenregistrer
                  </Button>
                  <Button onClick={analyzeAudio} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      'Analyser'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            {!isRecording && !audioUrl && 'Cliquez sur le microphone pour commencer l\'enregistrement'}
            {isRecording && 'Parlez naturellement, cliquez sur le bouton pour arrêter'}
            {audioUrl && 'Votre enregistrement est prêt à être analysé'}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing || isRecording}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
