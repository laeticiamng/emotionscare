import { useState, useEffect } from 'react';

interface PrivacyPrefs {
  cam: boolean;
  mic: boolean;
  hr: boolean;
  push: boolean;
}

// Default to all sensors OFF for privacy
const DEFAULT_PREFS: PrivacyPrefs = {
  cam: false,
  mic: false,
  hr: false,
  push: false,
};

export function usePrivacy() {
  const [prefs, setPrefs] = useState<PrivacyPrefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const response = await fetch('/me/privacy_prefs', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setPrefs({ ...DEFAULT_PREFS, ...data.prefs });
        }
      } catch (error) {
        console.warn('Failed to load privacy preferences:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPrefs();
  }, []);

  const enableSensor = async (sensor: keyof PrivacyPrefs) => {
    try {
      // Request actual permission based on sensor type
      let granted = false;
      
      if (sensor === 'cam') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        granted = true;
      } else if (sensor === 'mic') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        granted = true;
      } else if (sensor === 'push') {
        const permission = await Notification.requestPermission();
        granted = permission === 'granted';
      } else if (sensor === 'hr') {
        // For HR sensor, we just enable it (no browser API needed)
        granted = true;
      }

      if (granted) {
        const newPrefs = { ...prefs, [sensor]: true };
        setPrefs(newPrefs);

        // Save to backend
        await fetch('/me/privacy_prefs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ [sensor]: true })
        });
      }
    } catch (error) {
      console.warn(`Failed to enable ${sensor} sensor:`, error);
    }
  };

  const disableSensor = async (sensor: keyof PrivacyPrefs) => {
    const newPrefs = { ...prefs, [sensor]: false };
    setPrefs(newPrefs);

    try {
      await fetch('/me/privacy_prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [sensor]: false })
      });
    } catch (error) {
      console.warn(`Failed to disable ${sensor} sensor:`, error);
    }
  };

  return {
    ...prefs,
    loading,
    enableSensor,
    disableSensor
  };
}