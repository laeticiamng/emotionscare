/**
 * Types pour le module Discovery - Exploration émotionnelle
 * @module discovery
 */

/**
 * Catégorie de découverte
 */
export type DiscoveryCategory = 
  | 'emotion' 
  | 'activity' 
  | 'technique' 
  | 'insight' 
  | 'challenge' 
  | 'ressource';

/**
 * Niveau de difficulté
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Statut d'une découverte
 */
export type DiscoveryStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';

/**
 * Élément de découverte
 */
export interface DiscoveryItem {
  id: string;
  title: string;
  description: string;
  category: DiscoveryCategory;
  difficulty: DifficultyLevel;
  status: DiscoveryStatus;
  icon: string;
  color: string;
  estimatedMinutes: number;
  xpReward: number;
  prerequisites?: string[];
  tags: string[];
  completedAt?: string;
  progress: number; // 0-100
}

/**
 * Chemin de découverte (parcours guidé)
 */
export interface DiscoveryPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  items: DiscoveryItem[];
  totalXp: number;
  completedItems: number;
  isUnlocked: boolean;
  estimatedHours: number;
}

/**
 * Statistiques de découverte
 */
export interface DiscoveryStats {
  totalDiscoveries: number;
  completedDiscoveries: number;
  inProgressDiscoveries: number;
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: DiscoveryCategory | null;
  timeSpentMinutes: number;
  achievements: DiscoveryAchievement[];
  weeklyProgress: {
    day: string;
    count: number;
    xp: number;
  }[];
}

/**
 * Achievement de découverte
 */
export interface DiscoveryAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress: number;
  target: number;
}

/**
 * Recommandation personnalisée
 */
export interface DiscoveryRecommendation {
  item: DiscoveryItem;
  reason: string;
  matchScore: number;
  basedOn: 'mood' | 'history' | 'goals' | 'time' | 'trending';
}

/**
 * Filtres de découverte
 */
export interface DiscoveryFilters {
  category?: DiscoveryCategory[];
  difficulty?: DifficultyLevel[];
  status?: DiscoveryStatus[];
  minDuration?: number;
  maxDuration?: number;
  tags?: string[];
  searchQuery?: string;
}

/**
 * Paramètres utilisateur pour Discovery
 */
export interface DiscoverySettings {
  dailyGoal: number;
  preferredCategories: DiscoveryCategory[];
  preferredDifficulty: DifficultyLevel;
  notificationsEnabled: boolean;
  reminderTime?: string;
  showCompleted: boolean;
  autoAdvance: boolean;
}

/**
 * Session de découverte
 */
export interface DiscoverySession {
  id: string;
  itemId: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  xpEarned: number;
  notes?: string;
  rating?: number;
  moodBefore?: number;
  moodAfter?: number;
}

/**
 * État global du module Discovery
 */
export interface DiscoveryState {
  items: DiscoveryItem[];
  paths: DiscoveryPath[];
  stats: DiscoveryStats;
  recommendations: DiscoveryRecommendation[];
  currentSession: DiscoverySession | null;
  settings: DiscoverySettings;
  filters: DiscoveryFilters;
  isLoading: boolean;
  error: string | null;
}
