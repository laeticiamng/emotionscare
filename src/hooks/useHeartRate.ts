// @ts-nocheck
/**
 * useHeartRate - Hook pour monitorer la fréquence cardiaque via Bluetooth
 * Utilise Web Bluetooth API + localStorage/Supabase pour persistance
 */

import { useCallback, useEffect } from 'react';
import { useHRStore, type HRReading } from '@/store/hr.store';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const HEART_RATE_SERVICE_UUID = 'heart_rate';
const HEART_RATE_MEASUREMENT_UUID = 'heart_rate_measurement';
const HR_METRICS_STORAGE_KEY = 'hr_metrics_history';

export const useHeartRate = () => {
  const { user } = useAuth();
  const store = useHRStore();

  // Check if Web Bluetooth is supported
  const checkSupport = useCallback(() => {
    const isSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;
    store.setSupported(isSupported);
    return isSupported;
  }, [store]);

  // Parse heart rate measurement data
  const parseHeartRateData = useCallback((dataView: DataView): number => {
    // Heart Rate Measurement characteristic format:
    // Byte 0: Flags
    // Bit 0: 0 = Heart Rate Value Format is UINT8, 1 = UINT16
    
    const flags = dataView.getUint8(0);
    const is16Bit = flags & 0x1;
    
    let heartRate: number;
    
    if (is16Bit) {
      heartRate = dataView.getUint16(1, true); // little endian
    } else {
      heartRate = dataView.getUint8(1);
    }
    
    // Validate range
    if (heartRate < 30 || heartRate > 220) {
      logger.warn('Invalid heart rate reading', { heartRate }, 'HR');
      return 0;
    }
    
    return heartRate;
  }, []);

  // Connect to BLE heart rate device
  const connect = useCallback(async () => {
    if (!checkSupport()) {
      store.setError('Web Bluetooth not supported in this browser');
      return false;
    }

    store.setConnecting(true);
    store.setError(null);

    try {
      logger.info('Requesting Bluetooth device', undefined, 'HR');
      
      // Request device with heart rate service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HEART_RATE_SERVICE_UUID] }],
        optionalServices: ['device_information']
      });

      logger.info('Device selected', { deviceName: device.name }, 'HR');
      store.setDevice(device);

      // Connect to GATT server
      const server = await device.gatt!.connect();
      logger.info('Connected to GATT server', undefined, 'HR');

      // Get heart rate service
      const service = await server.getPrimaryService(HEART_RATE_SERVICE_UUID);
      logger.info('Heart rate service obtained', undefined, 'HR');

      // Get heart rate measurement characteristic
      const characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT_UUID);
      logger.info('Heart rate measurement characteristic obtained', undefined, 'HR');

      store.setCharacteristic(characteristic);

      // Set up notifications
      await characteristic.startNotifications();
      logger.info('Notifications started', undefined, 'HR');

      // Listen for heart rate measurements
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const dataView = target.value!;
        
        const heartRate = parseHeartRateData(dataView);
        
        if (heartRate > 0) {
          const reading: HRReading = {
            bpm: heartRate,
            ts: Date.now(),
            source: 'ble'
          };
          
          store.setBpm(heartRate);
          store.addReading(reading);
          
          logger.info('Heart rate', { heartRate, unit: 'BPM' }, 'HR');
        }
      });

      // Handle device disconnection
      device.addEventListener('gattserverdisconnected', () => {
        logger.info('Device disconnected', undefined, 'HR');
        store.setConnected(false);
        store.setBpm(null);
        store.setDevice(null);
        store.setCharacteristic(null);
      });

      store.setConnected(true);
      store.setSource('ble');
      store.startSession();
      
      logger.info('Heart rate monitoring started', undefined, 'HR');
      return true;

    } catch (error) {
      logger.error('Error connecting to heart rate device', error as Error, 'HR');
      
      let errorMessage = 'Failed to connect to heart rate device';
      
      if ((error as Error).name === 'NotFoundError') {
        errorMessage = 'No heart rate device found';
      } else if ((error as Error).name === 'SecurityError') {
        errorMessage = 'Bluetooth access denied';
      } else if ((error as Error).name === 'NotSupportedError') {
        errorMessage = 'Device not supported';
      }
      
      store.setError(errorMessage);
      return false;
    } finally {
      store.setConnecting(false);
    }
  }, [store, checkSupport, parseHeartRateData]);

  // Disconnect from device
  const disconnect = useCallback(async () => {
    try {
      if (store.characteristic) {
        await store.characteristic.stopNotifications();
      }
      
      if (store.device && store.device.gatt && store.device.gatt.connected) {
        store.device.gatt.disconnect();
      }
      
      store.setConnected(false);
      store.setBpm(null);
      store.setDevice(null);
      store.setCharacteristic(null);
      store.endSession();
      
      logger.info('Disconnected from heart rate device', undefined, 'HR');
    } catch (error) {
      logger.error('Error disconnecting', error as Error, 'HR');
    }
  }, [store]);

  // Send metrics (localStorage + Supabase)
  const sendMetrics = useCallback(async () => {
    if (!store.sessionStart || !store.avgBpm) return;

    try {
      const duration = Math.round((Date.now() - store.sessionStart) / 1000);
      
      const metricsData = {
        source: store.source,
        bpm_avg: store.avgBpm,
        duration_sec: duration,
        timestamp: new Date().toISOString()
      };

      // Store locally
      const storedMetrics = localStorage.getItem(HR_METRICS_STORAGE_KEY);
      const metricsHistory = storedMetrics ? JSON.parse(storedMetrics) : [];
      metricsHistory.push(metricsData);
      
      // Keep only last 100 entries
      if (metricsHistory.length > 100) {
        metricsHistory.shift();
      }
      localStorage.setItem(HR_METRICS_STORAGE_KEY, JSON.stringify(metricsHistory));

      // Persist to Supabase if user is logged in
      if (user) {
        try {
          await supabase.from('user_settings').upsert({
            user_id: user.id,
            key: 'hr_metrics_latest',
            value: JSON.stringify(metricsData),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,key' });
        } catch (err) {
          logger.warn('Failed to save HR metrics to Supabase', err as Error, 'HR');
        }
      }
      
      logger.info('HR metrics saved', { duration, avgBpm: store.avgBpm }, 'HR');
    } catch (error) {
      logger.warn('Failed to save HR metrics', { error }, 'HR');
    }
  }, [store.sessionStart, store.avgBpm, store.source, user]);

  // Initialize on mount
  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // State
    bpm: store.bpm,
    avgBpm: store.avgBpm,
    connected: store.connected,
    connecting: store.connecting,
    source: store.source,
    error: store.error,
    isSupported: store.isSupported,
    readings: store.readings,
    
    // Actions
    connect,
    disconnect,
    sendMetrics,
    
    // Utils
    checkSupport,
  };
};
