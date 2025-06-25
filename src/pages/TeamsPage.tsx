
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Settings } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const teams = [
    { name: "Équipe Marketing", members: 12, status: "Actif" },
    { name: "Développement", members: 8, status: "Actif" },
    { name: "Support Client", members: 6, status: "Actif" }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Gestion des Équipes</h1>
              </div>
              <p className="text-muted-foreground">
                Gérez les équipes et leurs membres
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle équipe
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {teams.map((team, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{team.name}</span>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Gérer
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{team.members}</p>
                      <p className="text-sm text-muted-foreground">Membres</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">{team.status}</p>
                      <p className="text-sm text-muted-foreground">Statut</p>
                    </div>
                  </div>
                  <Button variant="outline">Voir les détails</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
