/**
 * Types pour le module Privacy
 * Gestion des préférences de confidentialité et consentements RGPD
 */

export type PrivacyPreferenceKey = 'cam' | 'mic' | 'hr' | 'gps' | 'social' | 'nft' | 'analytics' | 'personalization';

export interface PrivacyPreferences {
  user_id: string;
  cam: boolean;
  mic: boolean;
  hr: boolean;
  gps: boolean;
  social: boolean;
  nft: boolean;
  analytics: boolean;
  personalization: boolean;
  updated_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id: string;
  consent_type: string;
  granted: boolean;
  granted_at: string;
  revoked_at?: string;
  version: string;
  ip_address?: string;
  user_agent?: string;
}

export interface DataExportRequest {
  id: string;
  user_id: string;
  type: 'all' | 'personal' | 'activity' | 'analytics';
  status: 'pending' | 'processing' | 'ready' | 'expired' | 'failed';
  file_url?: string;
  file_size_bytes?: number;
  created_at: string;
  completed_at?: string;
  expires_at?: string;
}

export interface DataDeletionRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  reason?: string;
  scheduled_at: string;
  completed_at?: string;
  created_at: string;
}

export interface PrivacyStats {
  totalDataRecords: number;
  personalDataRecords: number;
  anonymizedRecords: number;
  sharedDataRecords: number;
  gdprScore: number;
  lastAuditDate?: string;
}

export interface PrivacyAuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export const DEFAULT_PRIVACY_PREFERENCES: Omit<PrivacyPreferences, 'user_id' | 'updated_at'> = {
  cam: false,
  mic: false,
  hr: false,
  gps: false,
  social: false,
  nft: false,
  analytics: true,
  personalization: true,
};

export const PREFERENCE_METADATA: Record<PrivacyPreferenceKey, {
  label: string;
  description: string;
  fallback: string;
  icon: string;
  category: 'sensors' | 'sharing' | 'analytics';
}> = {
  cam: {
    label: 'Caméra',
    description: 'Autoriser l\'accès à votre caméra pour le scan facial et les fonctionnalités AR',
    fallback: 'Mode questionnaire disponible',
    icon: 'Camera',
    category: 'sensors',
  },
  mic: {
    label: 'Microphone',
    description: 'Autoriser l\'accès au microphone pour l\'analyse vocale et les commandes audio',
    fallback: 'Saisie textuelle disponible',
    icon: 'Mic',
    category: 'sensors',
  },
  hr: {
    label: 'Capteur cardiaque',
    description: 'Autoriser la connexion aux capteurs de fréquence cardiaque (Bluetooth, montres)',
    fallback: 'Simulation de données disponible',
    icon: 'Heart',
    category: 'sensors',
  },
  gps: {
    label: 'Géolocalisation',
    description: 'Autoriser l\'accès à votre position pour les recommandations contextuelles',
    fallback: 'Recommandations génériques',
    icon: 'MapPin',
    category: 'sensors',
  },
  social: {
    label: 'Partage social',
    description: 'Autoriser le partage de vos achievements et progrès avec d\'autres utilisateurs',
    fallback: 'Mode privé uniquement',
    icon: 'Users',
    category: 'sharing',
  },
  nft: {
    label: 'NFT & Blockchain',
    description: 'Autoriser les fonctionnalités blockchain et la création de NFT personnalisés',
    fallback: 'Fonctionnalités désactivées',
    icon: 'Coins',
    category: 'sharing',
  },
  analytics: {
    label: 'Données analytiques',
    description: 'Collecter des données anonymisées pour améliorer l\'application',
    fallback: 'Aucune collecte de données',
    icon: 'BarChart',
    category: 'analytics',
  },
  personalization: {
    label: 'Personnalisation',
    description: 'Utiliser vos données pour personnaliser votre expérience',
    fallback: 'Expérience standard',
    icon: 'Sparkles',
    category: 'analytics',
  },
};
