
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Music } from 'lucide-react';
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
  const [isConfidential, setIsConfidential] = useState(false);
  
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="md:col-span-7 rounded-3xl shadow-md">
        <CardHeader className="border-b bg-blue-50/50 rounded-t-3xl">
          <CardTitle className="flex items-center justify-between">
            <span>Analyse émotionnelle en direct</span>
            <Button 
              size="sm"
              variant={isListening ? "destructive" : "default"}
              className="flex items-center gap-2 rounded-full"
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
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="confidentialLive"
              checked={isConfidential}
              onChange={() => setIsConfidential(!isConfidential)}
              className="mr-2"
            />
            <label htmlFor="confidentialLive" className="text-sm text-muted-foreground">Mode confidentiel</label>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Audio Processor (non-visual component) */}
          <AudioProcessor 
            isListening={isListening}
            userId={user?.id}
            isConfidential={isConfidential}
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
      
      <Card className="md:col-span-5 rounded-3xl shadow-md">
        <CardHeader className="border-b bg-blue-50/50 rounded-t-3xl">
          <CardTitle>Actions recommandées</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {emotionResult ? (
            <>
              <Button 
                variant="default" 
                className="w-full justify-start rounded-xl text-left p-4 bg-wellness-mint text-slate-800 hover:bg-wellness-mint/90 hover:shadow-md transition-all"
              >
                <Music className="mr-3 h-5 w-5" />
                <div>
                  <div className="font-medium">Écouter une playlist</div>
                  <div className="text-xs opacity-90">Musiques adaptées à votre état émotionnel</div>
                </div>
              </Button>
              
              <Button 
                variant="default" 
                className="w-full justify-start rounded-xl text-left p-4 bg-wellness-purple text-white hover:bg-wellness-darkPurple hover:shadow-md transition-all"
              >
                <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 17.05v-10.1c0-.55-.45-1-1-1s-1 .45-1 1v10.1c-2.3.33-4 2.32-4 4.7 0 .55.45 1 1 1h8c.55 0 1-.45 1-1 0-2.38-1.7-4.37-4-4.7z" />
                </svg>
                <div>
                  <div className="font-medium">Démarrer une micro-pause VR</div>
                  <div className="text-xs opacity-90">Session de relaxation de 5 minutes</div>
                </div>
              </Button>
              
              <Button 
                variant="default" 
                className="w-full justify-start rounded-xl text-left p-4 bg-wellness-coral text-white hover:bg-wellness-coral/90 hover:shadow-md transition-all"
              >
                <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
                <div>
                  <div className="font-medium">Parler au Coach IA</div>
                  <div className="text-xs opacity-90">Discussion personnalisée avec votre assistant</div>
                </div>
              </Button>
            </>
          ) : (
            <div className="text-center p-6">
              <p className="text-muted-foreground">Commencez une analyse pour découvrir les actions recommandées en fonction de votre état émotionnel.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionScanLive;
