
import React from 'react';

const UserPreferencesPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Préférences Utilisateur</h1>
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Paramètres Généraux</h2>
            {/* TODO: Implémenter l'interface de préférences complète */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Notifications</span>
                <div className="w-12 h-6 bg-primary rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <span>Mode sombre</span>
                <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserPreferencesPage;
