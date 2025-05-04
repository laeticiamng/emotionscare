
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { initVad } from '@/lib/audioVad';
import { analyzeAudioStream, saveRealtimeEmotionScan, emotionResultToEmotion, type EmotionResult } from '@/lib/scanService';
import type { Emotion } from '@/types';

interface EmotionScanLiveProps {
  onResultSaved?: (result: Emotion) => void;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({ onResultSaved }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [progressText, setProgressText] = useState('');
  
  const vadRef = useRef<any>(null);
  
  // Cleanup function for VAD
  const stopVad = useCallback(() => {
    if (vadRef.current) {
      vadRef.current.stop();
      vadRef.current = null;
    }
  }, []);
  
  // Initialize or stop VAD when listening state changes
  useEffect(() => {
    if (isListening) {
      const startVad = async () => {
        try {
          // Handle speech start
          const onSpeechStart = () => {
            console.log('🗣️ Speech detected');
            setProgressText('Listening...');
          };
          
          // Handle speech end
          const onSpeechEnd = async (audioChunks: Array<Uint8Array>) => {
            console.log('🤫 Speech ended, analyzing...');
            setIsProcessing(true);
            
            try {
              // Process audio with emotion analysis
              const result = await analyzeAudioStream(audioChunks, (progress) => {
                setProgressText(progress);
              });
              
              // Update UI with results
              setEmotionResult(result);
              setTranscript(result.transcript || '');
              
              // Save result to database if user is logged in
              if (user?.id) {
                const savedEmotion = await saveRealtimeEmotionScan(result, user.id);
                console.log('Saved emotion analysis:', savedEmotion);
                
                // Notify parent component if callback provided
                if (onResultSaved) {
                  onResultSaved(savedEmotion);
                }
                
                toast({
                  title: "Analyse émotionnelle terminée",
                  description: `Vous semblez ${result.emotion} (${Math.round(result.confidence * 100)}% de confiance)`,
                })
              }
            } catch (error) {
              console.error('Error analyzing audio:', error);
              toast({
                title: "Erreur d'analyse",
                description: "L'analyse émotionnelle a échoué. Veuillez réessayer.",
                variant: "destructive",
              });
            } finally {
              setIsProcessing(false);
              setProgressText('');
            }
          };
          
          // Initialize Voice Activity Detection
          const vad = await initVad(onSpeechStart, onSpeechEnd);
          vadRef.current = vad;
          
          toast({
            title: "Microphone activé",
            description: "Parlez pour commencer l'analyse émotionnelle en temps réel.",
          });
        } catch (error) {
          console.error('Error starting microphone:', error);
          toast({
            title: "Erreur du microphone",
            description: "Impossible d'accéder au microphone. Vérifiez les permissions.",
            variant: "destructive",
          });
          setIsListening(false);
        }
      };
      
      startVad();
    } else {
      // Stop VAD when listening is turned off
      stopVad();
    }
    
    // Clean up on component unmount
    return () => {
      stopVad();
    };
  }, [isListening, user, toast, onResultSaved, stopVad]);
  
  // Start/stop listening
  const toggleListening = () => {
    setIsListening(!isListening);
    if (isListening) {
      setEmotionResult(null);
      setTranscript('');
    }
  };
  
  // Confidence color based on value
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-500';
    if (confidence > 0.6) return 'text-blue-500';
    return 'text-amber-500';
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analyse émotionnelle en direct</span>
          <Button 
            size="sm"
            variant={isListening ? "destructive" : "default"}
            className="flex items-center gap-2"
            onClick={toggleListening}
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff size={16} />
                Arrêter
              </>
            ) : (
              <>
                <Mic size={16} />
                Commencer
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {(isListening || isProcessing || progressText) && (
          <div className="mb-4 p-3 bg-muted rounded-md flex items-center gap-3">
            {isProcessing ? (
              <div className="animate-pulse flex items-center">
                <Wand2 className="mr-2 h-5 w-5 text-primary" />
                <span>{progressText || "Traitement en cours..."}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="absolute -inset-1 rounded-full bg-primary opacity-30 animate-ping"></div>
                  <Mic className="relative h-5 w-5 text-primary" />
                </div>
                <span>{progressText || "Écoute active..."}</span>
              </div>
            )}
          </div>
        )}
        
        {transcript && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Transcription</h3>
            <p className="p-3 bg-muted/50 rounded-md">{transcript}</p>
          </div>
        )}
        
        {emotionResult && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Analyse émotionnelle</h3>
            <div className="p-4 bg-secondary/20 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-2xl capitalize">{emotionResult.emotion}</span>
                <span className={`text-xl font-semibold ${getConfidenceColor(emotionResult.confidence)}`}>
                  {Math.round(emotionResult.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {!isListening && !emotionResult && (
          <div className="py-8 flex flex-col items-center text-center text-muted-foreground">
            <Mic className="h-10 w-10 mb-4 opacity-50" />
            <p>Cliquez sur "Commencer" pour analyser vos émotions en temps réel via votre voix</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;
