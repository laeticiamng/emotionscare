/**
 * Services unifiés - Point d'entrée principal
 */

// Services principaux
export { default as emotionService } from './emotion';
export { default as musicService } from './music';
export { default as coachService } from './coach';
export { default as journalService } from './journal';

// API Services
export * from './api';
export * from './auth-service';
export * from './emotionService';
export * from './musicService';

// Types de services
export interface APIStatus {
  status: 'online' | 'offline' | 'degraded';
  lastCheck: Date;
  responseTime?: number;
}

// Service par défaut pour compatibilité
const servicesStatus: APIStatus = {
  status: 'online',
  lastCheck: new Date(),
  responseTime: 150
};

export default servicesStatus;
export { servicesStatus as APIStatus };