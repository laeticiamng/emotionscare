/**
 * API Service pour le Marketplace
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  Program, 
  Creator, 
  MarketplaceFilters, 
  CreatorStats, 
  Purchase,
  ProgramReview,
  PayoutRecord,
  ProgramCategory
} from '../types';

class MarketplaceApi {
  // ==================== PUBLIC BROWSING ====================

  async getPrograms(filters: MarketplaceFilters): Promise<Program[]> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'list_programs', filters }
    });

    if (error) throw new Error(error.message);
    return data?.programs || [];
  }

  async getFeaturedPrograms(): Promise<Program[]> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'featured_programs' }
    });

    if (error) throw new Error(error.message);
    return data?.programs || [];
  }

  async getProgram(programId: string): Promise<Program | null> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_program', programId }
    });

    if (error) throw new Error(error.message);
    return data?.program || null;
  }

  async getCategories(): Promise<{ category: ProgramCategory; count: number; label: string }[]> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_categories' }
    });

    if (error) throw new Error(error.message);
    return data?.categories || [];
  }

  async getProgramReviews(programId: string): Promise<ProgramReview[]> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_reviews', programId }
    });

    if (error) throw new Error(error.message);
    return data?.reviews || [];
  }

  // ==================== PURCHASING ====================

  async purchaseProgram(programId: string): Promise<{ checkoutUrl: string }> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'create_checkout', programId }
    });

    if (error) throw new Error(error.message);
    return data;
  }

  async getUserPurchases(): Promise<Purchase[]> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_purchases' }
    });

    if (error) throw new Error(error.message);
    return data?.purchases || [];
  }

  async completeModule(purchaseId: string, moduleId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'complete_module', purchaseId, moduleId }
    });

    if (error) throw new Error(error.message);
  }

  async submitReview(programId: string, rating: number, comment: string): Promise<void> {
    const { error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'submit_review', programId, rating, comment }
    });

    if (error) throw new Error(error.message);
  }

  // ==================== CREATOR DASHBOARD ====================

  async getCreatorProfile(): Promise<Creator | null> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_creator_profile' }
    });

    if (error) throw new Error(error.message);
    return data?.creator || null;
  }

  async getCreatorStats(): Promise<CreatorStats> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_creator_stats' }
    });

    if (error) throw new Error(error.message);
    return data?.stats || {
      total_programs: 0,
      published_programs: 0,
      total_sales: 0,
      total_revenue: 0,
      pending_payout: 0,
      this_month_sales: 0,
      this_month_revenue: 0,
      average_rating: 0,
      total_reviews: 0
    };
  }

  async getCreatorPrograms(): Promise<Program[]> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_creator_programs' }
    });

    if (error) throw new Error(error.message);
    return data?.programs || [];
  }

  async createProgram(program: Partial<Program>): Promise<Program> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'create_program', program }
    });

    if (error) throw new Error(error.message);
    return data?.program;
  }

  async updateProgram(programId: string, updates: Partial<Program>): Promise<Program> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'update_program', programId, updates }
    });

    if (error) throw new Error(error.message);
    return data?.program;
  }

  async submitForReview(programId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'submit_for_review', programId }
    });

    if (error) throw new Error(error.message);
  }

  async getPayoutHistory(): Promise<PayoutRecord[]> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'get_payouts' }
    });

    if (error) throw new Error(error.message);
    return data?.payouts || [];
  }

  async requestPayout(): Promise<void> {
    const { error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'request_payout' }
    });

    if (error) throw new Error(error.message);
  }

  // ==================== CREATOR ONBOARDING ====================

  async applyAsCreator(application: {
    display_name: string;
    bio: string;
    credentials: Array<{
      type: 'diploma' | 'certification' | 'license';
      title: string;
      institution: string;
      year: number;
    }>;
  }): Promise<Creator> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'apply_as_creator', ...application }
    });

    if (error) throw new Error(error.message);
    return data?.creator;
  }

  async connectStripeAccount(): Promise<{ onboardingUrl: string }> {
    const { data, error } = await supabase.functions.invoke('marketplace-api', {
      body: { action: 'connect_stripe' }
    });

    if (error) throw new Error(error.message);
    return data;
  }
}

export const marketplaceApi = new MarketplaceApi();
