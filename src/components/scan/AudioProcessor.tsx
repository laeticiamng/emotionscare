
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, StopCircle, Loader2 } from 'lucide-react';
import { EmotionResult, AudioProcessorProps } from '@/types';

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  onResult,
  onProcessingChange,
  isRecording: externalIsRecording,
  onError,
  autoStop = false,
  duration = 15000,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(externalIsRecording || false);
  const [processingAudio, setProcessingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Track controlled vs uncontrolled state
  const isControlled = typeof externalIsRecording !== 'undefined';
  const recordingState = isControlled ? externalIsRecording : isRecording;
  
  useEffect(() => {
    if (isControlled) {
      setIsRecording(externalIsRecording);
    }
  }, [externalIsRecording, isControlled]);

  useEffect(() => {
    if (onProcessingChange) {
      onProcessingChange(processingAudio);
    }
    if (setIsProcessing) {
      setIsProcessing(processingAudio);
    }
  }, [processingAudio, onProcessingChange, setIsProcessing]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        processAudioData();
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      if (!isControlled) {
        setIsRecording(true);
      }
      
      // Auto-stop recording after specified duration if enabled
      if (autoStop && duration > 0) {
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            stopRecording();
          }
        }, duration);
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (onError) {
        onError('Failed to access microphone. Please check your permissions.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      if (!isControlled) {
        setIsRecording(false);
      }
    }
  };

  const processAudioData = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    setProcessingAudio(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Mock result for demonstration purposes
      // In a real app, you would send this audio to a server for analysis
      setTimeout(() => {
        const mockResult: EmotionResult = {
          emotion: 'calm',
          score: 0.85,
          confidence: 0.92,
          timestamp: new Date().toISOString(),
          source: 'audio',
          feedback: 'You sound calm and collected.',
          recommendations: [
            {
              title: 'Meditation Session',
              content: 'Try our guided meditation to maintain this calm state.',
              category: 'mindfulness'
            },
            {
              title: 'Calm Playlist',
              content: 'Listen to our curated playlist to enhance your calm mood.',
              category: 'music'
            }
          ]
        };
        
        if (onResult) {
          onResult(mockResult);
        }
        
        setProcessingAudio(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing audio:', error);
      if (onError) {
        onError('Failed to process audio data.');
      }
      setProcessingAudio(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center">
        {processingAudio ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-3 text-center">Analyse de votre voix en cours...</p>
          </div>
        ) : (
          <>
            {recordingState ? (
              <Button 
                variant="destructive"
                size="lg"
                onClick={stopRecording}
                className="h-16 w-16 rounded-full"
              >
                <StopCircle className="h-8 w-8" />
              </Button>
            ) : (
              <Button 
                variant="default"
                size="lg"
                onClick={startRecording}
                className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
              >
                <Mic className="h-8 w-8" />
              </Button>
            )}
            <p className="mt-3 text-center">
              {recordingState 
                ? "Parlez maintenant... Cliquez pour arrêter l'enregistrement" 
                : "Cliquez pour commencer l'enregistrement"}
            </p>
          </>
        )}
      </div>
    </Card>
  );
};

export default AudioProcessor;
