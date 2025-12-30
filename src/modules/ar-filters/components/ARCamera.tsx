/**
 * Composant caméra AR avec accès webcam réel et effets de filtre
 */

import React, { useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Circle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ARFilter } from '../hooks/useARFilters';

interface ARCameraProps {
  currentFilter: ARFilter | null;
  isCameraActive: boolean;
  isSessionActive: boolean;
  sessionDuration: number;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapturePhoto: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const ARCamera = memo<ARCameraProps>(({
  currentFilter,
  isCameraActive,
  isSessionActive,
  sessionDuration,
  onStartCamera,
  onStopCamera,
  onCapturePhoto,
  videoRef,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  // Sync video ref
  useEffect(() => {
    if (localVideoRef.current) {
      (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = localVideoRef.current;
    }
  }, [videoRef]);

  return (
    <div className="relative bg-card rounded-2xl overflow-hidden aspect-video border border-border/50 shadow-lg">
      {/* Video Element */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          filter: currentFilter?.cssFilter || 'none',
          display: isCameraActive ? 'block' : 'none',
        }}
      />

      {/* Placeholder when camera is off */}
      {!isCameraActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Camera className="w-10 h-10 text-primary/60" />
          </motion.div>
          <p className="text-muted-foreground text-center px-4">
            Activez la caméra pour commencer votre expérience AR
          </p>
          <Button onClick={onStartCamera} className="gap-2">
            <Camera className="w-4 h-4" />
            Activer la caméra
          </Button>
        </div>
      )}

      {/* Filter Overlay Effect */}
      <AnimatePresence>
        {currentFilter && isCameraActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${currentFilter.color} opacity-20 mix-blend-overlay`}
          />
        )}
      </AnimatePresence>

      {/* Sparkles Effect */}
      {currentFilter && isCameraActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 left-4"
        >
          <Sparkles className="w-6 h-6 text-white/70" />
        </motion.div>
      )}

      {/* Session Timer */}
      {isSessionActive && (
        <div className="absolute top-4 right-4">
          <Badge variant="destructive" className="animate-pulse gap-2">
            <Circle className="w-2 h-2 fill-current" />
            {formatDuration(sessionDuration)}
          </Badge>
        </div>
      )}

      {/* Active Filter Badge */}
      {currentFilter && isCameraActive && (
        <div className="absolute top-4 left-4">
          <Badge className={`bg-gradient-to-r ${currentFilter.color} text-white border-0`}>
            {currentFilter.emoji} {currentFilter.name}
          </Badge>
        </div>
      )}

      {/* Camera Controls */}
      {isCameraActive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={onStopCamera}
            className="rounded-full w-12 h-12 p-0 bg-background/80 backdrop-blur-sm"
            aria-label="Désactiver la caméra"
          >
            <CameraOff className="w-5 h-5" />
          </Button>
          
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              onClick={onCapturePhoto}
              className="rounded-full w-16 h-16 p-0 bg-white text-primary shadow-lg"
              aria-label="Capturer une photo"
            >
              <div className="w-12 h-12 rounded-full border-4 border-primary" />
            </Button>
          </motion.div>
          
          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>
      )}
    </div>
  );
});

ARCamera.displayName = 'ARCamera';

export default ARCamera;