/**
 * TYPES DE CONFIGURATION SYSTÈME
 * Types partagés pour le centre de configuration globale
 */

export interface SystemConfig {
  general: GeneralConfig;
  security: SecurityConfig;
  database: DatabaseConfig;
  notifications: NotificationsConfig;
  performance: PerformanceConfig;
  features: FeaturesConfig;
  branding: BrandingConfig;
}

export interface GeneralConfig {
  appName: string;
  appDescription: string;
  supportEmail: string;
  maintenanceMode: boolean;
  debugMode: boolean;
  analyticsEnabled: boolean;
}

export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireMFA: boolean;
  allowedDomains: string[];
  ipWhitelist: string[];
}

export interface DatabaseConfig {
  connectionPool: number;
  queryTimeout: number;
  backupSchedule: string;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface NotificationsConfig {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  slackWebhook: string;
  discordWebhook: string;
}

export interface PerformanceConfig {
  cacheEnabled: boolean;
  cacheTtl: number;
  compressionLevel: number;
  cdnEnabled: boolean;
  rateLimitEnabled: boolean;
  rateLimit: number;
}

export interface FeaturesConfig {
  userRegistration: boolean;
  socialLogin: boolean;
  fileUpload: boolean;
  videoCall: boolean;
  aiFeatures: boolean;
  premiumFeatures: boolean;
}

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  customCss: string;
  footerText: string;
}

export interface ConfigurationHistory {
  id: string;
  timestamp: string;
  user: string;
  section: string;
  changes: Record<string, any>;
  reason: string;
}

export interface ConfigSectionProps<T> {
  config: T;
  onChange: (newConfig: T) => void;
  validationErrors?: Record<string, string>;
}
