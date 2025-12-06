
import React from 'react';
import { Button } from '@/components/ui/button';

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
        <div className="space-y-4">
          {/* Simulation de données utilisateurs */}
          {[
            { id: 1, name: 'Marie Dupont', email: 'marie@example.com', role: 'B2C', status: 'Actif', lastLogin: '2023-12-15' },
            { id: 2, name: 'Thomas Martin', email: 'thomas@entreprise.com', role: 'B2B User', status: 'Actif', lastLogin: '2023-12-14' },
            { id: 3, name: 'Sophie Bernard', email: 'sophie@admin.com', role: 'B2B Admin', status: 'Inactif', lastLogin: '2023-12-10' },
            { id: 4, name: 'Pierre Moreau', email: 'pierre@example.com', role: 'B2C', status: 'Actif', lastLogin: '2023-12-15' }
          ].map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs bg-secondary px-2 py-1 rounded">{user.role}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  user.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
                <span className="text-xs text-muted-foreground">{user.lastLogin}</span>
              </div>
            </div>
          ))}
        </div>
        
        {showLoadMoreButton && (
          <div className="flex justify-center mt-4">
            <Button variant="outline">Charger plus d'utilisateurs</Button>
          </div>
        )}
      </div>
    </div>
  );
};
