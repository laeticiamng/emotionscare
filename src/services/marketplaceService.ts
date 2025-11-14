/**
 * Marketplace Service - Phase 4.3
 * Gestion complète du marketplace (thèmes, widgets, packs, rituels)
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types
export type MarketplaceItemType = 'theme' | 'widget' | 'sound_pack' | 'ritual' | 'meditation';
export type ItemStatus = 'draft' | 'published' | 'rejected' | 'archived';
export type PurchaseType = 'purchase' | 'free' | 'subscription';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface MarketplaceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  color?: string;
  sort_order: number;
}

export interface MarketplaceItem {
  id: string;
  category_id: string;
  creator_id?: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  thumbnail_url?: string;
  preview_images?: string[];
  type: MarketplaceItemType;
  is_official: boolean;
  is_featured: boolean;
  status: ItemStatus;
  price: number;
  is_premium: boolean;
  free_trial_days: number;
  rating_count: number;
  average_rating: number;
  install_count: number;
  view_count: number;
  download_count: number;
  content?: any;
  tags?: string[];
  version: string;
  license: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface MarketplacePurchase {
  id: string;
  user_id: string;
  item_id: string;
  purchase_type: PurchaseType;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  stripe_payment_intent_id?: string;
  is_installed: boolean;
  expires_at?: string;
  created_at: string;
}

export interface InstalledTheme {
  id: string;
  user_id: string;
  item_id: string;
  is_active: boolean;
  custom_colors?: Record<string, string>;
  custom_config?: Record<string, any>;
  installed_at: string;
  activated_at?: string;
}

export interface MarketplaceReview {
  id: string;
  item_id: string;
  user_id: string;
  rating: number;
  title?: string;
  review_text?: string;
  helpful_count: number;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface SearchFilters {
  type?: MarketplaceItemType;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  onlyFree?: boolean;
  onlyPremium?: boolean;
  onlyOfficial?: boolean;
  search?: string;
  tags?: string[];
  sortBy?: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'trending';
  page?: number;
  limit?: number;
}

class MarketplaceService {
  private readonly PAGE_SIZE = 20;

  /**
   * Récupérer les catégories
   */
  async getCategories(): Promise<MarketplaceCategory[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch categories', error as Error, 'MARKETPLACE');
      return [];
    }
  }

  /**
   * Rechercher des items avec filtres
   */
  async searchItems(filters: SearchFilters = {}): Promise<{
    items: MarketplaceItem[];
    total: number;
    page: number;
  }> {
    try {
      let query = supabase
        .from('marketplace_items')
        .select('*', { count: 'exact' })
        .eq('status', 'published');

      // Filtrer par type
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      // Filtrer par catégorie
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      // Filtrer par prix
      if (filters.onlyFree) {
        query = query.eq('price', 0);
      } else if (filters.onlyPremium) {
        query = query.gt('price', 0);
      } else if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        if (filters.priceMin !== undefined) {
          query = query.gte('price', filters.priceMin);
        }
        if (filters.priceMax !== undefined) {
          query = query.lte('price', filters.priceMax);
        }
      }

      // Filtrer par note
      if (filters.minRating !== undefined) {
        query = query.gte('average_rating', filters.minRating);
      }

      // Filtrer items officiels
      if (filters.onlyOfficial) {
        query = query.eq('is_official', true);
      }

      // Recherche texte
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(
          `name.ilike.${searchTerm},description.ilike.${searchTerm},tags.cs.[${JSON.stringify([filters.search])}]`
        );
      }

      // Tri
      const orderColumn = this.getSortColumn(filters.sortBy);
      const orderDirection =
        filters.sortBy === 'price_asc' ? 'asc' : 'desc';

      query = query.order(orderColumn, {
        ascending: orderDirection === 'asc',
      });

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || this.PAGE_SIZE;
      const start = (page - 1) * limit;

      query = query.range(start, start + limit - 1);

      const { data, count, error } = await query;

      if (error) throw error;

      logger.info('Items searched', { count, filters }, 'MARKETPLACE');

      return {
        items: (data || []) as MarketplaceItem[],
        total: count || 0,
        page,
      };
    } catch (error) {
      logger.error('Failed to search items', error as Error, 'MARKETPLACE');
      return { items: [], total: 0, page: 1 };
    }
  }

  /**
   * Récupérer un item par ID
   */
  async getItemById(itemId: string): Promise<MarketplaceItem | null> {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) throw error;

      // Incrémenter le compteur de vues
      await supabase
        .from('marketplace_items')
        .update({ view_count: (data?.view_count || 0) + 1 })
        .eq('id', itemId);

      return data as MarketplaceItem;
    } catch (error) {
      logger.error('Failed to fetch item', error as Error, 'MARKETPLACE');
      return null;
    }
  }

  /**
   * Récupérer les items featured
   */
  async getFeaturedItems(limit: number = 6): Promise<MarketplaceItem[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as MarketplaceItem[];
    } catch (error) {
      logger.error('Failed to fetch featured items', error as Error, 'MARKETPLACE');
      return [];
    }
  }

  /**
   * Récupérer les items trending
   */
  async getTrendingItems(limit: number = 10): Promise<MarketplaceItem[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'published')
        .order('install_count', { ascending: false })
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as MarketplaceItem[];
    } catch (error) {
      logger.error('Failed to fetch trending items', error as Error, 'MARKETPLACE');
      return [];
    }
  }

  /**
   * Créer un nouvel item (pour les créateurs)
   */
  async createItem(
    userId: string,
    item: Omit<MarketplaceItem, 'id' | 'created_at' | 'updated_at'>
  ): Promise<MarketplaceItem | null> {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .insert({
          ...item,
          creator_id: userId,
          status: 'draft', // Les nouveaux items commencent en draft
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`Item created by user ${userId}`, { itemId: data.id }, 'MARKETPLACE');

      return data as MarketplaceItem;
    } catch (error) {
      logger.error('Failed to create item', error as Error, 'MARKETPLACE');
      return null;
    }
  }

  /**
   * Mettre à jour un item
   */
  async updateItem(
    itemId: string,
    userId: string,
    updates: Partial<MarketplaceItem>
  ): Promise<MarketplaceItem | null> {
    try {
      // Vérifier l'ownership
      const item = await this.getItemById(itemId);
      if (!item || item.creator_id !== userId) {
        throw new Error('Not authorized to update this item');
      }

      const { data, error } = await supabase
        .from('marketplace_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Item updated: ${itemId}`, {}, 'MARKETPLACE');

      return data as MarketplaceItem;
    } catch (error) {
      logger.error('Failed to update item', error as Error, 'MARKETPLACE');
      return null;
    }
  }

  /**
   * Publier un item (passer de draft à published)
   */
  async publishItem(itemId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .eq('creator_id', userId);

      if (error) throw error;

      logger.info(`Item published: ${itemId}`, {}, 'MARKETPLACE');

      return true;
    } catch (error) {
      logger.error('Failed to publish item', error as Error, 'MARKETPLACE');
      return false;
    }
  }

  /**
   * Installer un thème/widget
   */
  async installItem(
    userId: string,
    itemId: string,
    customColors?: Record<string, string>
  ): Promise<InstalledTheme | null> {
    try {
      // Vérifier que l'utilisateur a accès (achat ou gratuit)
      const item = await this.getItemById(itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      if (item.price > 0) {
        const hasPurchased = await this.hasPurchased(userId, itemId);
        if (!hasPurchased) {
          throw new Error('Item not purchased or not free');
        }
      }

      // Créer/mettre à jour l'installation
      const { data, error } = await supabase
        .from('installed_themes')
        .upsert({
          user_id: userId,
          item_id: itemId,
          is_active: false,
          custom_colors: customColors,
          installed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Incrémenter le compteur d'installations
      await supabase
        .from('marketplace_items')
        .update({ install_count: (item.install_count || 0) + 1 })
        .eq('id', itemId);

      logger.info(`Item installed: ${itemId}`, { userId }, 'MARKETPLACE');

      return data as InstalledTheme;
    } catch (error) {
      logger.error('Failed to install item', error as Error, 'MARKETPLACE');
      return null;
    }
  }

  /**
   * Activer un thème
   */
  async activateTheme(
    userId: string,
    installedThemeId: string
  ): Promise<boolean> {
    try {
      // Désactiver tous les thèmes de cet utilisateur
      await supabase
        .from('installed_themes')
        .update({ is_active: false, activated_at: null })
        .eq('user_id', userId);

      // Activer le thème sélectionné
      const { error } = await supabase
        .from('installed_themes')
        .update({
          is_active: true,
          activated_at: new Date().toISOString(),
          last_used_at: new Date().toISOString(),
        })
        .eq('id', installedThemeId)
        .eq('user_id', userId);

      if (error) throw error;

      logger.info(`Theme activated: ${installedThemeId}`, { userId }, 'MARKETPLACE');

      return true;
    } catch (error) {
      logger.error('Failed to activate theme', error as Error, 'MARKETPLACE');
      return false;
    }
  }

  /**
   * Récupérer les thèmes installés par l'utilisateur
   */
  async getUserInstalledThemes(userId: string): Promise<{
    installed: InstalledTheme[];
    items: MarketplaceItem[];
    activeTheme?: { installed: InstalledTheme; item: MarketplaceItem };
  }> {
    try {
      const { data, error } = await supabase
        .from('installed_themes')
        .select('*')
        .eq('user_id', userId)
        .order('installed_at', { ascending: false });

      if (error) throw error;

      const installed = (data || []) as InstalledTheme[];

      // Récupérer les items correspondants
      const itemIds = installed.map((t) => t.item_id);
      const { data: items, error: itemsError } = await supabase
        .from('marketplace_items')
        .select('*')
        .in('id', itemIds);

      if (itemsError) throw itemsError;

      const itemsMap = (items || []).reduce(
        (acc, item: any) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<string, MarketplaceItem>
      );

      const activeTheme = installed.find((t) => t.is_active);

      return {
        installed,
        items: Object.values(itemsMap),
        activeTheme: activeTheme
          ? {
              installed: activeTheme,
              item: itemsMap[activeTheme.item_id],
            }
          : undefined,
      };
    } catch (error) {
      logger.error('Failed to fetch user installed themes', error as Error, 'MARKETPLACE');
      return { installed: [], items: [] };
    }
  }

  /**
   * Ajouter un avis
   */
  async addReview(
    userId: string,
    itemId: string,
    rating: number,
    title: string,
    review_text: string
  ): Promise<MarketplaceReview | null> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Vérifier que l'utilisateur a acheté
      const hasPurchased = await this.hasPurchased(userId, itemId);

      const { data, error } = await supabase
        .from('marketplace_reviews')
        .upsert({
          item_id: itemId,
          user_id: userId,
          rating,
          title,
          review_text,
          is_verified_purchase: hasPurchased,
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(
        `Review added for item ${itemId}`,
        { rating, userId },
        'MARKETPLACE'
      );

      return data as MarketplaceReview;
    } catch (error) {
      logger.error('Failed to add review', error as Error, 'MARKETPLACE');
      return null;
    }
  }

  /**
   * Récupérer les avis pour un item
   */
  async getItemReviews(itemId: string): Promise<MarketplaceReview[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_reviews')
        .select('*')
        .eq('item_id', itemId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as MarketplaceReview[];
    } catch (error) {
      logger.error('Failed to fetch reviews', error as Error, 'MARKETPLACE');
      return [];
    }
  }

  /**
   * Vérifier si l'utilisateur a acheté l'item
   */
  private async hasPurchased(userId: string, itemId: string): Promise<boolean> {
    try {
      // Vérifier s'il y a un achat complété
      const { data, error } = await supabase
        .from('user_marketplace_purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .eq('payment_status', 'completed')
        .limit(1)
        .single();

      if (error && error.code === 'PGRST116') {
        // Pas de résultat
        return false;
      }

      if (error) throw error;

      return !!data;
    } catch (error) {
      logger.error('Failed to check purchase', error as Error, 'MARKETPLACE');
      return false;
    }
  }

  /**
   * Enregistrer un achat
   */
  async recordPurchase(
    userId: string,
    itemId: string,
    amount: number,
    paymentIntentId?: string
  ): Promise<MarketplacePurchase | null> {
    try {
      const { data, error } = await supabase
        .from('user_marketplace_purchases')
        .insert({
          user_id: userId,
          item_id: itemId,
          purchase_type: amount > 0 ? 'purchase' : 'free',
          amount,
          payment_status: 'completed',
          stripe_payment_intent_id: paymentIntentId,
          is_installed: false,
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(
        `Purchase recorded for item ${itemId}`,
        { userId, amount },
        'MARKETPLACE'
      );

      return data as MarketplacePurchase;
    } catch (error) {
      logger.error('Failed to record purchase', error as Error, 'MARKETPLACE');
      return null;
    }
  }

  /**
   * Obtenir le colonne de tri
   */
  private getSortColumn(sortBy?: string): string {
    switch (sortBy) {
      case 'popular':
        return 'install_count';
      case 'rating':
        return 'average_rating';
      case 'price_asc':
      case 'price_desc':
        return 'price';
      case 'trending':
        return 'download_count';
      case 'newest':
      default:
        return 'created_at';
    }
  }

  /**
   * Récupérer les items d'un créateur
   */
  async getCreatorItems(creatorId: string): Promise<MarketplaceItem[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as MarketplaceItem[];
    } catch (error) {
      logger.error('Failed to fetch creator items', error as Error, 'MARKETPLACE');
      return [];
    }
  }

  /**
   * Récupérer l'historique d'achat de l'utilisateur
   */
  async getUserPurchases(userId: string): Promise<MarketplacePurchase[]> {
    try {
      const { data, error } = await supabase
        .from('user_marketplace_purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as MarketplacePurchase[];
    } catch (error) {
      logger.error('Failed to fetch user purchases', error as Error, 'MARKETPLACE');
      return [];
    }
  }
}

export const marketplaceService = new MarketplaceService();
