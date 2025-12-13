// @ts-nocheck
import { toast as sonnerToast } from 'sonner'
import { useCallback, useState, useRef, useEffect, useMemo } from 'react'

/** Variantes de toast disponibles */
export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'loading' | 'promise';

/** Position des toasts */
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/** Action d'un toast */
export interface ToastAction {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: 'default' | 'destructive';
}

/** Toast avec annulation */
export interface UndoableAction {
  action: () => void | Promise<void>;
  undo: () => void | Promise<void>;
  timeout?: number;
}

/** Options du toast */
export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  action?: ToastAction;
  undoable?: UndoableAction;
  icon?: React.ReactNode;
  dismissible?: boolean;
  important?: boolean;
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

/** Toast dans l'historique */
export interface ToastHistoryEntry {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
  timestamp: Date;
  dismissed: boolean;
  duration?: number;
}

/** Options pour les toasts de promesse */
export interface PromiseToastOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: Error) => string);
}

/** Configuration du hook */
export interface UseToastConfig {
  maxHistory?: number;
  defaultDuration?: number;
  defaultPosition?: ToastPosition;
  enableHistory?: boolean;
  persistHistory?: boolean;
  storageKey?: string;
}

/** État du toast avec progression */
export interface ProgressToast {
  id: string;
  progress: number;
  message: string;
}

const DEFAULT_CONFIG: UseToastConfig = {
  maxHistory: 50,
  defaultDuration: 4000,
  defaultPosition: 'bottom-right',
  enableHistory: true,
  persistHistory: false,
  storageKey: 'toast-history'
};

export interface UseToastReturn {
  // Actions de base
  toast: (options: ToastOptions) => string;
  success: (options: ToastOptions) => string;
  error: (options: ToastOptions) => string;
  warning: (options: ToastOptions) => string;
  info: (options: ToastOptions) => string;
  loading: (message: string) => string;
  dismiss: (id?: string) => void;
  dismissAll: () => void;

  // Actions avancées
  promise: <T>(promise: Promise<T>, options: PromiseToastOptions<T>) => Promise<T>;
  update: (id: string, options: ToastOptions) => void;
  custom: (component: React.ReactNode, options?: Omit<ToastOptions, 'title' | 'description'>) => string;

  // Toast avec progression
  progress: (id: string, progress: number, message?: string) => void;
  createProgress: (message: string) => ProgressToast;
  completeProgress: (id: string, successMessage?: string) => void;

  // Historique
  history: ToastHistoryEntry[];
  clearHistory: () => void;
  getRecentToasts: (count?: number) => ToastHistoryEntry[];

  // Utilitaires
  activeToasts: string[];
  isActive: (id: string) => boolean;
}

