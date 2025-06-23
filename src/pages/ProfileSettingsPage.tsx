
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileSettingsPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Paramètres Profil</h1>
        <Card>
          <CardHeader>
            <CardTitle>Configuration du profil</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Personnalisez votre profil et vos préférences.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
