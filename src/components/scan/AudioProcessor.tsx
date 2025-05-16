
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, AudioWaveform } from 'lucide-react';

interface AudioProcessorProps {
  onAudioData?: (audioData: Float32Array) => void;
  onVolumeChange?: (volume: number) => void;
  autoStart?: boolean;
  showControls?: boolean;
  className?: string;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onAudioData,
  onVolumeChange,
  autoStart = false,
  showControls = true,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    if (autoStart) {
      startRecording();
    }
    return () => {
      stopRecording();
    };
  }, [autoStart]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Create nodes
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Connect nodes
      sourceRef.current.connect(analyserRef.current);
      
      // Set up periodic sampling
      setIsRecording(true);
      setHasPermission(true);
      
      // Begin sampling audio data
      sampleAudio();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
    }
  };
  
  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    setIsRecording(false);
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const sampleAudio = () => {
    if (!isRecording || !analyserRef.current) return;
    
    const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getFloatTimeDomainData(dataArray);
    
    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const volumeLevel = Math.min(1, rms * 10); // Scale up for better visualization
    
    setVolume(volumeLevel);
    if (onVolumeChange) onVolumeChange(volumeLevel);
    
    // Send audio data to parent if callback provided
    if (onAudioData) onAudioData(dataArray);
    
    // Continue sampling
    requestAnimationFrame(sampleAudio);
  };

  if (hasPermission === false) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
        <p className="text-red-600 dark:text-red-400 mb-2">Microphone access denied</p>
        <p className="text-sm text-muted-foreground">Please allow microphone access to use this feature.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showControls && (
        <div className="flex items-center justify-center">
          <Button 
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            className="rounded-full h-14 w-14 flex items-center justify-center"
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>
        </div>
      )}
      
      {isRecording && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <AudioWaveform className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-xs">
              Volume: {Math.round(volume * 100)}%
            </span>
          </div>
          
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-out"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioProcessor;
