/**
 * Types pour le module Marketplace Créateurs
 */

export type ContentFormat = 'audio' | 'video' | 'pdf' | 'program';
export type CreatorStatus = 'pending' | 'verified' | 'suspended';
export type ProgramStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export interface Creator {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  credentials: CreatorCredential[];
  status: CreatorStatus;
  verified_at?: string;
  stripe_account_id?: string;
  commission_rate: number; // Default 20%
  total_sales: number;
  total_earnings: number;
  rating: number;
  review_count: number;
  badges: CreatorBadge[];
  created_at: string;
  updated_at: string;
}

export interface CreatorCredential {
  type: 'diploma' | 'certification' | 'license';
  title: string;
  institution: string;
  year: number;
  verified: boolean;
  document_url?: string;
}

export interface CreatorBadge {
  type: 'bestseller' | 'recommended' | 'top_rated' | 'verified_expert';
  earned_at: string;
}

export interface Program {
  id: string;
  creator_id: string;
  creator?: Creator;
  title: string;
  description: string;
  short_description: string;
  cover_image_url: string;
  preview_url?: string;
  format: ContentFormat;
  category: ProgramCategory;
  tags: string[];
  duration_minutes: number;
  price_cents: number;
  currency: string;
  status: ProgramStatus;
  is_featured: boolean;
  modules: ProgramModule[];
  total_purchases: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export type ProgramCategory = 
  | 'stress_management'
  | 'anxiety_relief'
  | 'sleep_improvement'
  | 'emotional_regulation'
  | 'burnout_prevention'
  | 'mindfulness'
  | 'breathing_techniques'
  | 'resilience_building';

export interface ProgramModule {
  id: string;
  title: string;
  description: string;
  order: number;
  content_type: ContentFormat;
  content_url: string;
  duration_minutes: number;
  is_preview: boolean;
}

export interface ProgramReview {
  id: string;
  program_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  program_id: string;
  program?: Program;
  amount_cents: number;
  currency: string;
  stripe_payment_id: string;
  status: 'pending' | 'completed' | 'refunded';
  purchased_at: string;
  progress_percent: number;
  completed_modules: string[];
}

export interface MarketplaceFilters {
  category?: ProgramCategory;
  format?: ContentFormat;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  searchQuery?: string;
}

export interface CreatorStats {
  total_programs: number;
  published_programs: number;
  total_sales: number;
  total_revenue: number;
  pending_payout: number;
  this_month_sales: number;
  this_month_revenue: number;
  average_rating: number;
  total_reviews: number;
}

export interface PayoutRecord {
  id: string;
  creator_id: string;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stripe_transfer_id?: string;
  created_at: string;
  completed_at?: string;
}
