
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Emotion } from '@/types';
import type { EmotionResult as EmotionResultType } from '@/lib/scanService';

// Import our components
import AudioProcessor from './live/AudioProcessor';
import EmotionResultDisplay from './live/EmotionResult';
import StatusIndicator from './live/StatusIndicator';
import TranscriptDisplay from './live/TranscriptDisplay';
import EmptyState from './live/EmptyState';
import { useMusicRecommendation } from './live/useMusicRecommendation';

interface EmotionScanLiveProps {
  onResultSaved?: (result: Emotion) => void;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({ onResultSaved }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { handlePlayMusic } = useMusicRecommendation();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emotionResult, setEmotionResult] = useState<EmotionResultType | null>(null);
  const [progressText, setProgressText] = useState('');
  
  // Start/stop listening
  const toggleListening = () => {
    setIsListening(!isListening);
    if (isListening) {
      setEmotionResult(null);
      setTranscript('');
    }
  };
  
  // Handle audio processing completion
  const handleAnalysisComplete = (emotion: Emotion, result: EmotionResultType) => {
    setEmotionResult(result);
    setTranscript(result.transcript || '');
    
    if (onResultSaved) {
      onResultSaved(emotion);
    }
    
    toast({
      title: "Analyse émotionnelle terminée",
      description: `Vous semblez ${result.emotion} (${Math.round(result.confidence * 100)}% de confiance)`,
    });
  };
  
  // Handle errors from audio processor
  const handleProcessorError = (message: string) => {
    toast({
      title: "Erreur d'analyse",
      description: message,
      variant: "destructive",
    });
    setIsListening(false);
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
        {/* Audio Processor (non-visual component) */}
        <AudioProcessor 
          isListening={isListening}
          userId={user?.id}
          onProcessingChange={setIsProcessing}
          onProgressUpdate={setProgressText}
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleProcessorError}
        />
        
        {/* Status Indicator */}
        <StatusIndicator 
          isListening={isListening} 
          isProcessing={isProcessing} 
          progressText={progressText} 
        />
        
        {/* Transcript Display */}
        <TranscriptDisplay transcript={transcript} />
        
        {/* Emotion Result */}
        {emotionResult && (
          <EmotionResultDisplay 
            result={emotionResult} 
            onPlayMusic={() => handlePlayMusic(emotionResult)}
          />
        )}
        
        {/* Empty State */}
        {!isListening && !emotionResult && <EmptyState />}
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;
