// Point 5: Services API Foundation - Export centralisé
export { httpClient as default, httpClient } from './httpClient';
export { mockServer } from './mockServer';
export * from '@/types/api';

// Services API spécialisés
export * from './endpoints';