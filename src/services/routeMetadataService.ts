// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface RouteMetadata {
  id?: string;
  route_path: string;
  page_name: string;
  category: string;
  completion_percentage: number;
  features: string[];
  components_used?: string[];
  last_updated?: string;
  created_at?: string;
}

export const routeMetadataService = {
  async getAllRoutes(): Promise<RouteMetadata[]> {
    const { data, error } = await supabase
      .from('route_metadata')
      .select('*')
      .order('route_path');
    
    if (error) {
      logger.error('Error fetching route metadata', error as Error, 'SYSTEM');
      return [];
    }
    
    return data || [];
  },

  async getRouteByPath(path: string): Promise<RouteMetadata | null> {
    const { data, error } = await supabase
      .from('route_metadata')
      .select('*')
      .eq('route_path', path)
      .single();
    
    if (error) {
      logger.error('Error fetching route', error as Error, 'SYSTEM');
      return null;
    }
    
    return data;
  },

  async updateRouteCompletion(path: string, percentage: number, features: string[] = []): Promise<boolean> {
    const { error } = await supabase
      .from('route_metadata')
      .update({ 
        completion_percentage: percentage, 
        features,
        last_updated: new Date().toISOString()
      })
      .eq('route_path', path);
    
    if (error) {
      logger.error('Error updating route completion', error as Error, 'SYSTEM');
      return false;
    }
    
    return true;
  },

  async trackPageAnalytics(routePath: string, sessionDuration: number, interactions: number): Promise<void> {
    const { error } = await supabase
      .from('page_analytics')
      .insert({
        route_path: routePath,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        session_duration: sessionDuration,
        interactions_count: interactions
      });
    
    if (error) {
      logger.error('Error tracking page analytics', error as Error, 'ANALYTICS');
    }
  },

  async getCompletionStats(): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  }> {
    const routes = await this.getAllRoutes();
    
    return {
      total: routes.length,
      completed: routes.filter(r => r.completion_percentage === 100).length,
      inProgress: routes.filter(r => r.completion_percentage > 0 && r.completion_percentage < 100).length,
      notStarted: routes.filter(r => r.completion_percentage === 0).length
    };
  }
};
