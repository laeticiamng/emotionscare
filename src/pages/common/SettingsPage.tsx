
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <Button onClick={() => navigate(-1)} variant="outline">
            Retour
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Gérez vos préférences</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Page de paramètres à venir.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
