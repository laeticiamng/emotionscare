
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle } from 'lucide-react';
import { EmotionResult, VoiceEmotionScannerProps } from '@/types/types';

const VoiceEmotionScanner: React.FC<VoiceEmotionScannerProps> = ({
  onScanComplete
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        setAudioChunks((chunks) => [...chunks, e.data]);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        processAudio(audioBlob);
        
        // Stop all tracks on the stream to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  
  const processAudio = async (audioBlob: Blob) => {
    try {
      // In a real app, you would send this to an API for analysis
      // For this demo, we'll simulate a response
      const result: EmotionResult = {
        id: `voice-${Date.now()}`,
        emotion: 'calm',
        confidence: 0.82,
        transcript: 'Voice transcript would go here',
        audio_url: URL.createObjectURL(audioBlob),
        date: new Date().toISOString()
      };
      
      if (onScanComplete) {
        onScanComplete(result);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder, isRecording]);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-6 bg-muted rounded-full">
        <Button
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="h-16 w-16 rounded-full"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <StopCircle className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
      </div>
      
      <div className="text-center">
        {isRecording ? (
          <p className="text-sm text-muted-foreground animate-pulse">Enregistrement en cours...</p>
        ) : (
          <p className="text-sm text-muted-foreground">Cliquez pour commencer l'enregistrement</p>
        )}
      </div>
      
      {audioBlob && !isRecording && (
        <div className="w-full">
          <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
        </div>
      )}
    </div>
  );
};

export default VoiceEmotionScanner;
