// @ts-nocheck
/**
 * User Mode Types - Système de gestion des modes utilisateur
 * Types pour B2C, B2B User, B2B Admin et permissions associées
 */

/** Types de mode utilisateur */
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

/** Sous-types de mode B2B */
export type B2BSubMode = 'team_member' | 'team_lead' | 'department_head' | 'hr_manager' | 'executive';

/** Niveaux d'accès */
export type AccessLevel = 'basic' | 'standard' | 'premium' | 'enterprise' | 'unlimited';

/** Type de contexte du mode utilisateur */
export interface UserModeContextType {
  userMode: UserModeType | null;
  setUserMode: (mode: UserModeType) => void;
  changeUserMode: (mode: UserModeType) => void;
  isLoading: boolean;
  error?: string;
  permissions: UserPermissions;
  features: UserFeatures;
  subscription?: SubscriptionInfo;
  organization?: OrganizationInfo;
  switchToMode: (mode: UserModeType, options?: SwitchModeOptions) => Promise<boolean>;
  canAccessMode: (mode: UserModeType) => boolean;
  refreshPermissions: () => Promise<void>;
}

/** Options de changement de mode */
export interface SwitchModeOptions {
  redirectTo?: string;
  preserveContext?: boolean;
  notifyUser?: boolean;
}

/** Permissions utilisateur */
export interface UserPermissions {
  // Fonctionnalités de base
  canAccessDashboard: boolean;
  canAccessJournal: boolean;
  canAccessMeditation: boolean;
  canAccessBreathing: boolean;
  canAccessMusic: boolean;
  canAccessCoach: boolean;

  // Fonctionnalités avancées
  canAccessAnalytics: boolean;
  canAccessPredictions: boolean;
  canAccessExport: boolean;
  canAccessApi: boolean;

  // Administration
  canManageUsers: boolean;
  canManageTeams: boolean;
  canManageOrganization: boolean;
  canViewReports: boolean;
  canConfigureSettings: boolean;
  canAccessBilling: boolean;

  // Intégrations
  canConnectDevices: boolean;
  canUseIntegrations: boolean;
  canAccessWebhooks: boolean;

  // Données
  canDeleteData: boolean;
  canExportData: boolean;
  canImportData: boolean;
  canShareData: boolean;
}

/** Fonctionnalités disponibles par mode */
export interface UserFeatures {
  // Limites
  maxDailyEntries: number;
  maxStorageBytes: number;
  maxTeamMembers: number;
  maxIntegrations: number;
  maxExportsPerMonth: number;

  // Fonctionnalités
  hasUnlimitedHistory: boolean;
  hasAdvancedAnalytics: boolean;
  hasPredictiveInsights: boolean;
  hasCustomBranding: boolean;
  hasPrioritySupport: boolean;
  hasApiAccess: boolean;
  hasWebhooks: boolean;
  hasSso: boolean;
  hasAuditLogs: boolean;

  // Contenu
  hasAllMeditationContent: boolean;
  hasAllMusicContent: boolean;
  hasCoachingSessions: boolean;
  hasGroupSessions: boolean;

  // Personnalisation
  hasCustomThemes: boolean;
  hasCustomNotifications: boolean;
  hasCustomReports: boolean;
}

/** Informations d'abonnement */
export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  currency: string;
  features: string[];
  limits: SubscriptionLimits;
  nextBillingDate?: string;
  cancelAtPeriodEnd?: boolean;
}

/** Plans d'abonnement */
export type SubscriptionPlan =
  | 'free'
  | 'starter'
  | 'pro'
  | 'business'
  | 'enterprise'
  | 'custom';

/** Statuts d'abonnement */
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

/** Limites d'abonnement */
export interface SubscriptionLimits {
  users: number;
  storage: number;
  apiCalls: number;
  exports: number;
  integrations: number;
}

/** Informations sur l'organisation */
export interface OrganizationInfo {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  industry?: string;
  size?: OrganizationSize;
  plan: SubscriptionPlan;
  settings: OrganizationSettings;
  stats: OrganizationStats;
  createdAt: string;
  verifiedAt?: string;
}

/** Taille d'organisation */
export type OrganizationSize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';

/** Paramètres d'organisation */
export interface OrganizationSettings {
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  defaultUserRole: string;
  enableTeams: boolean;
  enableDepartments: boolean;
  enableSso: boolean;
  ssoProvider?: string;
  allowExternalSharing: boolean;
  dataRetentionDays: number;
  customDomain?: string;
  branding?: OrganizationBranding;
}

/** Branding d'organisation */
export interface OrganizationBranding {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;
}

/** Statistiques d'organisation */
export interface OrganizationStats {
  totalUsers: number;
  activeUsers: number;
  totalTeams: number;
  totalEntries: number;
  averageEngagement: number;
  storageUsed: number;
  lastActivityAt: string;
}

