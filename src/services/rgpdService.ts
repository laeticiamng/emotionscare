/**
 * Service RGPD - Export et suppression des données personnelles via Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeData?: string[];
}

export interface ExportResult {
  success: boolean;
  jobId?: string;
  downloadUrl?: string;
  expiresAt?: string;
  error?: string;
  data?: Record<string, unknown>;
}

export interface DeletionOptions {
  confirmationCode: string;
  softDelete?: boolean;
}

export interface DeletionResult {
  success: boolean;
  scheduledFor?: string;
  error?: string;
}

class RGPDService {
  /**
   * Collecter toutes les données utilisateur depuis Supabase
   */
  private async collectUserData(userId: string): Promise<Record<string, unknown>> {
    const tables = [
      'profiles',
      'mood_entries',
      'journal_entries',
      'activity_sessions',
      'user_preferences',
      'user_achievements',
      'chat_conversations',
    ];

    const userData: Record<string, unknown> = {};

    for (const table of tables) {
      try {
        const { data } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', userId);
        
        if (data && data.length > 0) {
          userData[table] = data;
        }
      } catch {
        // Table might not exist, continue
      }
    }

    return userData;
  }

  /**
   * Démarrer un export de données RGPD
   */
  async requestDataExport(options: ExportOptions = { format: 'json' }): Promise<ExportResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Collecter les données
      const userData = await this.collectUserData(user.id);

      // Générer le fichier selon le format
      let downloadData: string;
      let mimeType: string;
      let extension: string;

      switch (options.format) {
        case 'csv':
          downloadData = this.convertToCSV(userData);
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'pdf':
          // Pour PDF, on retourne du JSON formaté (PDF nécessiterait une lib externe)
          downloadData = JSON.stringify(userData, null, 2);
          mimeType = 'application/json';
          extension = 'json';
          break;
        default:
          downloadData = JSON.stringify(userData, null, 2);
          mimeType = 'application/json';
          extension = 'json';
      }

      // Créer un blob et retourner l'URL
      const blob = new Blob([downloadData], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);

      // Log l'export
      await supabase.from('admin_changelog').insert({
        action_type: 'RGPD_EXPORT',
        table_name: 'user_data',
        record_id: user.id,
        admin_user_id: user.id,
        metadata: { format: options.format },
      });

      return {
        success: true,
        jobId: crypto.randomUUID(),
        downloadUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        data: userData,
      };
    } catch (error) {
      logger.error('RGPD export failed', error as Error, 'GDPR');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  /**
   * Convertir les données en CSV
   */
  private convertToCSV(data: Record<string, unknown>): string {
    let csv = '';
    
    for (const [tableName, rows] of Object.entries(data)) {
      if (!Array.isArray(rows) || rows.length === 0) continue;
      
      csv += `\n=== ${tableName} ===\n`;
      
      // Headers
      const headers = Object.keys(rows[0] as Record<string, unknown>);
      csv += headers.join(',') + '\n';
      
      // Rows
      for (const row of rows) {
        const values = headers.map(h => {
          const val = (row as Record<string, unknown>)[h];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return JSON.stringify(val).replace(/,/g, ';');
          return String(val).replace(/,/g, ';');
        });
        csv += values.join(',') + '\n';
      }
    }
    
    return csv;
  }

  /**
   * Vérifier le statut d'un job d'export
   */
  async checkExportStatus(jobId: string): Promise<ExportResult> {
    // Comme l'export est synchrone, on retourne juste le succès
    return {
      success: true,
      jobId,
    };
  }

  /**
   * Demander la suppression du compte (soft delete 30j)
   */
  async requestAccountDeletion(options: DeletionOptions): Promise<DeletionResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Vérifier le code de confirmation
      if (options.confirmationCode !== 'DELETE_MY_ACCOUNT') {
        return { success: false, error: 'Invalid confirmation code' };
      }

      const scheduledDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Marquer le compte pour suppression
      const { error } = await supabase
        .from('profiles')
        .update({
          deletion_scheduled_at: scheduledDate.toISOString(),
          is_active: false,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Log l'action
      await supabase.from('admin_changelog').insert({
        action_type: 'ACCOUNT_DELETION_REQUESTED',
        table_name: 'profiles',
        record_id: user.id,
        admin_user_id: user.id,
        metadata: { 
          soft_delete: options.softDelete,
          scheduled_for: scheduledDate.toISOString(),
        },
      });

      return {
        success: true,
        scheduledFor: scheduledDate.toISOString()
      };
    } catch (error) {
      logger.error('Account deletion request failed', error as Error, 'GDPR');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deletion request failed'
      };
    }
  }

  /**
   * Annuler une suppression de compte (undelete)
   */
  async cancelAccountDeletion(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          deletion_scheduled_at: null,
          is_active: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Log l'action
      await supabase.from('admin_changelog').insert({
        action_type: 'ACCOUNT_DELETION_CANCELLED',
        table_name: 'profiles',
        record_id: user.id,
        admin_user_id: user.id,
      });

      return { success: true };
    } catch (error) {
      logger.error('Account deletion cancellation failed', error as Error, 'GDPR');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Undelete failed'
      };
    }
  }

  /**
   * Vérifier le statut du compte (en cours de suppression ?)
   */
  async getAccountStatus(): Promise<{
    status: 'active' | 'pending_deletion' | 'deleted';
    scheduledDeletion?: string;
    canUndelete?: boolean;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { status: 'active' };
      }

      const { data } = await supabase
        .from('profiles')
        .select('deletion_scheduled_at, is_active')
        .eq('id', user.id)
        .single();

      if (!data) {
        return { status: 'active' };
      }

      if (data.deletion_scheduled_at) {
        return {
          status: 'pending_deletion',
          scheduledDeletion: data.deletion_scheduled_at,
          canUndelete: true,
        };
      }

      return { status: data.is_active ? 'active' : 'deleted' };
    } catch (error) {
      logger.error('Account status check failed', error as Error, 'GDPR');
      return { status: 'active' };
    }
  }
}

export const rgpdService = new RGPDService();
