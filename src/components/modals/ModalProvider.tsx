import React, { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/state/modalStore';
import { cn } from '@/lib/utils';

// Lazy load des composants de modals
const AuthModal = React.lazy(() => import('./AuthModal'));
const FeedbackModal = React.lazy(() => import('./FeedbackModal'));
const SettingsModal = React.lazy(() => import('./SettingsModal'));
const ConfirmDialog = React.lazy(() => import('./ConfirmDialog'));

const MODAL_COMPONENTS = {
  AuthModal,
  FeedbackModal,
  SettingsModal,
  ConfirmDialog,
} as const;

/**
 * Provider global pour les modals
 * Intégré avec le système d'actions de navigation
 */
export function ModalProvider() {
  const { modals, close } = useModalStore();

  return (
    <AnimatePresence mode="multiple">
      {modals.map((modal) => (
        <ModalWrapper
          key={modal.id}
          modal={modal}
          onClose={() => modal.closable !== false && close(modal.id)}
        />
      ))}
    </AnimatePresence>
  );
}

interface ModalWrapperProps {
  modal: {
    id: string;
    component?: string;
    props?: Record<string, unknown>;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closable?: boolean;
    overlay?: boolean;
  };
  onClose: () => void;
}

function ModalWrapper({ modal, onClose }: ModalWrapperProps) {
  const ModalComponent = modal.component 
    ? (MODAL_COMPONENTS as any)[modal.component] 
    : null;

  if (!ModalComponent) {
    console.warn(`Modal component "${modal.component}" not found`);
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          'p-0 gap-0 overflow-hidden',
          sizeClasses[modal.size || 'md']
        )}
        aria-describedby={`modal-${modal.id}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* En-tête avec bouton de fermeture si closable */}
          {modal.closable !== false && (
            <DialogHeader className="absolute top-4 right-4 z-10 p-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </Button>
            </DialogHeader>
          )}

          {/* Contenu du modal */}
          <Suspense 
            fallback={
              <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <ModalComponent 
              {...(modal.props || {})} 
              onClose={onClose}
            />
          </Suspense>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalProvider;