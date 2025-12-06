/**
 * Détection des compatibilités navigateur et iOS - Garde-fous techniques
 */

export interface DeviceCapabilities {
  webBluetooth: boolean;
  webXR: boolean;
  audioAutoplay: boolean;
  getUserMedia: boolean;
  pushNotifications: boolean;
  isIOS: boolean;
  isSafari: boolean;
}

class DeviceCompatibilityChecker {
  private capabilities: DeviceCapabilities | null = null;

  /**
   * Détecter les capacités de l'appareil
   */
  async checkCapabilities(): Promise<DeviceCapabilities> {
    if (this.capabilities) return this.capabilities;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    this.capabilities = {
      // Web Bluetooth non dispo sur Safari iOS
      webBluetooth: 'bluetooth' in navigator && !isIOS,
      
      // WebXR souvent indispo
      webXR: 'xr' in navigator && 'isSessionSupported' in navigator.xr,
      
      // Autoplay policy restrictions
      audioAutoplay: await this.testAudioAutoplay(),
      
      // Camera/microphone access
      getUserMedia: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      
      // Push notifications
      pushNotifications: 'serviceWorker' in navigator && 'PushManager' in window,
      
      isIOS,
      isSafari
    };

    return this.capabilities;
  }

  /**
   * Test si l'autoplay audio fonctionne
   */
  private async testAudioAutoplay(): Promise<boolean> {
    try {
      const audio = new Audio();
      audio.muted = true;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        audio.pause();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Masquer les contrôles HR sur iOS
   */
  shouldShowHeartRateControls(): boolean {
    return this.capabilities?.webBluetooth || false;
  }

  /**
   * Forcer fallback 2D si WebXR indisponible
   */
  shouldUseVRFallback(): boolean {
    return !this.capabilities?.webXR;
  }

  /**
   * Nécessite clic pour audio
   */
  requiresUserInteractionForAudio(): boolean {
    return !this.capabilities?.audioAutoplay;
  }

  /**
   * Message d'info selon les limitations
   */
  getCompatibilityMessages(): string[] {
    const messages: string[] = [];
    
    if (!this.capabilities) return [];

    if (this.capabilities.isIOS && !this.capabilities.webBluetooth) {
      messages.push('Capteur cardiaque non disponible sur iOS - simulation activée');
    }

    if (!this.capabilities.webXR) {
      messages.push('Mode VR non disponible - version 2D activée');
    }

    if (!this.capabilities.audioAutoplay) {
      messages.push('Audio nécessite un clic utilisateur');
    }

    if (!this.capabilities.getUserMedia) {
      messages.push('Caméra/microphone non disponible');
    }

    return messages;
  }

  /**
   * Configuration adaptée à l'appareil
   */
  getOptimalConfig() {
    if (!this.capabilities) {
      throw new Error('Capabilities not checked yet. Call checkCapabilities() first.');
    }

    return {
      // HR par défaut en simulation sur iOS
      heartRate: {
        defaultMode: this.capabilities.isIOS ? 'simulation' : 'bluetooth',
        showBluetoothControls: this.capabilities.webBluetooth
      },
      
      // VR avec fallback automatique
      vr: {
        available: this.capabilities.webXR,
        fallbackTo2D: !this.capabilities.webXR
      },
      
      // Audio avec gestion click-to-play
      audio: {
        requiresInteraction: !this.capabilities.audioAutoplay,
        autoplayAllowed: this.capabilities.audioAutoplay
      },
      
      // Camera avec permissions
      camera: {
        available: this.capabilities.getUserMedia,
        requiresPermission: true
      },
      
      // Push avec service worker
      push: {
        available: this.capabilities.pushNotifications,
        requiresPermission: true
      }
    };
  }
}

export const deviceCompatChecker = new DeviceCompatibilityChecker();

/**
 * Hook pour obtenir les capacités device
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCapabilities = async () => {
      try {
        const caps = await deviceCompatChecker.checkCapabilities();
        setCapabilities(caps);
      } catch (error) {
        console.error('Error checking device capabilities:', error);
      } finally {
        setLoading(false);
      }
    };

    checkCapabilities();
  }, []);

  return {
    capabilities,
    loading,
    config: capabilities ? deviceCompatChecker.getOptimalConfig() : null,
    messages: capabilities ? deviceCompatChecker.getCompatibilityMessages() : []
  };
};

// Nécessaire pour le hook
import { useState, useEffect } from 'react';