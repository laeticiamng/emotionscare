
import React from 'react';
import Shell from '@/Shell';

const ProfilePage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Profil utilisateur</h1>
        <p className="text-muted-foreground mb-4">
          Cette page affiche les informations du profil utilisateur.
        </p>
        
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <p className="text-center text-muted-foreground">
            Contenu du profil à venir
          </p>
        </div>
      </div>
    </Shell>
  );
};

export default ProfilePage;
