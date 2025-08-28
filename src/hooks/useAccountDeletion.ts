import { useEffect } from 'react';
import { useAccountStore } from '@/store/account.store';

export const useAccountDeletion = () => {
  const store = useAccountStore();

  // Check account status on mount
  useEffect(() => {
    // Don't make API calls in demo/development mode
    // store.checkStatus();
  }, []); // Empty dependencies for mount-only effect

  // Calculate days until purge
  const getDaysUntilPurge = () => {
    if (!store.purgeAt) return null;
    
    const purgeDate = new Date(store.purgeAt);
    const now = new Date();
    const diffTime = purgeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  // Check if account can still be restored
  const canRestore = () => {
    const days = getDaysUntilPurge();
    return days !== null && days > 0;
  };

  // Format purge date for display
  const formatPurgeDate = () => {
    if (!store.purgeAt) return null;
    
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(store.purgeAt));
    } catch {
      return store.purgeAt;
    }
  };

  const softDelete = async (reason?: string) => {
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'account_delete_open_modal');
    }

    // Check if offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      store.setError('Hors ligne - connecte-toi pour supprimer ton compte');
      return false;
    }

    return await store.softDelete(reason);
  };

  const undelete = async () => {
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'account_undelete_clicked');
    }

    return await store.undelete();
  };

  return {
    status: store.status,
    purgeAt: store.purgeAt,
    loading: store.loading,
    error: store.error,
    softDelete,
    undelete,
    getDaysUntilPurge,
    canRestore,
    formatPurgeDate,
    reset: store.reset,
  };
};