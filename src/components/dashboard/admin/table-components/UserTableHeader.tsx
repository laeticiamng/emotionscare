
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import SortableTableHead, { SortDirection } from '@/components/ui/data-table/SortableTableHead';
import { SortableField } from '../types/tableTypes';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableHeaderProps {
  onSort: (field: SortableField) => void;
  isSorted: (field: SortableField) => SortDirection;
  onSelectAll?: () => void;
  allSelected?: boolean;
  hasSelectionEnabled?: boolean;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({ 
  onSort, 
  isSorted, 
  onSelectAll, 
  allSelected = false,
  hasSelectionEnabled = false
}) => {
  return (
    <TableHeader>
      <TableRow>
        {hasSelectionEnabled && (
          <TableHead className="w-[40px] px-2">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Sélectionner tous les utilisateurs"
            />
          </TableHead>
        )}
        
        <SortableTableHead 
          isSorted={isSorted('name')}
          onSort={() => onSort('name')}
          className="w-[250px]"
          ariaLabel="Nom d'utilisateur"
        >
          Utilisateur
        </SortableTableHead>
        
        <SortableTableHead 
          isSorted={isSorted('emotional_score')}
          onSort={() => onSort('emotional_score')}
          ariaLabel="Score émotionnel"
        >
          Score émotionnel
        </SortableTableHead>
        
        <SortableTableHead 
          isSorted={isSorted('role')}
          onSort={() => onSort('role')}
          ariaLabel="Rôle"
        >
          Rôle
        </SortableTableHead>
        
        <SortableTableHead 
          className="text-right"
          ariaLabel="Code d'anonymisation"
        >
          Code d'anonymisation
        </SortableTableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
