
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = import.meta.env.MODE === 'development' 
  ? 'http://localhost:3009' 
  : 'https://api.emotionscare.com';

export class ApiService {
  /**
   * Test de connectivité avec les services backend
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  }

  /**
   * Appel générique aux microservices
   */
  static async callService(service: string, endpoint: string, data?: any): Promise<any> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${API_BASE_URL}/${service}${endpoint}`, {
        method: data ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : '',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Service ${service} error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${service}${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Services spécifiques
   */
  static async getJournalFeed(userId: string) {
    return this.callService('journal', `/feed/${userId}`);
  }

  static async postJournalText(data: { userId: string; text: string }) {
    return this.callService('journal', '/text', data);
  }

  static async getBreathWeekly(userId: string) {
    return this.callService('breath', `/weekly/${userId}`);
  }

  static async getPrivacyPrefs(userId: string) {
    return this.callService('privacy', `/prefs/${userId}`);
  }

  static async updatePrivacyPrefs(userId: string, prefs: any) {
    return this.callService('privacy', `/prefs/${userId}`, prefs);
  }

  static async exportUserData(userId: string) {
    return this.callService('account', `/user/export`, { userId });
  }
}
