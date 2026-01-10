import { create } from 'zustand';
import { logger } from '@/lib/logger';
import { rgpdService } from '@/services/rgpdService';

export type ExportStatus = 'idle' | 'processing' | 'ready' | 'error';

export interface ExportJob {
  job_id: string;
  status: ExportStatus;
  download_url?: string;
  expires_at?: string;
  size_mb?: number;
  error_message?: string;
}

interface RGPDState {
  job: ExportJob | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setJob: (job: ExportJob | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  startExport: (format?: 'json' | 'csv' | 'pdf') => Promise<boolean>;
  pollStatus: (jobId: string) => Promise<void>;
  cancelJob: () => void;
  reset: () => void;
}

export const useRGPDStore = create<RGPDState>((set, get) => ({
  job: null,
  loading: false,
  error: null,
  
  setJob: (job) => set({ job }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  startExport: async (format = 'json') => {
    set({ loading: true, error: null });
    
    try {
      const result = await rgpdService.requestDataExport({ format });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to start export job');
      }
      
      set({ 
        job: {
          job_id: result.jobId || crypto.randomUUID(),
          status: 'ready',
          download_url: result.downloadUrl,
          expires_at: result.expiresAt,
        },
        loading: false 
      });
      
      // Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'rgpd_export_requested', { format });
      }
      
      return true;
    } catch (error) {
      logger.error('RGPD export failed', error as Error, 'GDPR');
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur de démarrage'
      });
      return false;
    }
  },

  pollStatus: async (jobId: string) => {
    try {
      const result = await rgpdService.checkExportStatus(jobId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get export status');
      }
      
      const currentJob = get().job;
      
      if (currentJob && currentJob.job_id === jobId) {
        set({ 
          job: { 
            ...currentJob, 
            status: 'ready',
            download_url: result.downloadUrl,
          }
        });
        
        // Analytics for completion
        if (currentJob.status !== 'ready') {
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'rgpd_export_ready');
          }
        }
      }
    } catch (error) {
      logger.error('RGPD status check failed', error as Error, 'GDPR');
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de statut'
      });
    }
  },

  cancelJob: () => {
    const currentJob = get().job;
    if (currentJob?.download_url) {
      // Revoke the blob URL if it exists
      try {
        URL.revokeObjectURL(currentJob.download_url);
      } catch {
        // Silent fail
      }
    }
    
    set({ job: null, loading: false, error: null });
  },

  reset: () => set({ job: null, loading: false, error: null }),
}));
