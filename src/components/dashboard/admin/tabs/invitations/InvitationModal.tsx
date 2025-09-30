// @ts-nocheck

// Need to modify the InvitationForm import to accept the onInvitationSent prop
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InvitationForm from '@/components/invitations/InvitationForm';

interface InvitationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvitationSent: () => void;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ 
  open, 
  onOpenChange,
  onInvitationSent
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inviter un collaborateur</DialogTitle>
        </DialogHeader>
        <InvitationForm onInvitationSent={onInvitationSent} />
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModal;
