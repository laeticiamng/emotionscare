import { useState, useEffect, useCallback } from 'react';
import { useVRStore } from '@/store/vr.store';

export const useXRSession = () => {
  const store = useVRStore();
  const [session, setSession] = useState<XRSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check WebXR support on mount
  useEffect(() => {
    const checkXRSupport = async () => {
      if (!navigator.xr) {
        console.log('WebXR not supported');
        store.setXRSupported(false);
        return;
      }

      try {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        store.setXRSupported(supported);
        console.log('WebXR VR support:', supported);
      } catch (err) {
        console.error('Error checking XR support:', err);
        store.setXRSupported(false);
      }
    };

    checkXRSupport();
  }, [store]);

  // Enter VR session
  const enterXR = useCallback(async () => {
    if (!navigator.xr || !store.xrSupported) {
      setError('WebXR not supported');
      return false;
    }

    try {
      setError(null);
      console.log('Requesting VR session...');

      const xrSession = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking']
      });

      // Set up session event handlers
      xrSession.addEventListener('end', handleSessionEnd);
      xrSession.addEventListener('visibilitychange', handleVisibilityChange);

      setSession(xrSession);
      store.setInXR(true);
      store.setSessionActive(true);

      console.log('VR session started successfully');
      return true;

    } catch (err: any) {
      console.error('Failed to enter VR:', err);
      setError(err.message || 'Failed to start VR session');
      return false;
    }
  }, [store]);

  // Exit VR session
  const exitXR = useCallback(async () => {
    if (session) {
      try {
        await session.end();
        console.log('VR session ended by user');
      } catch (err) {
        console.error('Error ending VR session:', err);
      }
    }
  }, [session]);

  // Handle session end (from user or system)
  const handleSessionEnd = useCallback(() => {
    console.log('VR session ended');
    setSession(null);
    store.setInXR(false);
    store.setSessionActive(false);
  }, [store]);

  // Handle visibility changes (user removes/puts on headset)
  const handleVisibilityChange = useCallback((event: XRSessionEvent) => {
    const session = event.session;
    console.log('VR session visibility changed:', session.visibilityState);
    
    // Could pause/resume breath pattern based on visibility
    if (session.visibilityState === 'hidden') {
      // User removed headset - could auto-pause
      if (store.running && !store.paused) {
        store.pause();
      }
    } else if (session.visibilityState === 'visible') {
      // User put headset back on - could auto-resume
      if (store.running && store.paused) {
        store.resume();
      }
    }
  }, [store]);

  // Clean up session on unmount
  useEffect(() => {
    return () => {
      if (session) {
        session.end().catch(console.error);
      }
    };
  }, [session]);

  return {
    // State
    xrSupported: store.xrSupported,
    inXR: store.inXR,
    sessionActive: store.sessionActive,
    session,
    error,
    
    // Actions
    enterXR,
    exitXR,
  };
};