
import React from 'react';
import { TableHeader, TableRow } from '@/components/ui/table';
import SortableTableHead, { SortDirection } from '@/components/ui/data-table/SortableTableHead';
import { SortableField } from '../types/tableTypes';

interface UserTableHeaderProps {
  onSort: (field: SortableField) => void;
  isSorted: (field: SortableField) => SortDirection;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({ onSort, isSorted }) => {
  return (
    <TableHeader>
      <TableRow>
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
          isSorted={isSorted('anonymity_code')}
          onSort={() => onSort('anonymity_code')}
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
