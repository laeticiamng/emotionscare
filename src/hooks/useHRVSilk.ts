import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrivacyPrefs } from './usePrivacyPrefs';

interface HRVReading {
  rr_intervals: number[]; // RR intervals in milliseconds
  timestamp: number;
  quality: 'good' | 'fair' | 'poor';
}

export interface HRVData {
  rr_before_ms?: number[] | null;
  rr_during_ms?: number[] | null;
  rr_after_ms?: number[] | null;
}

export const useHRVSilk = () => {
  const { prefs } = usePrivacyPrefs();
  const [isActive, setIsActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentHR, setCurrentHR] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const rrIntervalsRef = useRef<number[]>([]);
  const sessionDataRef = useRef<HRVData>({ rr_during_ms: [] });
  const isRecordingRef = useRef(false);
  
  // Check if HRV is supported and allowed
  const isSupported = 'bluetooth' in navigator && prefs.heartRate;
  
  // Connect to HR device
  const connect = useCallback(async () => {
    if (!isSupported) {
      console.log('HRV not supported or disabled');
      return false;
    }
    
    try {
      setError(null);
      
      // Request Bluetooth device with Heart Rate service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['heart_rate']
      });
      
      console.log('Connecting to HR device:', device.name);
      
      // Connect to GATT server
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      
      // Set up notification handler
      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleHRNotification);
      
      deviceRef.current = device;
      characteristicRef.current = characteristic;
      setIsConnected(true);
      
      console.log('HRV device connected');
      return true;
      
    } catch (error: any) {
      console.error('Failed to connect to HR device:', error);
      setError(error.message);
      return false;
    }
  }, [isSupported]);
  
  // Handle heart rate notifications from device
  const handleHRNotification = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value!;
    
    try {
      // Parse heart rate measurement
      const flags = value.getUint8(0);
      const hrValue16 = flags & 0x1;
      const contactSupported = flags & 0x2;
      const contactDetected = flags & 0x4;
      const hasRRInterval = flags & 0x10;
      
      // Get heart rate value
      const heartRate = hrValue16 ? value.getUint16(1, true) : value.getUint8(1);
      setCurrentHR(heartRate);
      
      // Extract RR intervals if available (for HRV calculation)
      if (hasRRInterval && isRecordingRef.current) {
        let offset = hrValue16 ? 3 : 2;
        const rrIntervals: number[] = [];
        
        while (offset < value.byteLength) {
          const rrValue = value.getUint16(offset, true);
          // RR interval is in 1/1024 seconds, convert to milliseconds
          const rrMs = (rrValue / 1024) * 1000;
          rrIntervals.push(rrMs);
          offset += 2;
        }
        
        if (rrIntervals.length > 0) {
          rrIntervalsRef.current.push(...rrIntervals);
          
          // Add to session data if recording
          if (sessionDataRef.current.rr_during_ms) {
            sessionDataRef.current.rr_during_ms.push(...rrIntervals);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to parse HR notification:', error);
    }
  }, []);
  
  // Start HRV recording session
  const startRecording = useCallback(() => {
    if (!isConnected) {
      console.warn('Cannot start HRV recording: device not connected');
      return;
    }
    
    console.log('Starting HRV recording');
    isRecordingRef.current = true;
    rrIntervalsRef.current = [];
    sessionDataRef.current = { rr_during_ms: [] };
    setIsActive(true);
  }, [isConnected]);
  
  // Stop HRV recording session
  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;
    
    console.log('Stopping HRV recording');
    isRecordingRef.current = false;
    setIsActive(false);
    
    return sessionDataRef.current;
  }, []);
  
  // Disconnect from device
  const disconnect = useCallback(async () => {
    if (deviceRef.current?.gatt?.connected) {
      try {
        if (characteristicRef.current) {
          await characteristicRef.current.stopNotifications();
          characteristicRef.current.removeEventListener('characteristicvaluechanged', handleHRNotification);
        }
        
        deviceRef.current.gatt.disconnect();
        console.log('HRV device disconnected');
      } catch (error) {
        console.error('Error disconnecting device:', error);
      }
    }
    
    deviceRef.current = null;
    characteristicRef.current = null;
    setIsConnected(false);
    setIsActive(false);
    setCurrentHR(null);
  }, [handleHRNotification]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);
  
  return {
    // State
    isSupported,
    isConnected,
    isActive,
    currentHR,
    error,
    
    // Actions
    connect,
    disconnect,
    startRecording,
    stopRecording,
    
    // Data
    getSessionData: () => sessionDataRef.current,
  };
};