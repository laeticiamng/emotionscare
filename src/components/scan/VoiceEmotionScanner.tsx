
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Loader } from 'lucide-react';
import { VoiceEmotionScannerProps, EmotionResult } from '@/types';
import { analyzeEmotion } from '@/lib/scanService';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({ 
  onResult,
  duration = 15,
  autoStart = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
  }, [autoStart]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      stopRecording();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, timeLeft]);

  const startRecording = () => {
    setIsRecording(true);
    setTimeLeft(duration);
    setTranscript('');
    
    // Simulate receiving transcription
    const mockPhrases = [
      "I'm feeling really happy today.",
      "The project is going well, I'm excited.",
      "I had a great time with my friends yesterday."
    ];
    
    setTimeout(() => {
      setTranscript(mockPhrases[Math.floor(Math.random() * mockPhrases.length)]);
    }, 3000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    try {
      // Process the transcript
      if (transcript) {
        const result = await analyzeEmotion(transcript);
        
        // Add transcript to result
        const fullResult: EmotionResult = {
          ...result,
          transcript
        };
        
        if (onResult) {
          onResult(fullResult);
        }
      }
    } catch (error) {
      console.error('Error analyzing voice emotion:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Emotion Scanner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="icon"
              className="w-full h-full rounded-full"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
            >
              {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
            {isRecording && (
              <svg className="absolute -inset-2" viewBox="0 0 100 100">
                <circle
                  className="stroke-primary fill-none"
                  strokeWidth="4"
                  cx="50"
                  cy="50"
                  r="48"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 * (1 - timeLeft / duration)}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
            )}
          </div>
        </div>
        
        {isRecording && (
          <div className="text-center">
            <p className="text-xl font-medium">Recording: {timeLeft}s</p>
            <p className="text-sm text-muted-foreground mt-1">Speak clearly and naturally</p>
          </div>
        )}
        
        {transcript && (
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="font-medium mb-1">Transcript:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader className="animate-spin h-4 w-4" />
            <span className="text-sm">Analyzing emotion...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceEmotionScanner;
