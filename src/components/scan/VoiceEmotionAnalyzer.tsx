
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Loader2 } from 'lucide-react';
import { EmotionResult, Emotion } from '@/types/emotion';

interface VoiceEmotionAnalyzerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  isListening?: boolean;
  onToggleListening?: () => void;
}

const VoiceEmotionAnalyzer: React.FC<VoiceEmotionAnalyzerProps> = ({
  onEmotionDetected,
  isListening: externalIsListening,
  onToggleListening: externalToggleListening
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");

  const toggleListening = () => {
    if (externalToggleListening) {
      externalToggleListening();
      return;
    }

    if (isProcessing) return;

    const newIsListening = !isListening;
    setIsListening(newIsListening);

    if (newIsListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    setTranscript("");
    
    // In a real implementation, this would start recording audio and send to Whisper API
    console.log('Simulating voice recording start...');
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      if (isListening) {
        stopListening();
      }
    }, 5000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(true);
    
    // In a real implementation, this would stop recording and process the audio
    console.log('Simulating voice recording stop and processing...');
    
    // Simulate processing delay
    setTimeout(() => {
      const mockTranscript = "Aujourd'hui je me sens plutôt calme et détendu après une bonne journée de travail.";
      setTranscript(mockTranscript);
      
      // Simulate emotion analysis
      setTimeout(() => {
        const dominantEmotion: Emotion = {
          name: "calm",
          intensity: 0.7
        };

        const emotionResult: EmotionResult = {
          emotions: [
            dominantEmotion,
            { name: "joy", intensity: 0.3 }
          ],
          dominantEmotion,
          source: 'voice',
          text: mockTranscript,
          timestamp: new Date().toISOString()
        };
        
        if (onEmotionDetected) {
          onEmotionDetected(emotionResult);
        }
        
        setIsProcessing(false);
      }, 1000);
    }, 1500);
  };

  // Use either internal or external state for listening status
  const currentlyListening = externalIsListening !== undefined ? externalIsListening : isListening;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-center p-4">
          <Button
            variant={currentlyListening ? "destructive" : "default"}
            size="lg"
            className={`h-16 w-16 rounded-full ${currentlyListening ? 'animate-pulse' : ''}`}
            onClick={toggleListening}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : currentlyListening ? (
              <Square className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </div>
        
        <div className="text-center">
          {isProcessing ? (
            <p>Analyse en cours...</p>
          ) : currentlyListening ? (
            <p>Parlez maintenant... Exprimez votre ressenti émotionnel</p>
          ) : transcript ? (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium mb-1">Transcription:</p>
              <p className="text-sm text-muted-foreground">{transcript}</p>
            </div>
          ) : (
            <p>Cliquez sur le bouton pour commencer l'enregistrement</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VoiceEmotionAnalyzer;
