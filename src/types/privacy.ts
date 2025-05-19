
export type GdprRequestType = 'access' | 'rectification' | 'deletion' | 'portability' | 'objection' | 'restriction';

export type GdprRequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface GdprRequest {
  id: string;
  userId: string;
  userName?: string;
  requestType: GdprRequestType;
  status: GdprRequestStatus;
  submittedAt: string;
  dueDate: string;
  completedAt?: string;
  rejectionReason?: string;
  details?: string;
}

export interface PrivacyConsentSettings {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
}

export interface AccessLog {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  ip: string;
  device: string;
  location?: string;
  status: 'success' | 'warning' | 'error';
  details?: string;
}

export interface SecurityAlert {
  id: string;
  userId?: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  date: string;
  isNew: boolean;
  actionRequired?: boolean;
  actionText?: string;
  relatedTo?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'json' | 'csv' | 'pdf' | 'zip';
  expiresAt?: string;
  downloadUrl?: string;
  includedData: string[];
}

export type DataBreachSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface DataBreachNotification {
  id: string;
  title: string;
  description: string;
  affectedUsers: number;
  detectedAt: string;
  resolvedAt?: string;
  severity: DataBreachSeverity;
  actions: string[];
  status: 'investigating' | 'contained' | 'resolved';
}
