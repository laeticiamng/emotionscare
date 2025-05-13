
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler"
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <div className="modal-content">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <p>{message}</p>
        <div className="flex justify-center mt-4 space-x-2">
          <button onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {confirmText}
          </button>
          <button onClick={onClose} className="bg-muted text-muted-foreground hover:bg-muted/90">
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
