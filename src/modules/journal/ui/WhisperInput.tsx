/**
 * WhisperInput - Composant d'entrée vocale pour le journal
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, MicOff, Square, 
  Volume2, Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhisperInputProps {
  isRecording: boolean;
  recordingDuration: number;
  canRecord: boolean;
  isProcessing?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  className?: string;
}

export const WhisperInput: React.FC<WhisperInputProps> = ({
  isRecording,
  recordingDuration,
  canRecord,
  isProcessing = false,
  onStartRecording,
  onStopRecording,
  className
}) => {
  const [_audioLevel, _setAudioLevel] = useState(0);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingPhase = () => {
    if (isProcessing) return 'processing';
    if (isRecording) return 'recording';
    return 'idle';
  };

  const getPhaseConfig = () => {
    const phase = getRecordingPhase();
    
    switch (phase) {
      case 'recording':
        return {
          bgColor: 'bg-red-500',
          pulseColor: 'bg-red-400',
          textColor: 'text-red-600',
          message: 'Enregistrement en cours...',
          icon: Square
        };
      case 'processing':
        return {
          bgColor: 'bg-blue-500',
          pulseColor: 'bg-blue-400',
          textColor: 'text-blue-600',
          message: 'Traitement avec IA...',
          icon: Loader2
        };
      default:
        return {
          bgColor: 'bg-muted',
          pulseColor: 'bg-muted-foreground',
          textColor: 'text-muted-foreground', 
          message: canRecord ? 'Prêt à enregistrer' : 'Microphone non disponible',
          icon: canRecord ? Mic : MicOff
        };
    }
  };

  const phaseConfig = getPhaseConfig();
  const Icon = phaseConfig.icon;

  return (
    <Card className={cn("border-2", className)}>
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Status et titre */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Journal Vocal</h3>
            <p className={cn("text-sm", phaseConfig.textColor)}>
              {phaseConfig.message}
            </p>
          </div>

          {/* Bouton principal d'enregistrement */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Cercles de pulse pour l'enregistrement */}
              <AnimatePresence>
                {(isRecording || isProcessing) && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          "absolute inset-0 rounded-full opacity-20",
                          phaseConfig.pulseColor
                        )}
                        initial={{ scale: 1, opacity: 0.3 }}
                        animate={{ 
                          scale: 2.5 + i * 0.5, 
                          opacity: 0 
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Bouton principal */}
              <Button
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={!canRecord || isProcessing}
                size="lg"
                className={cn(
                  "h-20 w-20 rounded-full relative z-10 transition-all duration-200",
                  isRecording || isProcessing 
                    ? phaseConfig.bgColor + " hover:opacity-90" 
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                <Icon 
                  className={cn(
                    "h-8 w-8",
                    isProcessing && "animate-spin"
                  )} 
                />
              </Button>
            </div>
          </div>

          {/* Informations d'enregistrement */}
          <AnimatePresence>
            {(isRecording || isProcessing) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Timer */}
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold">
                    {formatDuration(recordingDuration)}
                  </div>
                  
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm text-muted-foreground">REC</span>
                    </div>
                  )}
                </div>

                {/* Visualisation audio simplifiée */}
                {isRecording && (
                  <div className="flex justify-center gap-1">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-red-400 rounded-full"
                        animate={{
                          height: [4, 20, 4],
                        }}
                        transition={{
                          duration: 0.5 + Math.random() * 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Status de traitement */}
                {isProcessing && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Transcription et analyse IA...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!isRecording && !isProcessing && (
            <div className="text-center text-sm text-muted-foreground space-y-2">
              {canRecord ? (
                <>
                  <p>Appuyez pour commencer à enregistrer vos pensées</p>
                  <p className="text-xs">L'IA transcrira et analysera automatiquement</p>
                </>
              ) : (
                <>
                  <p>Microphone non autorisé</p>
                  <p className="text-xs">Utilisez le mode texte ci-dessous</p>
                </>
              )}
            </div>
          )}

          {/* Badges d'état */}
          <div className="flex justify-center gap-2">
            <Badge variant={canRecord ? "default" : "secondary"}>
              <Volume2 className="h-3 w-3 mr-1" />
              {canRecord ? 'Audio OK' : 'Audio OFF'}
            </Badge>
            {isRecording && (
              <Badge variant="destructive">
                En direct
              </Badge>
            )}
            {isProcessing && (
              <Badge variant="default">
                IA Active
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhisperInput;