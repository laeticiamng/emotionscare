import { z } from 'zod';

// ============================================================================
// SCHEMAS ZOD - Achievements Module
// ============================================================================

/**
 * Rareté d'un achievement
 */
export const AchievementRarity = z.enum(['common', 'rare', 'epic', 'legendary']);
export type AchievementRarity = z.infer<typeof AchievementRarity>;

/**
 * Catégorie d'achievement
 */
export const AchievementCategory = z.enum([
  'wellbeing',
  'social',
  'learning',
  'creativity',
  'progress',
  'milestone',
  'special',
]);
export type AchievementCategory = z.infer<typeof AchievementCategory>;

/**
 * Type de condition pour débloquer un achievement
 */
export const ConditionType = z.enum([
  'session_count',
  'streak_days',
  'total_duration',
  'score_threshold',
  'module_completion',
  'social_interaction',
  'custom',
]);
export type ConditionType = z.infer<typeof ConditionType>;

/**
 * Condition individuelle pour débloquer un achievement
 */
export const AchievementCondition = z.object({
  type: ConditionType,
  value: z.number().min(0),
  metadata: z.record(z.unknown()).optional(),
});
export type AchievementCondition = z.infer<typeof AchievementCondition>;

/**
 * Type de récompense
 */
export const RewardType = z.enum(['xp', 'badge', 'unlock', 'cosmetic']);
export type RewardType = z.infer<typeof RewardType>;

/**
 * Récompense associée à un achievement
 */
export const AchievementReward = z.object({
  type: RewardType,
  value: z.union([z.string(), z.number()]),
  metadata: z.record(z.unknown()).optional(),
});
export type AchievementReward = z.infer<typeof AchievementReward>;

/**
 * Achievement complet (table achievements)
 */
export const Achievement = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: AchievementCategory,
  rarity: AchievementRarity,
  icon: z.string().optional(),
  conditions: z.array(AchievementCondition).min(1),
  rewards: z.record(RewardType, z.unknown()),
  is_hidden: z.boolean().default(false),
  created_at: z.string().datetime(),
});
export type Achievement = z.infer<typeof Achievement>;

/**
 * Progression de l'utilisateur vers un achievement
 */
export const UserAchievementProgress = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  achievement_id: z.string().uuid(),
  progress: z.number().min(0).max(100),
  current_value: z.number().min(0),
  target_value: z.number().min(1),
  unlocked: z.boolean().default(false),
  unlocked_at: z.string().datetime().optional(),
  notified: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type UserAchievementProgress = z.infer<typeof UserAchievementProgress>;

/**
 * Badge débloqué par l'utilisateur
 */
export const UserBadge = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  image_url: z.string().url().optional(),
  awarded_at: z.string().datetime(),
});
export type UserBadge = z.infer<typeof UserBadge>;

/**
 * Statistiques globales d'achievements
 */
export const AchievementStats = z.object({
  total_achievements: z.number().int().min(0),
  unlocked_achievements: z.number().int().min(0),
  unlock_percentage: z.number().min(0).max(100),
  common_count: z.number().int().min(0),
  rare_count: z.number().int().min(0),
  epic_count: z.number().int().min(0),
  legendary_count: z.number().int().min(0),
  total_xp_earned: z.number().int().min(0),
  recent_unlocks: z.array(UserAchievementProgress).max(10),
});
export type AchievementStats = z.infer<typeof AchievementStats>;

/**
 * Payload pour créer un nouvel achievement (admin)
 */
export const CreateAchievement = Achievement.omit({
  id: true,
  created_at: true,
});
export type CreateAchievement = z.infer<typeof CreateAchievement>;

/**
 * Payload pour mettre à jour un achievement (admin)
 */
export const UpdateAchievement = Achievement.partial().required({ id: true });
export type UpdateAchievement = z.infer<typeof UpdateAchievement>;

/**
 * Payload pour enregistrer une progression
 */
export const RecordProgress = z.object({
  achievement_id: z.string().uuid(),
  increment: z.number().min(0).default(1),
  metadata: z.record(z.unknown()).optional(),
});
export type RecordProgress = z.infer<typeof RecordProgress>;
