
import React, { useState } from 'react';
import { Ban, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BulkActionProps } from '../types/tableTypes';
import { toast } from 'sonner';
import { SecureConfirmationDialog } from '@/components/ui/secure-confirmation-dialog';

const BulkActionsBar: React.FC<BulkActionProps> = ({ selectedUsers, onClearSelection }) => {
  const selectedCount = selectedUsers.length;
  
  // State for secure confirmation dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  
  // Handler for bulk delete action
  const handleBulkDelete = () => {
    console.log('Deleting users:', selectedUsers);
    // In a real app, we would call an API endpoint here
    toast.success(`${selectedCount} utilisateurs supprimés avec succès`);
    onClearSelection();
    setDeleteDialogOpen(false);
  };
  
  // Handler for bulk export action
  const handleBulkExport = () => {
    console.log('Exporting users:', selectedUsers);
    // In a real app, we would generate and download an export file
    toast.success(`${selectedCount} utilisateurs exportés avec succès`);
  };
  
  // Handler for bulk ban action
  const handleBulkBan = () => {
    console.log('Banning users:', selectedUsers);
    // In a real app, we would call an API endpoint here
    toast.success(`${selectedCount} utilisateurs bannis avec succès`);
    onClearSelection();
    setBanDialogOpen(false);
  };
  
  return (
    <div className="bulk-actions-bar p-2 bg-background border rounded-lg shadow-sm flex items-center justify-between mb-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
      <div className="flex-1">
        <span className="text-sm font-medium">{selectedCount} utilisateur{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}</span>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="destructive" 
          size="sm"
          className="flex items-center gap-1"
          aria-label={`Supprimer ${selectedCount} utilisateurs sélectionnés`}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 size={16} />
          Supprimer ({selectedCount})
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleBulkExport}
          aria-label={`Exporter ${selectedCount} utilisateurs sélectionnés`}
        >
          <FileText size={16} />
          Exporter ({selectedCount})
        </Button>
        
        <Button 
          variant="warning" 
          size="sm"
          className="flex items-center gap-1"
          aria-label={`Bannir ${selectedCount} utilisateurs sélectionnés`}
          onClick={() => setBanDialogOpen(true)}
        >
          <Ban size={16} />
          Bannir ({selectedCount})
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearSelection}
          aria-label="Annuler la sélection"
        >
          Annuler
        </Button>
      </div>
      
      {/* Secure Confirmation Dialog for Delete action */}
      <SecureConfirmationDialog
        title="⚠️ Attention : action irréversible !"
        description={`Vous êtes sur le point de supprimer définitivement les comptes de ${selectedCount} utilisateur${selectedCount > 1 ? 's' : ''}. Cette action est irréversible et entraînera la suppression définitive de toutes leurs données d'utilisation et de bien-être.`}
        actionLabel={`Oui, supprimer définitivement`}
        isOpen={deleteDialogOpen}
        onConfirm={handleBulkDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmationWord="CONFIRMER"
        isDestructive={true}
      />
      
      {/* Secure Confirmation Dialog for Ban action */}
      <SecureConfirmationDialog
        title="⚠️ Confirmation nécessaire"
        description={`Vous êtes sur le point de bannir ${selectedCount} utilisateur${selectedCount > 1 ? 's' : ''}. Ces utilisateurs ne pourront plus accéder à la plateforme jusqu'à ce que vous leviez cette restriction.`}
        actionLabel={`Oui, bannir ces utilisateurs`}
        isOpen={banDialogOpen}
        onConfirm={handleBulkBan}
        onCancel={() => setBanDialogOpen(false)}
        confirmationWord="CONFIRMER"
        isDestructive={true}
      />
    </div>
  );
};

export default BulkActionsBar;
