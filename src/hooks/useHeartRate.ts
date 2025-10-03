import { useCallback, useEffect } from 'react';
import { useHRStore, type HRReading } from '@/store/hr.store';

const HEART_RATE_SERVICE_UUID = 'heart_rate';
const HEART_RATE_MEASUREMENT_UUID = 'heart_rate_measurement';

export const useHeartRate = () => {
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
    // Bit 1-2: Sensor Contact Status
    // Bit 3: Energy Expended Status
    // Bit 4: RR-Interval
    
    const flags = dataView.getUint8(0);
    const is16Bit = flags & 0x1;
    
    let heartRate: number;
    
    if (is16Bit) {
      // 16-bit heart rate value
      heartRate = dataView.getUint16(1, true); // little endian
    } else {
      // 8-bit heart rate value
      heartRate = dataView.getUint8(1);
    }
    
    // Validate range
    if (heartRate < 30 || heartRate > 220) {
      console.warn('Invalid heart rate reading:', heartRate);
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
      console.log('Requesting Bluetooth device...');
      
      // Request device with heart rate service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HEART_RATE_SERVICE_UUID] }],
        optionalServices: ['device_information']
      });

      console.log('Device selected:', device.name);
      store.setDevice(device);

      // Connect to GATT server
      const server = await device.gatt!.connect();
      console.log('Connected to GATT server');

      // Get heart rate service
      const service = await server.getPrimaryService(HEART_RATE_SERVICE_UUID);
      console.log('Heart rate service obtained');

      // Get heart rate measurement characteristic
      const characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT_UUID);
      console.log('Heart rate measurement characteristic obtained');

      store.setCharacteristic(characteristic);

      // Set up notifications
      await characteristic.startNotifications();
      console.log('Notifications started');

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
          
          console.log('Heart rate:', heartRate, 'BPM');
        }
      });

      // Handle device disconnection
      device.addEventListener('gattserverdisconnected', () => {
        console.log('Device disconnected');
        store.setConnected(false);
        store.setBpm(null);
        store.setDevice(null);
        store.setCharacteristic(null);
      });

      store.setConnected(true);
      store.setSource('ble');
      store.startSession();
      
      console.log('Heart rate monitoring started');
      return true;

    } catch (error: any) {
      console.error('Error connecting to heart rate device:', error);
      
      let errorMessage = 'Failed to connect to heart rate device';
      
      if (error.name === 'NotFoundError') {
        errorMessage = 'No heart rate device found';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Bluetooth access denied';
      } else if (error.name === 'NotSupportedError') {
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
      
      console.log('Disconnected from heart rate device');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }, [store]);

  // Send metrics to backend (optional)
  const sendMetrics = useCallback(async () => {
    if (!store.sessionStart || !store.avgBpm) return;

    try {
      const duration = Math.round((Date.now() - store.sessionStart) / 1000);
      
      // Fire-and-forget metrics
      const response = await fetch('/api/metrics/hr_ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: store.source,
          bpm_avg: store.avgBpm,
          duration_sec: duration
        })
      });
      
      console.log('HR metrics sent:', { duration, avgBpm: store.avgBpm });
    } catch (error) {
      console.warn('Failed to send HR metrics:', error);
    }
  }, [store.sessionStart, store.avgBpm, store.source]);

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