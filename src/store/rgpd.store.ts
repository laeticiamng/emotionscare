import { create } from 'zustand';
import { logger } from '@/lib/logger';

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
  startExport: () => Promise<boolean>;
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
  
  startExport: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/me/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to start export job');
      }
      
      const data = await response.json();
      set({ 
        job: {
          job_id: data.job_id,
          status: 'processing'
        },
        loading: false 
      });
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'rgpd_export_requested');
      }
      
      return true;
    } catch (error) {
      set({ 
        loading: false,
        error: error instanceof Error ? error.message : 'Erreur de démarrage'
      });
      return false;
    }
  },

  pollStatus: async (jobId: string) => {
    try {
      const response = await fetch(`/api/me/export/${jobId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get export status');
      }
      
      const data = await response.json();
      const currentJob = get().job;
      
      if (currentJob && currentJob.job_id === jobId) {
        set({ 
          job: { ...currentJob, ...data }
        });
        
        // Analytics for completion
        if (data.status === 'ready' && currentJob.status !== 'ready') {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'rgpd_export_ready');
          }
        }
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de statut'
      });
    }
  },

  cancelJob: () => {
    const currentJob = get().job;
    if (currentJob) {
      // Optionally call DELETE API to revoke URL
      fetch(`/api/me/export/${currentJob.job_id}`, { method: 'DELETE' })
        .catch((error) => logger.warn('Failed to delete export job', error, 'SYSTEM'));
    }
    
    set({ job: null, loading: false, error: null });
  },

  reset: () => set({ job: null, loading: false, error: null }),
}));