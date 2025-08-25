import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Modal {
  id: string;
  component?: string;
  props?: Record<string, unknown>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  overlay?: boolean;
}

interface ModalState {
  modals: Modal[];
  isOpen: (id: string) => boolean;
  open: (modal: Modal) => void;
  close: (id: string) => void;
  closeAll: () => void;
  update: (id: string, props: Partial<Modal>) => void;
}

/**
 * Store Zustand pour la gestion des modals
 * Intégré avec le système d'actions de navigation
 */
export const useModalStore = create<ModalState>()(
  devtools(
    (set, get) => ({
      modals: [],

      isOpen: (id: string) => {
        return get().modals.some(modal => modal.id === id);
      },

      open: (modal: Modal) => {
        set(state => {
          // Éviter les doublons
          const existingIndex = state.modals.findIndex(m => m.id === modal.id);
          
          if (existingIndex >= 0) {
            // Mettre à jour le modal existant
            const updatedModals = [...state.modals];
            updatedModals[existingIndex] = { ...updatedModals[existingIndex], ...modal };
            return { modals: updatedModals };
          }
          
          // Ajouter nouveau modal
          return {
            modals: [...state.modals, {
              size: 'md',
              closable: true,
              overlay: true,
              ...modal,
            }],
          };
        });
      },

      close: (id: string) => {
        set(state => ({
          modals: state.modals.filter(modal => modal.id !== id),
        }));
      },

      closeAll: () => {
        set({ modals: [] });
      },

      update: (id: string, props: Partial<Modal>) => {
        set(state => ({
          modals: state.modals.map(modal =>
            modal.id === id ? { ...modal, ...props } : modal
          ),
        }));
      },
    }),
    {
      name: 'modal-store',
    }
  )
);

/**
 * Hook pour utiliser le système de modals avec des actions typées
 */
export function useModal() {
  const { open, close, isOpen, update, closeAll } = useModalStore();

  // Actions pré-définies courantes
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    open({
      id: 'auth-modal',
      component: 'AuthModal',
      props: { mode },
      size: 'md',
    });
  };

  const openFeedbackModal = () => {
    open({
      id: 'feedback-modal',
      component: 'FeedbackModal',
      size: 'lg',
    });
  };

  const openSettingsModal = (section?: string) => {
    open({
      id: 'settings-modal',
      component: 'SettingsModal',
      props: { initialSection: section },
      size: 'xl',
    });
  };

  const openConfirmDialog = (
    message: string,
    onConfirm: () => void,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      variant?: 'default' | 'destructive';
    }
  ) => {
    open({
      id: 'confirm-dialog',
      component: 'ConfirmDialog',
      props: {
        message,
        onConfirm,
        ...options,
      },
      size: 'sm',
    });
  };

  return {
    // Actions génériques
    open,
    close,
    isOpen,
    update,
    closeAll,
    
    // Actions pré-définies
    openAuthModal,
    openFeedbackModal,
    openSettingsModal,
    openConfirmDialog,
  };
}