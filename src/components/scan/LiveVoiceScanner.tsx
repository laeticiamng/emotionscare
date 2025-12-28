// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import type { EmotionResult } from '@/types/emotion-unified';
import { Mic, StopCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { normalizeEmotionResult } from '@/types/emotion-unified';
import { logger } from '@/lib/logger';

interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  autoStart?: boolean;
}

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onScanComplete,
  onCancel,
  autoStart = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  useEffect(() => {
    if (autoStart) {
      handleStartRecording();
    }
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [autoStart]);
  
  const handleStartRecording = async () => {
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
        await transcribeAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setTranscript('');
    } catch (error) {
      logger.error('[LiveVoiceScanner] Microphone access error:', error, 'COMPONENT');
      toast.error('Impossible d\'accéder au microphone');
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };
  
  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;
      
      // Call transcription edge function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio, language: 'fr' }
      });
      
      if (error) throw error;
      
      if (data?.text) {
        setTranscript(data.text);
      } else {
        toast.info('Aucun texte détecté');
      }
    } catch (error) {
      logger.error('[LiveVoiceScanner] Transcription error:', error, 'COMPONENT');
      toast.error('Erreur lors de la transcription');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      toast.error('Aucun texte à analyser');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('emotion-analysis', {
        body: { text: transcript, language: 'fr' }
      });
      
      if (error) throw error;
      
      if (data) {
        const result = normalizeEmotionResult({
          id: `voice-${Date.now()}`,
          emotion: data.emotion || 'neutre',
          valence: (data.valence ?? 0.5) * 100,
          arousal: (data.arousal ?? 0.5) * 100,
          confidence: (data.confidence ?? 0.7) * 100,
          source: 'voice',
          timestamp: new Date().toISOString(),
          summary: data.summary || `Émotion ${data.emotion} détectée dans votre voix`,
          text: transcript
        });
        
        onScanComplete?.(result);
      } else {
        toast.error('Aucun résultat d\'analyse');
      }
    } catch (error) {
      logger.error('[LiveVoiceScanner] Analysis error:', error, 'COMPONENT');
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-muted-foreground">
          Enregistrez votre voix pour analyser votre état émotionnel.
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full p-4 bg-muted rounded-lg min-h-[60px]">
          {transcript ? (
            <p className="text-sm">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              {isRecording ? 
                'Parlez maintenant...' : 
                isProcessing ?
                'Transcription en cours...' :
                'Appuyez sur le bouton pour commencer l\'enregistrement'}
            </p>
          )}
        </div>
        
        <div className="flex justify-center">
          {isRecording ? (
            <Button 
              variant="destructive"
              size="lg"
              className="rounded-full h-16 w-16"
              onClick={handleStopRecording}
              disabled={isProcessing}
            >
              <StopCircle className="h-8 w-8" />
            </Button>
          ) : (
            <Button 
              variant="default"
              size="lg"
              className="rounded-full h-16 w-16 bg-primary"
              onClick={handleStartRecording}
              disabled={isProcessing}
            >
              <Mic className="h-8 w-8" />
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">Enregistrement...</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isProcessing || isRecording}
          >
            Annuler
          </Button>
        )}
        <Button 
          onClick={handleAnalyze}
          disabled={isProcessing || isRecording || !transcript.trim()}
          className="ml-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse...
            </>
          ) : (
            'Analyser'
          )}
        </Button>
      </div>
    </div>
  );
};

export default LiveVoiceScanner;
