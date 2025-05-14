
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Trash } from 'lucide-react';

interface AudioEmotionScannerProps {
  audioUrl: string | null;
  onAudioChange: (url: string | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  audioUrl,
  onAudioChange,
  onAnalyze,
  isAnalyzing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Simulated recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Mock recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) { // Max 30 seconds
          clearInterval(interval);
          stopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
    
    // Cleanup
    setTimeout(() => {
      clearInterval(interval);
    }, 31000);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    // Mock audio URL creation
    const mockAudioUrl = "data:audio/wav;base64,MOCK_AUDIO_DATA";
    onAudioChange(mockAudioUrl);
  };
  
  const playAudio = () => {
    if (!audioUrl) return;
    
    setIsPlaying(true);
    
    // Simulate audio playing
    setTimeout(() => {
      setIsPlaying(false);
    }, recordingTime * 1000);
  };
  
  const clearAudio = () => {
    onAudioChange(null);
    setRecordingTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse émotionnelle par audio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="text-xl font-mono mb-2">
            {formatTime(recordingTime)}
          </div>
          
          <div className="flex justify-center gap-4">
            {!isRecording && !audioUrl && (
              <Button 
                onClick={startRecording} 
                className="w-12 h-12 rounded-full"
                size="icon"
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}
            
            {isRecording && (
              <Button 
                onClick={stopRecording} 
                variant="destructive"
                className="w-12 h-12 rounded-full"
                size="icon"
              >
                <Square className="h-6 w-6" />
              </Button>
            )}
            
            {audioUrl && !isRecording && (
              <>
                <Button 
                  onClick={playAudio} 
                  variant="secondary"
                  className="w-12 h-12 rounded-full"
                  size="icon"
                  disabled={isPlaying}
                >
                  <Play className="h-6 w-6" />
                </Button>
                
                <Button 
                  onClick={clearAudio} 
                  variant="outline"
                  className="w-12 h-12 rounded-full"
                  size="icon"
                >
                  <Trash className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {audioUrl && (
          <div className="text-center text-sm text-muted-foreground">
            {isPlaying 
              ? "Lecture en cours..." 
              : "Enregistrement audio prêt pour analyse"}
          </div>
        )}
        
        {!audioUrl && !isRecording && (
          <div className="text-center text-sm text-muted-foreground">
            Appuyez sur le bouton du microphone pour commencer l'enregistrement
          </div>
        )}
        
        {isRecording && (
          <div className="text-center text-sm text-muted-foreground animate-pulse">
            Enregistrement en cours... Parlez de votre état émotionnel
          </div>
        )}
        
        {audioUrl && (
          <Button 
            onClick={onAnalyze} 
            className="w-full"
            disabled={isAnalyzing || isPlaying}
          >
            {isAnalyzing ? "Analyse en cours..." : "Analyser ma voix"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioEmotionScanner;
