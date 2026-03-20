/**
 * Hook Web Bluetooth API native - Architecture minimale
 * Pour Bubble-Beat et capteurs de rythme cardiaque
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';

export interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
  services?: BluetoothRemoteGATTService[];
}

export interface HeartRateData {
  bpm: number;
  rrIntervals?: number[];
  timestamp: number;
  quality: 'good' | 'fair' | 'poor';
}

export interface BluetoothState {
  isScanning: boolean;
  isConnected: boolean;
  currentDevice: BluetoothDevice | null;
  heartRateData: HeartRateData | null;
  error: string | null;
  isSupported: boolean;
}

// UUID standards pour capteurs de fréquence cardiaque
const HEART_RATE_SERVICE = 0x180D;
const HEART_RATE_MEASUREMENT = 0x2A37;
const BATTERY_SERVICE = 0x180F;
const BATTERY_LEVEL = 0x2A19;

export const useWebBluetooth = () => {
  const [state, setState] = useState<BluetoothState>({
    isScanning: false,
    isConnected: false,
    currentDevice: null,
    heartRateData: null,
    error: null,
    isSupported: typeof navigator !== 'undefined' && 'bluetooth' in navigator
  });

  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  // Scanner pour dispositifs de fréquence cardiaque
  const scanForHeartRateDevices = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Web Bluetooth non supporté' }));
      return;
    }

    setState(prev => ({ ...prev, isScanning: true, error: null }));

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [HEART_RATE_SERVICE] },
          { namePrefix: 'Polar' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Wahoo' },
          { namePrefix: 'Fitbit' }
        ],
        optionalServices: [BATTERY_SERVICE]
      });

      const bluetoothDevice: BluetoothDevice = {
        id: device.id,
        name: device.name || 'Dispositif inconnu',
        connected: false
      };

      deviceRef.current = bluetoothDevice;
      setState(prev => ({ 
        ...prev, 
        currentDevice: bluetoothDevice, 
        isScanning: false 
      }));

      return bluetoothDevice;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur de scan Bluetooth',
        isScanning: false 
      }));
      throw error;
    }
  }, [state.isSupported]);

  // Se connecter à un dispositif
  const connectDevice = useCallback(async (device?: BluetoothDevice) => {
    const targetDevice = device || deviceRef.current;
    if (!targetDevice || !state.isSupported) return;

    try {
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HEART_RATE_SERVICE] }]
      });

      const server = await bluetoothDevice.gatt?.connect();
      if (!server) throw new Error('Impossible de se connecter au serveur GATT');

      const service = await server.getPrimaryService(HEART_RATE_SERVICE);
      const characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT);

      characteristicRef.current = characteristic;

      // Commencer à écouter les notifications
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleHeartRateData);

      setState(prev => ({ 
        ...prev, 
        isConnected: true,
        currentDevice: { ...targetDevice, connected: true }
      }));

      // Gérer la déconnexion
      bluetoothDevice.addEventListener('gattserverdisconnected', () => {
        setState(prev => ({ 
          ...prev, 
          isConnected: false,
          currentDevice: prev.currentDevice ? { ...prev.currentDevice, connected: false } : null
        }));
      });

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur de connexion'
      }));
      throw error;
    }
  }, [state.isSupported]);

  // Traiter les données de fréquence cardiaque
  const handleHeartRateData = useCallback((event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    
    if (!value) return;

    // Analyser les données selon le standard Bluetooth
    const flags = value.getUint8(0);
    const is16Bit = flags & 0x01;
    
    let heartRate: number;
    if (is16Bit) {
      heartRate = value.getUint16(1, true); // little endian
    } else {
      heartRate = value.getUint8(1);
    }

    // Extraire les intervalles RR si disponibles
    let rrIntervals: number[] = [];
    if (flags & 0x10) { // RR interval present
      const rrStart = is16Bit ? 3 : 2;
      for (let i = rrStart; i < value.byteLength; i += 2) {
        if (i + 1 < value.byteLength) {
          const rr = value.getUint16(i, true) * (1000 / 1024); // Convert to ms
          rrIntervals.push(rr);
        }
      }
    }

    // Déterminer la qualité du signal
    let quality: 'good' | 'fair' | 'poor' = 'good';
    if (heartRate < 40 || heartRate > 200) {
      quality = 'poor';
    } else if (heartRate < 50 || heartRate > 180) {
      quality = 'fair';
    }

    const heartRateData: HeartRateData = {
      bpm: heartRate,
      rrIntervals,
      timestamp: Date.now(),
      quality
    };

    setState(prev => ({ ...prev, heartRateData }));
  }, []);

  // Déconnecter le dispositif
  const disconnectDevice = useCallback(async () => {
    if (characteristicRef.current) {
      try {
        await characteristicRef.current.stopNotifications();
        characteristicRef.current.removeEventListener('characteristicvaluechanged', handleHeartRateData);
      } catch (error) {
        logger.warn('Erreur lors de l\'arrêt des notifications', error as Error, 'SYSTEM');
      }
    }

    if (deviceRef.current) {
      try {
        const bluetoothDevice = await navigator.bluetooth.requestDevice({
          filters: [{ services: [HEART_RATE_SERVICE] }]
        });
        await bluetoothDevice.gatt?.disconnect();
      } catch (error) {
        logger.warn('Erreur lors de la déconnexion', error as Error, 'SYSTEM');
      }
    }

    setState(prev => ({ 
      ...prev, 
      isConnected: false,
      currentDevice: prev.currentDevice ? { ...prev.currentDevice, connected: false } : null
    }));
  }, [handleHeartRateData]);

  // Simulation pour fallback quand Bluetooth OFF
  const startSimulation = useCallback(() => {
    let simulationInterval: NodeJS.Timeout;
    
    const generateSimulatedHR = () => {
      // Simulation réaliste de fréquence cardiaque
      const baseHR = 75;
      const variation = Math.sin(Date.now() / 10000) * 15; // Variation lente
      const noise = (Math.random() - 0.5) * 6; // Bruit
      const bpm = Math.round(baseHR + variation + noise);
      
      const simulatedData: HeartRateData = {
        bpm: Math.max(60, Math.min(100, bpm)), // Borné entre 60-100
        timestamp: Date.now(),
        quality: 'fair' // Qualité simulée
      };
      
      setState(prev => ({ ...prev, heartRateData: simulatedData }));
    };

    // Générer des données toutes les secondes
    simulationInterval = setInterval(generateSimulatedHR, 1000);
    
    setState(prev => ({ 
      ...prev, 
      isConnected: true,
      currentDevice: {
        id: 'simulation',
        name: 'Simulation Capteur HR',
        connected: true
      }
    }));

    return () => {
      clearInterval(simulationInterval);
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        currentDevice: null,
        heartRateData: null
      }));
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      disconnectDevice();
    };
  }, [disconnectDevice]);

  return {
    ...state,
    scanForHeartRateDevices,
    connectDevice,
    disconnectDevice,
    startSimulation
  };
};

// Hook spécialisé pour Bubble-Beat
export const useBubbleBeat = () => {
  const { 
    heartRateData, 
    isConnected, 
    connectDevice, 
    startSimulation, 
    isSupported 
  } = useWebBluetooth();

  // Démarrer Bubble-Beat avec capteur ou simulation
  const startBubbleBeat = useCallback(async (preferSimulation = false) => {
    if (!isSupported || preferSimulation) {
      return startSimulation();
    }

    try {
      await connectDevice();
    } catch (error) {
      // Fallback vers simulation en cas d'échec
      logger.warn('Connexion Bluetooth échouée, passage en simulation', error as Error, 'SYSTEM');
      return startSimulation();
    }
  }, [isSupported, connectDevice, startSimulation]);

  // Obtenir le rythme visuel pour l'UI (pas de BPM brut affiché)
  const getRhythmVisual = useCallback(() => {
    if (!heartRateData) {
      return { 
        rhythm: 'calm', 
        intensity: 'medium',
        label: '💙 Rythme détecté'
      };
    }

    const { bpm, quality } = heartRateData;
    
    let rhythm: 'slow' | 'calm' | 'active' | 'intense' = 'calm';
    let intensity: 'low' | 'medium' | 'high' = 'medium';
    
    if (bpm < 70) {
      rhythm = 'slow';
      intensity = 'low';
    } else if (bpm < 85) {
      rhythm = 'calm';
      intensity = 'medium';
    } else if (bpm < 100) {
      rhythm = 'active';
      intensity = 'medium';
    } else {
      rhythm = 'intense';
      intensity = 'high';
    }

    const labels = {
      slow: '🌸 Rythme paisible',
      calm: '💙 Rythme serein',
      active: '⚡ Rythme énergique', 
      intense: '🔥 Rythme intense'
    };

    return {
      rhythm,
      intensity,
      label: labels[rhythm],
      quality
    };
  }, [heartRateData]);

  return {
    heartRateData,
    isConnected,
    startBubbleBeat,
    getRhythmVisual,
    isSupported
  };
};