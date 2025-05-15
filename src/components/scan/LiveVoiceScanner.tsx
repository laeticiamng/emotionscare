
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { LiveVoiceScannerProps, EmotionResult } from '@/types';
import { analyzeEmotion } from '@/lib/scanService';

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onResult,
  autoStart = false,
  duration = 30
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  useEffect(() => {
    if (autoStart) {
      startListening();
    }
  }, [autoStart]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let audioTimer: NodeJS.Timeout;
    
    if (isListening) {
      // Timer for counting elapsed time
      timer = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Auto-process every 10 seconds if we have transcript
          if (newTime % 10 === 0 && transcript) {
            processTranscript();
          }
          
          // Stop after duration
          if (newTime >= duration) {
            stopListening();
            return duration;
          }
          
          return newTime;
        });
      }, 1000);
      
      // Simulate audio levels
      audioTimer = setInterval(() => {
        setAudioLevel(Math.random() * 0.8 + 0.2);
      }, 200);
      
      // Simulate receiving transcription
      const phrases = [
        "I'm feeling quite good today.",
        "Work has been challenging lately.",
        "I'm excited about the upcoming project."
      ];
      
      setTimeout(() => {
        setTranscript(phrases[Math.floor(Math.random() * phrases.length)]);
      }, 3000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
      if (audioTimer) clearInterval(audioTimer);
    };
  }, [isListening, transcript, duration]);
  
  const startListening = () => {
    setIsListening(true);
    setTimeElapsed(0);
    setTranscript('');
  };
  
  const stopListening = () => {
    setIsListening(false);
    if (transcript) {
      processTranscript();
    }
  };
  
  const processTranscript = async () => {
    try {
      if (transcript) {
        const result = await analyzeEmotion(transcript);
        const fullResult: EmotionResult = {
          ...result,
          transcript
        };
        
        if (onResult) {
          onResult(fullResult);
        }
      }
    } catch (error) {
      console.error('Error in live voice analysis:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Voice Emotion Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" /> Start Listening
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-200 ease-out"
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {isListening && (
          <div className="text-sm text-muted-foreground">
            Listening... {timeElapsed}s / {duration}s
          </div>
        )}
        
        {transcript && (
          <div className="p-3 bg-muted/30 rounded-md mt-4">
            <p className="font-medium mb-1">I hear you saying:</p>
            <p className="text-sm italic">{transcript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;
