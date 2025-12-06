
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, UserPlus, MoreHorizontal, Mail } from 'lucide-react';
import { BulkActionProps } from '../types/tableTypes';

const BulkActionsBar: React.FC<BulkActionProps> = ({ 
  selectedUsers, 
  onClearSelection 
}) => {
  return (
    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedUsers.length} utilisateur{selectedUsers.length > 1 ? 's' : ''} sélectionné{selectedUsers.length > 1 ? 's' : ''}
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4 mr-1" />
          Effacer
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm">
          <Mail className="h-4 w-4 mr-1" />
          Contacter
        </Button>
        
        <Button variant="secondary" size="sm">
          <UserPlus className="h-4 w-4 mr-1" />
          Attribuer
        </Button>
        
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
