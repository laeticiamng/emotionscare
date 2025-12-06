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
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {/* Simulation de données utilisateurs avec scroll infini */}
          {Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Utilisateur ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: ['B2C', 'B2B User', 'B2B Admin'][i % 3],
            joinDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
          })).map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-muted/50">
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/10 px-2 py-1 rounded">{user.role}</span>
                <span className="text-xs text-muted-foreground">{user.joinDate}</span>
              </div>
            </div>
          ))}
          <div className="text-center py-4">
            <Button variant="ghost" size="sm">Charger plus...</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
