/**
 * useARPermissions Hook - Phase 4.5
 * Manage device permissions for AR (camera, motion sensors)
 */

import { useEffect, useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

export interface DevicePermissions {
  camera: PermissionStatus;
  accelerometer: PermissionStatus;
  gyroscope: PermissionStatus;
  magnetometer: PermissionStatus;
}

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

/**
 * Hook to manage AR permissions
 */
export function useARPermissions() {
  const [permissions, setPermissions] = useState<DevicePermissions>({
    camera: 'unknown',
    accelerometer: 'unknown',
    gyroscope: 'unknown',
    magnetometer: 'unknown'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check permission status
  const checkPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const newPermissions: DevicePermissions = {
        camera: 'unknown',
        accelerometer: 'unknown',
        gyroscope: 'unknown',
        magnetometer: 'unknown'
      };

      // Check camera permission using Permissions API
      try {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as any });
        newPermissions.camera = cameraPermission.state as PermissionStatus;

        // Listen for changes
        cameraPermission.addEventListener('change', () => {
          setPermissions((prev) => ({
            ...prev,
            camera: cameraPermission.state as PermissionStatus
          }));
        });
      } catch (err) {
        logger.warn('Camera permission check not supported', {}, 'AR');
        newPermissions.camera = 'prompt';
      }

      // Check for DeviceMotionEvent support
      if (typeof DeviceMotionEvent !== 'undefined') {
        if ('requestPermission' in DeviceMotionEvent) {
          // iOS 13+ requires permission request
          newPermissions.accelerometer = 'prompt';
          newPermissions.gyroscope = 'prompt';
        } else {
          // Other devices - assume granted if available
          newPermissions.accelerometer = 'granted';
          newPermissions.gyroscope = 'granted';
        }
      }

      // Check for DeviceOrientationEvent support
      if (typeof DeviceOrientationEvent !== 'undefined') {
        if ('requestPermission' in DeviceOrientationEvent) {
          newPermissions.magnetometer = 'prompt';
        } else {
          newPermissions.magnetometer = 'granted';
        }
      }

      setPermissions(newPermissions);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to check permissions', err as Error, 'AR');
    } finally {
      setLoading(false);
    }
  }, []);

  // Request camera permission
  const requestCameraPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

      // Stop the stream
      stream.getTracks().forEach((track) => track.stop());

      setPermissions((prev) => ({
        ...prev,
        camera: 'granted'
      }));

      logger.info('Camera permission granted', {}, 'AR');
      return 'granted';
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);

      if (errorMsg.includes('NotAllowedError')) {
        setPermissions((prev) => ({
          ...prev,
          camera: 'denied'
        }));
        return 'denied';
      }

      setError(errorMsg);
      logger.error('Failed to request camera permission', err as Error, 'AR');
      return 'prompt';
    }
  }, []);

  // Request device motion permission (iOS 13+)
  const requestMotionPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        'requestPermission' in DeviceMotionEvent
      ) {
        const permission = await (DeviceMotionEvent as any).requestPermission();

        if (permission === 'granted') {
          setPermissions((prev) => ({
            ...prev,
            accelerometer: 'granted',
            gyroscope: 'granted'
          }));

          logger.info('Motion permission granted', {}, 'AR');
          return 'granted';
        } else {
          setPermissions((prev) => ({
            ...prev,
            accelerometer: 'denied',
            gyroscope: 'denied'
          }));

          return 'denied';
        }
      } else {
        // Non-iOS devices - assume granted if available
        setPermissions((prev) => ({
          ...prev,
          accelerometer: 'granted',
          gyroscope: 'granted'
        }));

        return 'granted';
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to request motion permission', err as Error, 'AR');
      return 'prompt';
    }
  }, []);

  // Request orientation permission (iOS 13+)
  const requestOrientationPermission = useCallback(async (): Promise<PermissionStatus> => {
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        'requestPermission' in DeviceOrientationEvent
      ) {
        const permission = await (DeviceOrientationEvent as any).requestPermission();

        if (permission === 'granted') {
          setPermissions((prev) => ({
            ...prev,
            magnetometer: 'granted'
          }));

          logger.info('Orientation permission granted', {}, 'AR');
          return 'granted';
        } else {
          setPermissions((prev) => ({
            ...prev,
            magnetometer: 'denied'
          }));

          return 'denied';
        }
      } else {
        setPermissions((prev) => ({
          ...prev,
          magnetometer: 'granted'
        }));

        return 'granted';
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to request orientation permission', err as Error, 'AR');
      return 'prompt';
    }
  }, []);

  // Request all permissions needed for AR
  const requestAllPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const cameraResult = await requestCameraPermission();
      const motionResult = await requestMotionPermission();
      const orientationResult = await requestOrientationPermission();

      const allGranted = [cameraResult, motionResult, orientationResult].every((p) => p === 'granted');

      if (!allGranted) {
        setError('Not all permissions were granted');
      }

      return allGranted;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to request all permissions', err as Error, 'AR');
      return false;
    }
  }, [requestCameraPermission, requestMotionPermission, requestOrientationPermission]);

  // Check if all AR permissions are granted
  const allPermissionsGranted = useCallback((): boolean => {
    return (
      permissions.camera === 'granted' &&
      permissions.accelerometer === 'granted' &&
      permissions.gyroscope === 'granted' &&
      permissions.magnetometer === 'granted'
    );
  }, [permissions]);

  // Check on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissions,
    loading,
    error,
    checkPermissions,
    requestCameraPermission,
    requestMotionPermission,
    requestOrientationPermission,
    requestAllPermissions,
    allPermissionsGranted: allPermissionsGranted()
  };
}

/**
 * Hook to detect AR support
 */
export function useARSupport() {
  const [isSupported, setIsSupported] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectAR = async () => {
      try {
        setLoading(true);

        // Check WebXR support
        if (!navigator.xr) {
          setIsSupported(false);
          setLoading(false);
          return;
        }

        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        setIsSupported(supported);

        // Detect device type
        const userAgent = navigator.userAgent;
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
          setDeviceType('ios');
        } else if (userAgent.includes('Android')) {
          setDeviceType('android');
        } else if (userAgent.includes('Windows') || userAgent.includes('Mac')) {
          setDeviceType('desktop');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        logger.error('Failed to detect AR support', err as Error, 'AR');
        setIsSupported(false);
      } finally {
        setLoading(false);
      }
    };

    detectAR();
  }, []);

  return { isSupported, deviceType, loading, error };
}

/**
 * Hook for fullscreen request
 */
export function useARFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestFullscreen = useCallback(async (element?: HTMLElement): Promise<boolean> => {
    try {
      const target = element || document.documentElement;

      if (target.requestFullscreen) {
        await target.requestFullscreen();
        setIsFullscreen(true);
        return true;
      } else if ((target as any).webkitRequestFullscreen) {
        await (target as any).webkitRequestFullscreen();
        setIsFullscreen(true);
        return true;
      } else if ((target as any).mozRequestFullScreen) {
        await (target as any).mozRequestFullScreen();
        setIsFullscreen(true);
        return true;
      }

      return false;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to request fullscreen', err as Error, 'AR');
      return false;
    }
  }, []);

  const exitFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      logger.error('Failed to exit fullscreen', err as Error, 'AR');
    }
  }, []);

  return { isFullscreen, error, requestFullscreen, exitFullscreen };
}
