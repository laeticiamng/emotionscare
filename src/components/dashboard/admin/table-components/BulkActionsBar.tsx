
import React from 'react';
import { Ban, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BulkActionProps } from '../types/tableTypes';
import { toast } from 'sonner';

const BulkActionsBar: React.FC<BulkActionProps> = ({ selectedUsers, onClearSelection }) => {
  const selectedCount = selectedUsers.length;
  
  // Handler for bulk delete action
  const handleBulkDelete = () => {
    console.log('Deleting users:', selectedUsers);
    // In a real app, we would call an API endpoint here
    toast.success(`${selectedCount} utilisateurs supprimés avec succès`);
    onClearSelection();
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
  };
  
  return (
    <div className="bulk-actions-bar p-2 bg-background border rounded-lg shadow-sm flex items-center justify-between mb-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
      <div className="flex-1">
        <span className="text-sm font-medium">{selectedCount} utilisateur{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}</span>
      </div>
      
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
              className="flex items-center gap-1"
              aria-label={`Supprimer ${selectedCount} utilisateurs sélectionnés`}
            >
              <Trash2 size={16} />
              Supprimer ({selectedCount})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
              <AlertDialogDescription>
                Vous allez supprimer définitivement {selectedCount} utilisateur{selectedCount > 1 ? 's' : ''}. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Non, annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Oui, supprimer ces utilisateurs
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
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
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="warning" 
              size="sm"
              className="flex items-center gap-1"
              aria-label={`Bannir ${selectedCount} utilisateurs sélectionnés`}
            >
              <Ban size={16} />
              Bannir ({selectedCount})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr(e) ?</AlertDialogTitle>
              <AlertDialogDescription>
                Vous allez bannir {selectedCount} utilisateur{selectedCount > 1 ? 's' : ''} de la plateforme.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Non, annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkBan} className="bg-warning text-white hover:bg-warning/90">
                Oui, bannir ces utilisateurs
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearSelection}
          aria-label="Annuler la sélection"
        >
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
