
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, RefreshCw } from 'lucide-react';
import { LiveVoiceScannerProps, EmotionResult } from '@/types';

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onEmotionDetected,
  onTranscriptUpdate,
  onStart,
  onStop,
  autoStart = false,
  maxDuration = 60,
  className = '',
  visualizationMode = 'wave'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock implementation for demonstration purposes
  const startListening = () => {
    setIsListening(true);
    if (onStart) onStart();
    // Simulate starting the voice recognition
    console.log("Voice recognition started");
  };
  
  const stopListening = () => {
    setIsListening(false);
    if (onStop) onStop();
    // Simulate stopping the voice recognition
    console.log("Voice recognition stopped");
    
    // Simulate processing
    setIsProcessing(true);
    setTimeout(() => {
      const mockEmotion: EmotionResult = {
        emotion: "happy",
        confidence: 0.85,
        intensity: 0.7,
        timestamp: new Date().toISOString()
      };
      
      setEmotion(mockEmotion);
      if (onEmotionDetected) onEmotionDetected(mockEmotion);
      setIsProcessing(false);
    }, 1500);
  };
  
  // Reset the component state
  const resetScanner = () => {
    setTranscript('');
    setEmotion(null);
  };
  
  // Auto-start effect
  useEffect(() => {
    if (autoStart) {
      startListening();
    }
    
    // Auto-stop after maxDuration
    let timer: ReturnType<typeof setTimeout>;
    if (isListening) {
      timer = setTimeout(() => {
        stopListening();
      }, maxDuration * 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoStart, isListening, maxDuration]);
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full flex justify-between">
            <h3 className="text-lg font-medium">Voice Emotion Scanner</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetScanner}
              disabled={isListening || isProcessing}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="w-full h-24 bg-muted/30 rounded-lg flex items-center justify-center">
            {visualizationMode === 'wave' && (
              <div className="flex items-center space-x-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-${Math.random() * 16 + 4} w-1 bg-primary rounded-full ${
                      isListening ? 'animate-pulse' : ''
                    }`}
                    style={{
                      height: isListening ? `${Math.random() * 50 + 10}px` : '10px',
                      transition: 'height 0.2s ease'
                    }}
                  ></div>
                ))}
              </div>
            )}
            
            {!isListening && !isProcessing && !emotion && (
              <span className="text-muted-foreground">Click to start speaking</span>
            )}
            
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span>Processing...</span>
              </div>
            )}
          </div>
          
          {transcript && (
            <div className="w-full p-3 bg-background border rounded-lg mt-2">
              <p className="text-sm">{transcript}</p>
            </div>
          )}
          
          {emotion && (
            <div className="w-full p-3 bg-background border rounded-lg mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Detected emotion:</span>
                <span className="text-primary">{emotion.emotion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Confidence:</span>
                <span>{Math.round((emotion.confidence || 0) * 100)}%</span>
              </div>
            </div>
          )}
          
          <Button
            className="w-full"
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" /> Start Recording
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;
