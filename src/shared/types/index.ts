/**
 * Shared Types - Types TypeScript génériques réutilisables
 */

// ===== API TYPES =====
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ===== ENTITY TYPES =====
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface UserOwnedEntity extends BaseEntity {
  user_id: string;
}

// ===== FORM TYPES =====
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// ===== UI TYPES =====
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
export type Status = 'idle' | 'loading' | 'success' | 'error' | 'warning';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// ===== ASYNC TYPES =====
export type AsyncState<T> = 
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

// ===== COMPONENT PROPS =====
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithLoadingProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface WithErrorProps {
  error?: Error | string | null;
  onRetry?: () => void;
}

// ===== EMOTION TYPES (Domain-specific but shared) =====
export type EmotionType = 
  | 'joy' | 'sadness' | 'anger' | 'fear' 
  | 'surprise' | 'disgust' | 'trust' | 'anticipation'
  | 'neutral' | 'calm' | 'anxious' | 'excited';

export interface EmotionScore {
  emotion: EmotionType;
  score: number;
  confidence: number;
}

// ===== GAMIFICATION TYPES =====
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'streak' | 'milestone' | 'social' | 'exploration' | 'mastery';

export interface XPReward {
  amount: number;
  source: string;
  multiplier?: number;
}

// ===== USER TYPES =====
export type UserRole = 'user' | 'premium' | 'admin' | 'b2b_user' | 'b2b_admin';
export type UserMode = 'b2c' | 'b2b_user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  role: UserRole;
  mode: UserMode;
  created_at: string;
}
