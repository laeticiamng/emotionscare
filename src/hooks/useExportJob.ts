import { useEffect, useRef } from 'react';
import { useRGPDStore } from '@/store/rgpd.store';

export const useExportJob = () => {
  const store = useRGPDStore();
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-polling when job is processing
  useEffect(() => {
    const job = store.job;
    
    if (job && job.status === 'processing') {
      // Start polling
      pollIntervalRef.current = setInterval(() => {
        store.pollStatus(job.job_id);
      }, 3000); // Poll every 3 seconds
      
      // Global timeout (10 minutes)
      timeoutRef.current = setTimeout(() => {
        store.setError('Export timeout - please try again');
        store.reset();
      }, 10 * 60 * 1000);
    } else {
      // Stop polling
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    // Cleanup
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [store.job?.status]); // Remove store from dependencies

  // Handle network connectivity
  useEffect(() => {
    const handleOnline = () => {
      // Resume polling if we have a processing job
      if (store.job?.status === 'processing') {
        store.pollStatus(store.job.job_id);
      }
    };

    const handleOffline = () => {
      // Pause polling
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependencies for mount-only effect

  const start = async () => {
    const success = await store.startExport();
    if (success && store.job) {
      // Start polling immediately
      store.pollStatus(store.job.job_id);
    }
    return success;
  };

  const poll = () => {
    if (store.job) {
      store.pollStatus(store.job.job_id);
    }
  };

  const cancel = () => {
    store.cancelJob();
  };

  const downloadAndTrack = (url: string) => {
    // Track download attempt
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'rgpd_export_download_clicked');
    }
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = ''; // Let browser determine filename from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    job: store.job,
    loading: store.loading,
    error: store.error,
    start,
    poll,
    cancel,
    downloadAndTrack,
    reset: store.reset,
  };
};