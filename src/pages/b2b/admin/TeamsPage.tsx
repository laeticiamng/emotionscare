
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Filter } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const teams = [
    { id: 1, name: 'Équipe Marketing', members: 8, status: 'active', leader: 'Marie Dubois' },
    { id: 2, name: 'Équipe Développement', members: 12, status: 'active', leader: 'Jean Martin' },
    { id: 3, name: 'Équipe RH', members: 5, status: 'active', leader: 'Sophie Chen' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Équipes</h1>
          <p className="text-muted-foreground">
            Gérez les équipes et leurs membres
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Équipe
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Rechercher une équipe..."
            className="pl-8 w-full border rounded-md px-3 py-2"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                  {team.status}
                </Badge>
              </div>
              <CardDescription>
                Responsable: {team.leader}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{team.members} membres</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline">
                  Voir détails
                </Button>
                <Button size="sm">
                  Gérer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
