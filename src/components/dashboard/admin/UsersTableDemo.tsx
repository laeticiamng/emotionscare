import React from 'react';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types';

export interface UsersTableDemoProps {
  showLoadMoreButton?: boolean;
}

export const UsersTableDemo: React.FC<UsersTableDemoProps> = ({ showLoadMoreButton = false }) => {
  return (
    <div className="border rounded-md">
      <div className="p-4">
        <h3 className="text-lg font-medium">Liste des utilisateurs</h3>
        <p className="text-sm text-muted-foreground">
          Tableau d'utilisateurs (implémentation de démonstration)
        </p>
      </div>
      
      <div className="p-4">
        {/* Placeholder content - will be fully implemented later */}
        <p className="text-center py-8 text-muted-foreground">
          Tableau des utilisateurs (à implémenter)
        </p>
        
        {showLoadMoreButton && (
          <div className="flex justify-center mt-4">
            <Button variant="outline">Charger plus</Button>
          </div>
        )}
      </div>
    </div>
  );
};