/** Configuration des modes */
export interface UserModeConfig {
  mode: UserModeType;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  defaultPermissions: Partial<UserPermissions>;
  defaultFeatures: Partial<UserFeatures>;
  availableRoutes: string[];
  blockedRoutes: string[];
}

/** État du mode utilisateur */
export interface UserModeState {
  currentMode: UserModeType | null;
  previousMode: UserModeType | null;
  isTransitioning: boolean;
  lastModeChange: string | null;
  availableModes: UserModeType[];
  modeHistory: ModeChangeRecord[];
}

/** Enregistrement de changement de mode */
export interface ModeChangeRecord {
  fromMode: UserModeType | null;
  toMode: UserModeType;
  timestamp: string;
  reason?: string;
  userId?: string;
}

/** Événement de changement de mode */
export interface ModeChangeEvent {
  previousMode: UserModeType | null;
  newMode: UserModeType;
  userId: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/** Valeurs par défaut des permissions B2C */
export const DEFAULT_B2C_PERMISSIONS: UserPermissions = {
  canAccessDashboard: true,
  canAccessJournal: true,
  canAccessMeditation: true,
  canAccessBreathing: true,
  canAccessMusic: true,
  canAccessCoach: false,
  canAccessAnalytics: false,
  canAccessPredictions: false,
  canAccessExport: false,
  canAccessApi: false,
  canManageUsers: false,
  canManageTeams: false,
  canManageOrganization: false,
  canViewReports: false,
  canConfigureSettings: false,
  canAccessBilling: false,
  canConnectDevices: true,
  canUseIntegrations: false,
  canAccessWebhooks: false,
  canDeleteData: true,
  canExportData: false,
  canImportData: false,
  canShareData: false
};

/** Valeurs par défaut des permissions B2B User */
export const DEFAULT_B2B_USER_PERMISSIONS: UserPermissions = {
  canAccessDashboard: true,
  canAccessJournal: true,
  canAccessMeditation: true,
  canAccessBreathing: true,
  canAccessMusic: true,
  canAccessCoach: true,
  canAccessAnalytics: true,
  canAccessPredictions: true,
  canAccessExport: true,
  canAccessApi: false,
  canManageUsers: false,
  canManageTeams: false,
  canManageOrganization: false,
  canViewReports: true,
  canConfigureSettings: false,
  canAccessBilling: false,
  canConnectDevices: true,
  canUseIntegrations: true,
  canAccessWebhooks: false,
  canDeleteData: true,
  canExportData: true,
  canImportData: false,
  canShareData: true
};

/** Valeurs par défaut des permissions B2B Admin */
export const DEFAULT_B2B_ADMIN_PERMISSIONS: UserPermissions = {
  canAccessDashboard: true,
  canAccessJournal: true,
  canAccessMeditation: true,
  canAccessBreathing: true,
  canAccessMusic: true,
  canAccessCoach: true,
  canAccessAnalytics: true,
  canAccessPredictions: true,
  canAccessExport: true,
  canAccessApi: true,
  canManageUsers: true,
  canManageTeams: true,
  canManageOrganization: true,
  canViewReports: true,
  canConfigureSettings: true,
  canAccessBilling: true,
  canConnectDevices: true,
  canUseIntegrations: true,
  canAccessWebhooks: true,
  canDeleteData: true,
  canExportData: true,
  canImportData: true,
  canShareData: true
};

/** Obtenir les permissions par défaut pour un mode */
export function getDefaultPermissions(mode: UserModeType): UserPermissions {
  switch (mode) {
    case 'b2c':
      return DEFAULT_B2C_PERMISSIONS;
    case 'b2b_user':
      return DEFAULT_B2B_USER_PERMISSIONS;
    case 'b2b_admin':
      return DEFAULT_B2B_ADMIN_PERMISSIONS;
    default:
      return DEFAULT_B2C_PERMISSIONS;
  }
}

/** Type guard pour UserModeType */
export function isValidUserMode(value: unknown): value is UserModeType {
  return value === 'b2c' || value === 'b2b_user' || value === 'b2b_admin';
}

/** Type guard pour SubscriptionPlan */
export function isValidSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  const validPlans: SubscriptionPlan[] = ['free', 'starter', 'pro', 'business', 'enterprise', 'custom'];
  return typeof value === 'string' && validPlans.includes(value as SubscriptionPlan);
}

/** Obtenir le nom d'affichage d'un mode */
export function getUserModeDisplayName(mode: UserModeType): string {
  switch (mode) {
    case 'b2c':
      return 'Personnel';
    case 'b2b_user':
      return 'Professionnel';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Inconnu';
  }
}

export default {
  DEFAULT_B2C_PERMISSIONS,
  DEFAULT_B2B_USER_PERMISSIONS,
  DEFAULT_B2B_ADMIN_PERMISSIONS,
  getDefaultPermissions,
  isValidUserMode,
  isValidSubscriptionPlan,
  getUserModeDisplayName
};
