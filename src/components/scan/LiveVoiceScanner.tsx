// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types/emotion';
import { Mic, StopCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useWhisper from '@/hooks/api/useWhisper';
import useHumeAI from '@/hooks/api/useHumeAI';

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
  
  const { 
    startRecordingAndTranscribe, 
    stopRecording, 
    isRecording: isWhisperRecording,
    isLoading: isWhisperLoading,
    transcript: whisperTranscript
  } = useWhisper();
  
  const { 
    analyzeTextEmotion, 
    isAnalyzing 
  } = useHumeAI();
  
  // Start recording automatically if autoStart is true
  useEffect(() => {
    if (autoStart) {
      handleStartRecording();
    }
  }, [autoStart]);
  
  // Update transcript when Whisper returns a result
  useEffect(() => {
    if (whisperTranscript) {
      setTranscript(whisperTranscript);
    }
  }, [whisperTranscript]);
  
  // Handle start recording
  const handleStartRecording = async () => {
    setIsRecording(true);
    setTranscript('');
    
    try {
      const text = await startRecordingAndTranscribe();
      if (text) {
        setTranscript(text);
      }
    } catch (error) {
      // Recording error
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsRecording(false);
    }
  };
  
  // Handle stop recording
  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
  };
  
  // Analyze transcript
  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      toast.error('Aucun texte à analyser');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await analyzeTextEmotion(transcript);
      if (result && onScanComplete) {
        onScanComplete(result);
      } else {
        toast.error('Erreur lors de l\'analyse du texte');
      }
    } catch (error) {
      // Text analysis error
      toast.error('Erreur lors de l\'analyse du texte');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p>
          Enregistrez votre voix pour analyser votre état émotionnel.
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full p-4 bg-muted rounded-lg">
          {transcript ? (
            <p className="text-sm">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              {isRecording || isWhisperRecording ? 
                'Parlez maintenant...' : 
                'Appuyez sur le bouton pour commencer l\'enregistrement'}
            </p>
          )}
        </div>
        
        <div className="flex justify-center">
          {isRecording || isWhisperRecording ? (
            <Button 
              variant="destructive"
              size="lg"
              className="rounded-full h-16 w-16"
              onClick={handleStopRecording}
              disabled={isWhisperLoading}
            >
              <StopCircle className="h-8 w-8" />
            </Button>
          ) : (
            <Button 
              variant="default"
              size="lg"
              className="rounded-full h-16 w-16 bg-primary"
              onClick={handleStartRecording}
              disabled={isWhisperLoading}
            >
              <Mic className="h-8 w-8" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isProcessing || isAnalyzing || isRecording || isWhisperRecording}
          >
            Annuler
          </Button>
        )}
        <Button 
          onClick={handleAnalyze}
          disabled={isProcessing || isAnalyzing || isRecording || isWhisperRecording || !transcript.trim()}
          className="ml-auto"
        >
          {isProcessing || isAnalyzing ? (
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
