import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult, LiveVoiceScannerProps } from '@/types/emotion';
import { Mic, MicOff, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onScanComplete,
  onCancel,
  autoStart = false,
  scanDuration = 15
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(scanDuration);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  
  // Automatically start recording if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    
    return () => {
      stopRecording();
    };
  }, [autoStart]);
  
  // Handle recording timer and progress
  useEffect(() => {
    let timer: number;
    
    if (isRecording) {
      if (timeRemaining > 0) {
        timer = window.setTimeout(() => {
          setTimeRemaining(prev => prev - 1);
          setProgress(((scanDuration - (timeRemaining - 1)) / scanDuration) * 100);
        }, 1000);
      } else {
        handleRecordingComplete();
      }
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isRecording, timeRemaining]);
  
  // Simulate audio level animation
  useEffect(() => {
    let animationFrame: number;
    
    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average level
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(average / 256); // Normalize to 0-1
        
        animationFrame = requestAnimationFrame(updateAudioLevel);
      }
    };
    
    if (isRecording) {
      updateAudioLevel();
    }
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      
      // Set up audio analyzer
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      // Start recording
      mediaRecorder.start(500);
      setIsRecording(true);
      setTimeRemaining(scanDuration);
      setProgress(0);
      setAudioChunks([]);
      
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
  };
  
  const handleRecordingComplete = () => {
    stopRecording();
    
    // Here you would typically send the recorded audio to your voice emotion API
    // For now, let's simulate a response
    
    // Simulate API processing delay
    setTimeout(() => {
      // Mock result
      const detectedEmotion: EmotionResult = {
        emotion: 'calm',
        confidence: 0.78,
        secondaryEmotions: ['focused', 'neutral'],
        timestamp: new Date().toISOString(),
        source: 'voice',
        duration: scanDuration - timeRemaining,
        recommendations: [
          {
            id: 'live-music',
            type: 'music',
            title: 'Playlist méditative',
            description: 'Des sons pour maintenir votre état de calme',
            icon: 'music',
            emotion: detectedEmotion.emotion,
          },
          {
            id: 'live-activity',
            type: 'activity',
            title: 'Exercice de respiration',
            description: 'Prenez 5 minutes pour approfondir votre état de calme',
            icon: 'activity',
            emotion: detectedEmotion.emotion,
          },
        ]
      };
      
      setResult(detectedEmotion || { emotion: 'neutral', intensity: 0.5 });
      
      if (onScanComplete) {
        onScanComplete(detectedEmotion || { emotion: 'neutral', intensity: 0.5 });
      }
    }, 1500);
  };
  
  const handleCancel = () => {
    stopRecording();
    
    if (onCancel) {
      onCancel();
    }
  };
  
  // Custom waveform visualization (simplified version since Waveform icon is missing)
  const WaveformVisualization = () => {
    return (
      <div className="flex h-8 items-center space-x-1">
        {Array.from({ length: 15 }).map((_, i) => {
          // Calculate a dynamic height based on audio level and position
          // Add some randomness for a more natural look
          const random = Math.sin(Date.now() / (200 + i * 50)) * 0.2;
          const height = isRecording
            ? Math.max(0.1, Math.min(1, audioLevel + random)) * 100
            : 10;
            
          return (
            <div
              key={i}
              className="w-1 bg-primary rounded-full transition-all duration-75"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mic className="mr-2" />
          <span>Analyse vocale d'émotion</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio visualization */}
        <div className="h-24 bg-muted/20 rounded-md flex items-center justify-center p-4">
          {isRecording ? (
            <WaveformVisualization />
          ) : (
            <div className="text-muted-foreground text-sm">
              Cliquez sur démarrer pour commencer l'analyse vocale
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Enregistrement en cours...</span>
              <span>{timeRemaining}s restantes</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {/* Recording controls */}
        <div className="flex justify-center">
          {isRecording ? (
            <Button 
              variant="destructive"
              onClick={stopRecording}
              className="rounded-full h-14 w-14"
            >
              <MicOff className="h-6 w-6" />
            </Button>
          ) : (
            <Button 
              variant="default"
              onClick={startRecording}
              className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90"
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        {isRecording && (
          <Button variant="outline" onClick={handleRecordingComplete}>
            Terminer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LiveVoiceScanner;
