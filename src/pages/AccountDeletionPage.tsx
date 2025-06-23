
import React from 'react';

const AccountDeletionPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Suppression de Compte</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Supprimer le Compte</h2>
          <p className="text-muted-foreground text-red-600">
            ⚠️ Cette action est irréversible
          </p>
          {/* TODO: Implémenter l'interface Account Deletion complète */}
        </div>
      </div>
    </main>
  );
};

export default AccountDeletionPage;
