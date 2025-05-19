
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { EmotionResult } from '@/types/emotion';
import { Mic, MicOff, Waveform, X, StopCircle } from 'lucide-react';

interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  maxRecordingTime?: number;
  autoStart?: boolean;
  showWaveform?: boolean;
}

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onScanComplete,
  onCancel,
  maxRecordingTime = 30, // 30 secondes par défaut
  autoStart = false,
  showWaveform = true,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // Créer un tableau de valeurs simulées pour l'affichage de l'onde vocale
  const waveformValues = Array.from({ length: 40 }, () => 
    Math.random() * audioLevel * 100
  );
  
  // Démarrer l'enregistrement
  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configurer l'analyse audio
      if (showWaveform) {
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        
        // Commencer l'analyse du volume
        updateAudioLevel();
      }
      
      // Configurer l'enregistrement
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Arrêter l'analyse audio
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        
        // Arrêter les pistes du flux audio
        stream.getTracks().forEach(track => track.stop());
        
        // Traiter l'audio enregistré
        processAudio();
      };
      
      // Démarrer l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Démarrer le timer
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsed);
        
        // Arrêter automatiquement si le temps maximum est atteint
        if (elapsed >= maxRecordingTime) {
          clearInterval(interval);
          stopRecording();
        }
      }, 1000);
      
      // Nettoyer l'intervalle lorsque l'enregistrement s'arrête
      mediaRecorder.onpause = () => clearInterval(interval);
      mediaRecorder.onstop = () => {
        clearInterval(interval);
        
        // Arrêter l'analyse audio
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        
        // Arrêter les pistes du flux audio
        stream.getTracks().forEach(track => track.stop());
        
        // Traiter l'audio enregistré
        processAudio();
      };
      
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
      setError('Impossible d\'accéder à votre microphone. Veuillez vérifier les permissions.');
    }
  };
  
  // Fonction pour analyser le niveau audio (visualisation)
  const updateAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculer le niveau moyen
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const normalizedLevel = average / 255; // Normaliser entre 0 et 1
    
    setAudioLevel(normalizedLevel);
    
    // Continuer l'analyse en boucle
    rafIdRef.current = requestAnimationFrame(updateAudioLevel);
  };
  
  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Traiter l'audio enregistré (simulé)
  const processAudio = () => {
    // Dans une vraie implémentation, nous enverrions l'audio à une API
    // Ici, nous simulons un résultat après un court délai
    
    setTimeout(() => {
      const result: EmotionResult = {
        emotion: 'calm',
        confidence: 0.85,
        secondaryEmotions: ['neutral', 'happy'],
        timestamp: new Date().toISOString(),
        source: 'voice',
        duration: recordingTime,
        recommendations: [
          {
            type: 'music',
            title: 'Écoutez des mélodies relaxantes',
            description: 'Basé sur votre voix, nous recommandons d\'écouter de la musique apaisante.',
            id: 'music-recommendation-1'
          } as unknown as string,
        ],
      };
      
      if (onScanComplete) {
        onScanComplete(result);
      }
    }, 1000);
  };
  
  // Démarrer automatiquement si autoStart est vrai
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      // Nettoyer lors du démontage
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [autoStart]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="mr-2" />
          Analyse vocale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-center py-4 text-destructive">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Indicateur d'enregistrement */}
            <div className="flex justify-center items-center py-4">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isRecording ? (
                  <Mic className="h-8 w-8" />
                ) : (
                  <MicOff className="h-8 w-8" />
                )}
              </div>
            </div>
            
            {/* Temps d'enregistrement */}
            <div className="text-center">
              <p className="text-2xl font-semibold">
                {formatTime(recordingTime)}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRecording ? 'Enregistrement en cours...' : 'Prêt à enregistrer'}
              </p>
            </div>
            
            {/* Visualisation de l'onde vocale */}
            {showWaveform && isRecording && (
              <div className="flex items-center justify-center h-12 mt-4">
                {waveformValues.map((value, index) => (
                  <div
                    key={index}
                    className="w-1 mx-0.5 bg-primary rounded-full"
                    style={{ 
                      height: `${Math.max(4, value * audioLevel * 3)}px`,
                      transition: 'height 0.1s ease'
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Barre de progression */}
            <div>
              <Slider
                value={[recordingTime]}
                max={maxRecordingTime}
                step={1}
                disabled
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0:00</span>
                <span>{formatTime(maxRecordingTime)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        
        <div>
          {error && (
            <Button onClick={startRecording}>
              Réessayer
            </Button>
          )}
          
          {!error && !isRecording && (
            <Button onClick={startRecording}>
              <Mic className="mr-2 h-4 w-4" />
              Commencer
            </Button>
          )}
          
          {!error && isRecording && (
            <Button 
              variant="destructive" 
              onClick={stopRecording}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Arrêter
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LiveVoiceScanner;
