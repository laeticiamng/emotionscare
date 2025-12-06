// @ts-nocheck

import React, { useState, useRef } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Upload, FileAudio, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TranscriptionResult {
  text: string;
  confidence: number;
  duration: number;
}

const VoiceTranscriptionInterface: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Timer pour la durée d'enregistrement
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Enregistrement démarré",
        description: "Parlez maintenant, votre voix est en cours d'enregistrement",
      });
    } catch (error) {
      logger.error('Erreur accès microphone', error as Error, 'UI');
      toast({
        title: "Erreur microphone",
        description: "Impossible d'accéder au microphone. Vérifiez les permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      // Traiter l'audio après un court délai
      setTimeout(() => {
        processAudioRecording();
      }, 100);
    }
  };

  const processAudioRecording = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    await transcribeAudio(audioBlob);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner un fichier audio",
        variant: "destructive"
      });
      return;
    }
    
    await transcribeAudio(file);
  };

  const transcribeAudio = async (audioFile: Blob | File) => {
    setIsTranscribing(true);
    setTranscriptionProgress(0);
    
    // Envoyer l'événement analytics
    await supabase.functions.invoke('analytics', {
      body: {
        event: 'voiceTranscriptRequested',
        properties: {
          fileSize: audioFile.size,
          fileType: audioFile.type
        }
      }
    });
    
    try {
      // Convertir en base64
      const arrayBuffer = await audioFile.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setTranscriptionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      const { data, error } = await supabase.functions.invoke('voice-analysis', {
        body: {
          audio: base64Audio
        }
      });
      
      clearInterval(progressInterval);
      setTranscriptionProgress(100);
      
      if (error) throw error;
      
      const result: TranscriptionResult = {
        text: data.text || "Transcription non disponible",
        confidence: data.confidence || 0.95,
        duration: recordingDuration
      };
      
      setTranscriptionResult(result);
      
      // Envoyer l'événement analytics de succès
      await supabase.functions.invoke('analytics', {
        body: {
          event: 'voiceTranscriptDone',
          properties: {
            textLength: result.text.length,
            confidence: result.confidence,
            duration: result.duration
          }
        }
      });
      
      toast({
        title: "Transcription terminée",
        description: "Votre audio a été transcrit avec succès",
      });
    } catch (error) {
      logger.error('Erreur transcription', error as Error, 'UI');
      toast({
        title: "Erreur de transcription",
        description: "Impossible de transcrire l'audio. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
      setTranscriptionProgress(0);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Transcription vocale
          </CardTitle>
          <CardDescription>
            Enregistrez votre voix ou importez un fichier audio pour le transcrire en texte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section d'enregistrement */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className="w-16 h-16 rounded-full"
                >
                  {isRecording ? (
                    <Square className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                
                {isRecording && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            
            {isRecording && (
              <div className="text-center">
                <p className="text-lg font-medium">{formatDuration(recordingDuration)}</p>
                <p className="text-sm text-muted-foreground">Enregistrement en cours...</p>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Cliquez sur le bouton rouge pour arrêter" : "Cliquez sur le microphone pour commencer"}
              </p>
            </div>
          </div>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Import de fichier */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isTranscribing}
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTranscribing}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importer un fichier audio
            </Button>
          </div>

          {/* Progrès de transcription */}
          {isTranscribing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analyse audio</span>
                <span className="text-sm text-muted-foreground">{transcriptionProgress}%</span>
              </div>
              <Progress value={transcriptionProgress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                Transcription en cours, veuillez patienter...
              </p>
            </div>
          )}

          {/* Résultat de transcription */}
          {transcriptionResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Résultat de la transcription</CardTitle>
                <CardDescription>
                  Confiance: {(transcriptionResult.confidence * 100).toFixed(1)}% • 
                  Durée: {formatDuration(transcriptionResult.duration)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={transcriptionResult.text}
                  readOnly
                  rows={6}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceTranscriptionInterface;