export function useToast(config?: Partial<UseToastConfig>): UseToastReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const [history, setHistory] = useState<ToastHistoryEntry[]>(() => {
    if (typeof window === 'undefined' || !mergedConfig.persistHistory) return [];
    try {
      const stored = localStorage.getItem(mergedConfig.storageKey!);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) }));
      }
    } catch {}
    return [];
  });
  const [activeToasts, setActiveToasts] = useState<string[]>([]);
  const progressToastsRef = useRef<Map<string, ProgressToast>>(new Map());
  const undoTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Persister l'historique
  useEffect(() => {
    if (!mergedConfig.persistHistory || typeof window === 'undefined') return;
    try {
      localStorage.setItem(mergedConfig.storageKey!, JSON.stringify(history.slice(0, mergedConfig.maxHistory)));
    } catch {}
  }, [history, mergedConfig.persistHistory, mergedConfig.storageKey, mergedConfig.maxHistory]);

  // Ajouter à l'historique
  const addToHistory = useCallback((entry: Omit<ToastHistoryEntry, 'timestamp' | 'dismissed'>) => {
    if (!mergedConfig.enableHistory) return;
    setHistory(prev => [{
      ...entry,
      timestamp: new Date(),
      dismissed: false
    }, ...prev].slice(0, mergedConfig.maxHistory));
  }, [mergedConfig.enableHistory, mergedConfig.maxHistory]);

  // Toast de base
  const toast = useCallback((options: ToastOptions) => {
    const { variant = 'default', undoable, action, ...rest } = options;
    const id = options.id || `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Gérer l'action d'annulation
    if (undoable) {
      const timeout = undoable.timeout || 5000;
      const timeoutId = setTimeout(() => {
        undoable.action();
        undoTimeoutsRef.current.delete(id);
      }, timeout);
      undoTimeoutsRef.current.set(id, timeoutId);

      rest.action = {
        label: 'Annuler',
        onClick: () => {
          const storedTimeout = undoTimeoutsRef.current.get(id);
          if (storedTimeout) {
            clearTimeout(storedTimeout);
            undoTimeoutsRef.current.delete(id);
          }
          undoable.undo();
          sonnerToast.dismiss(id);
        }
      } as any;
      rest.duration = timeout;
    } else if (action) {
      rest.action = {
        label: action.label,
        onClick: action.onClick
      } as any;
    }

    setActiveToasts(prev => [...prev, id]);

    const onDismissOriginal = rest.onDismiss;
    rest.onDismiss = () => {
      setActiveToasts(prev => prev.filter(t => t !== id));
      onDismissOriginal?.();
    };

    let toastId: string;
    switch (variant) {
      case 'success':
        toastId = sonnerToast.success(options.title || options.description, { ...rest, id });
        break;
      case 'destructive':
        toastId = sonnerToast.error(options.title || options.description, { ...rest, id });
        break;
      case 'warning':
        toastId = sonnerToast.warning(options.title || options.description, { ...rest, id });
        break;
      case 'info':
        toastId = sonnerToast.info(options.title || options.description, { ...rest, id });
        break;
      case 'loading':
        toastId = sonnerToast.loading(options.title || options.description, { ...rest, id });
        break;
      default:
        toastId = sonnerToast(options.title || options.description, { ...rest, id });
    }

    addToHistory({ id: toastId, title: options.title, description: options.description, variant, duration: options.duration });
    return toastId;
  }, [addToHistory]);

  const success = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'success' });
  }, [toast]);

  const error = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'destructive' });
  }, [toast]);

  const warning = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'warning' });
  }, [toast]);

  const info = useCallback((options: ToastOptions) => {
    return toast({ ...options, variant: 'info' });
  }, [toast]);

  const loading = useCallback((message: string) => {
    return toast({ title: message, variant: 'loading', duration: Infinity });
  }, [toast]);

  const dismiss = useCallback((id?: string) => {
    if (id) {
      const timeout = undoTimeoutsRef.current.get(id);
      if (timeout) clearTimeout(timeout);
      undoTimeoutsRef.current.delete(id);
      setActiveToasts(prev => prev.filter(t => t !== id));
    }
    sonnerToast.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    undoTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    undoTimeoutsRef.current.clear();
    setActiveToasts([]);
    sonnerToast.dismiss();
  }, []);

  // Promise toast
  const promiseToast = useCallback(<T,>(promise: Promise<T>, options: PromiseToastOptions<T>): Promise<T> => {
    const id = `promise_${Date.now()}`;
    setActiveToasts(prev => [...prev, id]);

    return sonnerToast.promise(promise, {
      loading: options.loading,
      success: (data: T) => {
        setActiveToasts(prev => prev.filter(t => t !== id));
        return typeof options.success === 'function' ? options.success(data) : options.success;
      },
      error: (err: Error) => {
        setActiveToasts(prev => prev.filter(t => t !== id));
        return typeof options.error === 'function' ? options.error(err) : options.error;
      }
    }) as Promise<T>;
  }, []);

  // Update toast
  const update = useCallback((id: string, options: ToastOptions) => {
    const { variant = 'default', ...rest } = options;
    switch (variant) {
      case 'success':
        sonnerToast.success(options.title || options.description, { ...rest, id });
        break;
      case 'destructive':
        sonnerToast.error(options.title || options.description, { ...rest, id });
        break;
      case 'warning':
        sonnerToast.warning(options.title || options.description, { ...rest, id });
        break;
      case 'info':
        sonnerToast.info(options.title || options.description, { ...rest, id });
        break;
      default:
        sonnerToast(options.title || options.description, { ...rest, id });
    }
  }, []);

  // Custom toast
  const custom = useCallback((component: React.ReactNode, options?: Omit<ToastOptions, 'title' | 'description'>) => {
    const id = options?.id || `custom_${Date.now()}`;
    setActiveToasts(prev => [...prev, id]);
    return sonnerToast.custom(component as any, { ...options, id });
  }, []);

  // Progress toasts
  const createProgress = useCallback((message: string): ProgressToast => {
    const id = `progress_${Date.now()}`;
    const progressToast: ProgressToast = { id, progress: 0, message };
    progressToastsRef.current.set(id, progressToast);
    sonnerToast.loading(message, { id, description: '0%' });
    setActiveToasts(prev => [...prev, id]);
    return progressToast;
  }, []);

  const progress = useCallback((id: string, progressValue: number, message?: string) => {
    const progressToast = progressToastsRef.current.get(id);
    if (!progressToast) return;

    progressToast.progress = progressValue;
    if (message) progressToast.message = message;

    sonnerToast.loading(progressToast.message, { id, description: `${Math.round(progressValue)}%` });
  }, []);

  const completeProgress = useCallback((id: string, successMessage?: string) => {
    progressToastsRef.current.delete(id);
    setActiveToasts(prev => prev.filter(t => t !== id));
    sonnerToast.success(successMessage || 'Terminé', { id });
  }, []);

  // Historique
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (mergedConfig.persistHistory && typeof window !== 'undefined') {
      localStorage.removeItem(mergedConfig.storageKey!);
    }
  }, [mergedConfig.persistHistory, mergedConfig.storageKey]);

  const getRecentToasts = useCallback((count: number = 10) => {
    return history.slice(0, count);
  }, [history]);

  const isActive = useCallback((id: string) => {
    return activeToasts.includes(id);
  }, [activeToasts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      undoTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
    promise: promiseToast,
    update,
    custom,
    progress,
    createProgress,
    completeProgress,
    history,
    clearHistory,
    getRecentToasts,
    activeToasts,
    isActive
  };
}

/** Fonction toast standalone pour usage sans hook */
export const toast = (options: ToastOptions) => {
  const { variant = 'default', ...rest } = options;

  switch (variant) {
    case 'success':
      return sonnerToast.success(options.title || options.description, rest);
    case 'destructive':
      return sonnerToast.error(options.title || options.description, rest);
    case 'warning':
      return sonnerToast.warning(options.title || options.description, rest);
    case 'info':
      return sonnerToast.info(options.title || options.description, rest);
    case 'loading':
      return sonnerToast.loading(options.title || options.description, rest);
    default:
      return sonnerToast(options.title || options.description, rest);
  }
};

/** Helpers rapides pour toast */
export const toastSuccess = (message: string, description?: string) =>
  toast({ title: message, description, variant: 'success' });

export const toastError = (message: string, description?: string) =>
  toast({ title: message, description, variant: 'destructive' });

export const toastWarning = (message: string, description?: string) =>
  toast({ title: message, description, variant: 'warning' });

export const toastInfo = (message: string, description?: string) =>
  toast({ title: message, description, variant: 'info' });

export const toastLoading = (message: string) =>
  sonnerToast.loading(message);

/** Promise toast standalone */
export const toastPromise = <T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) => sonnerToast.promise(promise, messages);

/** Dismiss toast standalone */
export const dismissToast = (id?: string) => sonnerToast.dismiss(id);

/** Dismiss all toasts */
export const dismissAllToasts = () => sonnerToast.dismiss();

export default useToast;