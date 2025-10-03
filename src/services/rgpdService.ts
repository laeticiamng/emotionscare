/**
 * Service RGPD - Export et suppression des données personnelles
 */

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
   * Démarrer un export de données RGPD
   */
  async requestDataExport(options: ExportOptions = { format: 'json' }): Promise<ExportResult> {
    try {
      const response = await fetch('/api/me/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        jobId: data.job_id,
        downloadUrl: data.download_url,
        expiresAt: data.expires_at
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  /**
   * Vérifier le statut d'un job d'export
   */
  async checkExportStatus(jobId: string): Promise<ExportResult> {
    try {
      const response = await fetch(`/api/me/export/${jobId}`);
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        jobId: data.job_id,
        downloadUrl: data.download_url,
        expiresAt: data.expires_at
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed'
      };
    }
  }

  /**
   * Demander la suppression du compte (soft delete 30j)
   */
  async requestAccountDeletion(options: DeletionOptions): Promise<DeletionResult> {
    try {
      const response = await fetch('/api/me/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmation_code: options.confirmationCode,
          soft_delete: options.softDelete ?? true
        })
      });

      if (!response.ok) {
        throw new Error(`Deletion request failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        scheduledFor: data.scheduled_for
      };
    } catch (error) {
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
      const response = await fetch('/api/me/undelete', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Undelete failed: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
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
      const response = await fetch('/api/me/account/status');
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Account status check failed:', error);
      return { status: 'active' };
    }
  }
}

export const rgpdService = new RGPDService();