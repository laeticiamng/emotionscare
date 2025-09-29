import { useCallback, useEffect, useRef, useState } from 'react';
import { useARStore } from '@/store/ar.store';

interface CameraConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    facingMode: 'user' | 'environment';
    deviceId?: string;
  };
}

export const useCamera = () => {
  const store = useARStore();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Get available camera devices
  const getDevices = useCallback(async () => {
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      return videoDevices;
    } catch (error) {
      console.error('Error enumerating devices:', error);
      store.setError('Failed to enumerate camera devices');
      return [];
    }
  }, [store]);

  // Start camera with specified constraints
  const startCamera = useCallback(async (deviceId?: string, facingMode: 'user' | 'environment' = 'user') => {
    setIsLoading(true);
    store.setError(null);

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }

      const constraints: CameraConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode,
          ...(deviceId && { deviceId })
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      store.setHasCamera(true);
      store.setCameraPermission('granted');
      store.setDeviceId(deviceId || null);
      
      // Set video source if video element exists
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      console.log('Camera started successfully');
      return mediaStream;

    } catch (error: any) {
      console.error('Error starting camera:', error);
      
      if (error.name === 'NotAllowedError') {
        store.setCameraPermission('denied');
        store.setError('Camera access denied');
      } else if (error.name === 'NotFoundError') {
        store.setError('No camera found');
      } else if (error.name === 'NotReadableError') {
        store.setError('Camera is being used by another application');
      } else {
        store.setError('Failed to access camera');
      }
      
      store.setHasCamera(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [store]);

  // Stop camera and cleanup
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    store.setHasCamera(false);
    store.setActive(false);
    
    console.log('Camera stopped');
  }, [stream, store]);

  // Switch camera (front/back)
  const switchCamera = useCallback(async () => {
    if (!devices.length) return;
    
    const currentDeviceId = store.deviceId;
    const availableDevices = devices.filter(device => device.deviceId !== currentDeviceId);
    
    if (availableDevices.length > 0) {
      await stopCamera();
      await startCamera(availableDevices[0].deviceId);
    }
  }, [devices, store.deviceId, stopCamera, startCamera]);

  // Capture frame from video
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !stream) return null;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (!ctx) return null;

      ctx.drawImage(video, 0, 0);
      
      // Convert to JPEG with 60% quality for efficiency
      return canvas.toDataURL('image/jpeg', 0.6);
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  }, [stream]);

  // Check camera permission status
  const checkPermission = useCallback(async () => {
    try {
      if (!navigator.permissions) {
        store.setCameraPermission('prompt');
        return 'prompt';
      }

      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      store.setCameraPermission(permission.state as any);
      return permission.state;
    } catch (error) {
      console.error('Error checking camera permission:', error);
      store.setCameraPermission('prompt');
      return 'prompt';
    }
  }, [store]);

  // Initialize devices on mount
  useEffect(() => {
    getDevices();
    checkPermission();
  }, [getDevices, checkPermission]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    stream,
    devices,
    isLoading,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame,
    getDevices,
    checkPermission,
    hasMultipleCameras: devices.length > 1,
  };
};