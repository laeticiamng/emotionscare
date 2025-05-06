
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InvitationForm from '@/components/invitations/InvitationForm';

interface InvitationModalProps {
  open: boolean;
  onClose: () => void;
  onInvitationSent: () => void;
}

const InvitationModal: React.FC<InvitationModalProps> = ({
  open,
  onClose,
  onInvitationSent,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Inviter un nouveau collaborateur</DialogTitle>
          <DialogDescription>
            Envoyez une invitation sécurisée à un collaborateur pour rejoindre la plateforme EmotionsCare.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <InvitationForm 
            onInvitationSent={() => {
              onInvitationSent();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModal;
