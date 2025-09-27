/**
 * Hook getUserMedia API native - Architecture minimale
 * Remplace les libs externes pour cam/mic (face AR, journal voix, scan)
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export interface MediaConstraints {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

export interface MediaState {
  stream: MediaStream | null;
  isActive: boolean;
  devices: MediaDeviceInfo[];
  permissions: {
    camera: PermissionState | 'unknown';
    microphone: PermissionState | 'unknown';
  };
  error: string | null;
  isLoading: boolean;
}

export const useUserMedia = () => {
  const [state, setState] = useState<MediaState>({
    stream: null,
    isActive: false,
    devices: [],
    permissions: {
      camera: 'unknown',
      microphone: 'unknown'
    },
    error: null,
    isLoading: false
  });

  const streamRef = useRef<MediaStream | null>(null);

  // Vérifier les permissions
  const checkPermissions = useCallback(async () => {
    if (!navigator.permissions) return;

    try {
      const [camera, microphone] = await Promise.all([
        navigator.permissions.query({ name: 'camera' as PermissionName }),
        navigator.permissions.query({ name: 'microphone' as PermissionName })
      ]);

      setState(prev => ({
        ...prev,
        permissions: {
          camera: camera.state,
          microphone: microphone.state
        }
      }));
    } catch (error) {
      console.warn('Impossible de vérifier les permissions média');
    }
  }, []);

  // Lister les dispositifs disponibles
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setState(prev => ({ ...prev, devices }));
      return devices;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Impossible d\'accéder aux dispositifs média'
      }));
      return [];
    }
  }, []);

  // Démarrer le flux média
  const startMedia = useCallback(async (constraints: MediaConstraints = { video: true, audio: true }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      streamRef.current = stream;
      
      setState(prev => ({
        ...prev,
        stream,
        isActive: true,
        isLoading: false
      }));

      return stream;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'accès aux médias';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        isActive: false
      }));

      throw error;
    }
  }, []);

  // Arrêter le flux média
  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      
      setState(prev => ({
        ...prev,
        stream: null,
        isActive: false
      }));
    }
  }, []);

  // Capturer une photo depuis le flux vidéo
  const capturePhoto = useCallback((
    videoElement: HTMLVideoElement,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context non supporté'));
          return;
        }

        canvas.width = options?.width || videoElement.videoWidth;
        canvas.height = options?.height || videoElement.videoHeight;
        
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Erreur lors de la capture'));
          }
        }, 'image/jpeg', options?.quality || 0.8);
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  // Enregistrer l'audio
  const startAudioRecording = useCallback(async (
    options?: {
      mimeType?: string;
      audioBitsPerSecond?: number;
    }
  ): Promise<{
    recorder: MediaRecorder;
    dataPromise: Promise<Blob>;
  }> => {
    if (!state.stream) {
      throw new Error('Aucun flux audio actif');
    }

    const mimeType = options?.mimeType || 'audio/webm;codecs=opus';
    
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      throw new Error(`Type MIME non supporté: ${mimeType}`);
    }

    const recorder = new MediaRecorder(state.stream, {
      mimeType,
      audioBitsPerSecond: options?.audioBitsPerSecond || 128000
    });

    const chunks: BlobPart[] = [];
    
    const dataPromise = new Promise<Blob>((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };

      recorder.onerror = (error) => {
        reject(error);
      };
    });

    recorder.start();

    return { recorder, dataPromise };
  }, [state.stream]);

  // Changer de dispositif
  const switchDevice = useCallback(async (deviceId: string, type: 'video' | 'audio') => {
    const constraints: MediaConstraints = {};
    
    if (type === 'video') {
      constraints.video = { deviceId: { exact: deviceId } };
      constraints.audio = state.stream?.getAudioTracks().length > 0;
    } else {
      constraints.audio = { deviceId: { exact: deviceId } };
      constraints.video = state.stream?.getVideoTracks().length > 0;
    }

    // Arrêter le flux actuel
    stopMedia();
    
    // Démarrer avec le nouveau dispositif
    return await startMedia(constraints);
  }, [state.stream, stopMedia, startMedia]);

  // Initialisation
  useEffect(() => {
    checkPermissions();
    getDevices();
  }, [checkPermissions, getDevices]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, [stopMedia]);

  return {
    ...state,
    startMedia,
    stopMedia,
    capturePhoto,
    startAudioRecording,
    switchDevice,
    getDevices,
    checkPermissions,
    isSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  };
};

// Hook spécialisé pour scan facial
export const useFacialScan = () => {
  const { startMedia, stopMedia, capturePhoto, isSupported } = useUserMedia();
  
  const startFacialScan = useCallback(async () => {
    return await startMedia({ 
      video: { 
        width: { ideal: 1280 }, 
        height: { ideal: 720 },
        facingMode: 'user'
      }, 
      audio: false 
    });
  }, [startMedia]);

  return {
    startFacialScan,
    stopMedia,
    capturePhoto,
    isSupported
  };
};

// Hook spécialisé pour journal voix
export const useVoiceJournal = () => {
  const { startMedia, stopMedia, startAudioRecording, isSupported } = useUserMedia();
  
  const startVoiceRecording = useCallback(async () => {
    const stream = await startMedia({ 
      video: false, 
      audio: { 
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    });
    
    const { recorder, dataPromise } = await startAudioRecording({
      mimeType: 'audio/webm;codecs=opus'
    });
    
    return { recorder, dataPromise };
  }, [startMedia, startAudioRecording]);

  return {
    startVoiceRecording,
    stopMedia,
    isSupported
  };
};