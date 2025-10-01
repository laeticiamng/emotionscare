// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface DeleteAccountButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({ 
  className,
  variant = 'destructive' 
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
    
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'account_delete_open_modal');
    }
  };

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={handleClick}
        aria-label="Supprimer mon compte"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Supprimer mon compte
      </Button>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};