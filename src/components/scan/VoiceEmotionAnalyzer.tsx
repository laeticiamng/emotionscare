
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, StopCircle, Volume2 } from 'lucide-react';
import { EmotionResult, VoiceEmotionAnalyzerProps } from '@/types/emotion';
import { cn } from '@/lib/utils';

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({
  onEmotionDetected,
  compact = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioData(audioBlob);
        processAudioData(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Impossible d\'accéder au microphone. Veuillez vérifier vos permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const processAudioData = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Mock processing - in a real app, you'd send this to an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result
      const result: EmotionResult = {
        emotion: ['joy', 'calm', 'anxiety', 'neutral'][Math.floor(Math.random() * 4)],
        score: Math.random() * 0.5 + 0.5,
        confidence: Math.random() * 0.3 + 0.7,
        transcript: "Voici ce que j'ai dit pendant l'enregistrement audio."
      };
      
      onEmotionDetected(result);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={cn(isRecording && "animate-pulse")}
        >
          {isRecording ? <StopCircle size={18} /> : <Mic size={18} />}
        </Button>
        <span className="text-sm text-muted-foreground">
          {isProcessing ? "Analyse..." : isRecording ? "Enregistrement..." : "Enregistrer ma voix"}
        </span>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-medium text-lg mb-2">Analyse vocale</h3>
            <p className="text-muted-foreground text-sm">
              Parlez de votre humeur actuelle pour une analyse émotionnelle
            </p>
          </div>
          
          <div className="relative">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={cn(
                "h-20 w-20 rounded-full flex items-center justify-center",
                isRecording && "animate-pulse"
              )}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? (
                <StopCircle size={36} />
              ) : isProcessing ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Mic size={36} />
              )}
            </Button>
            
            {isRecording && (
              <div className="absolute -inset-4 rounded-full border-4 border-red-500 animate-ping opacity-50"></div>
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            {isProcessing ? (
              "Analyse de votre voix en cours..."
            ) : isRecording ? (
              "Parlez maintenant... Cliquez pour arrêter"
            ) : (
              "Cliquez pour commencer l'enregistrement"
            )}
          </div>
          
          {audioData && !isProcessing && !isRecording && (
            <div className="flex items-center gap-2 mt-4">
              <Volume2 size={16} className="text-muted-foreground" />
              <audio
                controls
                src={URL.createObjectURL(audioData)}
                className="h-8 w-48"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionAnalyzer;
