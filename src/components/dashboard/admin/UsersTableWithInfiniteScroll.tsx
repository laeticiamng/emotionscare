import React from 'react';

export const UsersTableWithInfiniteScroll: React.FC = () => {
  return (
    <div className="border rounded-md">
      <div className="p-4">
        <h3 className="text-lg font-medium">Liste des utilisateurs (défilement infini)</h3>
        <p className="text-sm text-muted-foreground">
          Tableau d'utilisateurs avec défilement infini (implémentation de démonstration)
        </p>
      </div>
      
      <div className="p-4">
        {/* Placeholder content - will be fully implemented later */}
        <p className="text-center py-8 text-muted-foreground">
          Tableau des utilisateurs avec défilement infini (à implémenter avec @tanstack/react-table)
        </p>
      </div>
    </div>
  );
};
