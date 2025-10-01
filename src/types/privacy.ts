// @ts-nocheck

export interface AuditLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'data_access' | 'data_export' | 'data_delete' | 'preference_change' | 'consent_given' | 'consent_revoked';
  resource: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: string;
  metadata?: Record<string, any>;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'marketing' | 'analytics' | 'functional' | 'essential' | 'cookies';
  granted: boolean;
  timestamp: string;
  version: string;
  source: 'banner' | 'settings' | 'registration';
  ipAddress?: string;
}

export interface DataRequest {
  id: string;
  userId: string;
  type: 'export' | 'delete' | 'rectification' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: string;
  completedDate?: string;
  notes?: string;
  downloadUrl?: string;
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketing: boolean;
  anonymization: boolean;
  dataRetention: number; // en mois
  exportFormat: 'json' | 'csv' | 'xml';
}

export interface SecurityMetrics {
  securityScore: number;
  lastLogin: string;
  eventsCount: number;
  complianceLevel: 'high' | 'medium' | 'low';
  threatLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface GdprRights {
  access: boolean;
  rectification: boolean;
  erasure: boolean;
  portability: boolean;
  restriction: boolean;
  objection: boolean;
}
