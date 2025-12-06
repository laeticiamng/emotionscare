import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ModalConfig {
  id: string;
  title?: string;
  description?: string;
  content: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  onClose?: () => void;
  footer?: ReactNode;
}

interface ModalContextType {
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = (config: Omit<ModalConfig, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const modal: ModalConfig = {
      id,
      closable: true,
      size: 'md',
      ...config
    };
    setModals(prev => [...prev, modal]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter(m => m.id !== id);
    });
  };

  const closeAllModals = () => {
    modals.forEach(modal => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm': return 'sm:max-w-sm';
      case 'md': return 'sm:max-w-md';
      case 'lg': return 'sm:max-w-lg';
      case 'xl': return 'sm:max-w-xl';
      case 'full': return 'sm:max-w-full';
      default: return 'sm:max-w-md';
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map(modal => (
        <Dialog
          key={modal.id}
          open={true}
          onOpenChange={() => modal.closable && closeModal(modal.id)}
        >
          <DialogContent className={getSizeClass(modal.size || 'md')}>
            {modal.closable && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
                onClick={() => closeModal(modal.id)}
                aria-label="Fermer la fenêtre"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            
            {(modal.title || modal.description) && (
              <DialogHeader>
                {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
                {modal.description && <DialogDescription>{modal.description}</DialogDescription>}
              </DialogHeader>
            )}
            
            <div className="py-4">
              {modal.content}
            </div>
            
            {modal.footer && (
              <DialogFooter>
                {modal.footer}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </ModalContext.Provider>
  );
};
