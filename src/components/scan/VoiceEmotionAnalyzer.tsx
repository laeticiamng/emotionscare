
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult, VoiceEmotionAnalyzerProps } from '@/types/emotion';

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({
  onEmotionDetected,
  isListening: externalIsListening,
  onToggleListening
}) => {
  const [localIsListening, setLocalIsListening] = useState(externalIsListening || false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  
  const isListening = externalIsListening !== undefined ? externalIsListening : localIsListening;
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
      };
      
      mediaRecorder.start();
      setLocalIsListening(true);
      if (onToggleListening) onToggleListening();
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 10000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur d'accès au microphone",
        description: "Veuillez autoriser l'accès à votre microphone pour utiliser cette fonctionnalité.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      setLocalIsListening(false);
      if (onToggleListening) onToggleListening();
      
      setTranscript("Simulation de transcription : Je me sens plutôt heureux aujourd'hui malgré la charge de travail.");
    }
  };
  
  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const analyzeAudio = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    
    try {
      // In a real implementation, this would send the audio to a voice emotion recognition API
      // For now, we'll simulate a result
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult: EmotionResult = {
        emotions: [
          { name: 'happiness', intensity: 0.6, score: 0.6 },
          { name: 'calm', intensity: 0.3, score: 0.3 },
          { name: 'neutral', intensity: 0.1, score: 0.1 }
        ],
        dominantEmotion: { name: 'happiness', intensity: 0.6, score: 0.6 },
        source: 'voice',
        timestamp: new Date().toISOString(),
        text: transcript
      };
      
      if (onEmotionDetected) {
        onEmotionDetected(mockResult);
      }
    } catch (error) {
      console.error('Error analyzing audio:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre enregistrement vocal. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse émotionnelle vocale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          {transcript ? (
            <p className="text-sm">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isListening 
                ? "Enregistrement en cours... Parlez de ce que vous ressentez." 
                : "Appuyez sur le bouton pour commencer l'enregistrement."}
            </p>
          )}
        </div>
        
        {audioUrl && (
          <div className="flex justify-center">
            <audio controls src={audioUrl} className="w-full max-w-md" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={analyzeAudio}
          disabled={!audioBlob || isAnalyzing || isListening}
        >
          {isAnalyzing ? (
            "Analyse en cours..."
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Analyser
            </>
          )}
        </Button>
        
        <Button
          variant={isListening ? "destructive" : "default"}
          onClick={toggleRecording}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              Arrêter
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceEmotionAnalyzer;
