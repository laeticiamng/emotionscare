
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Phone } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const teams = [
    {
      id: 1,
      name: "Équipe Marketing",
      members: 8,
      leader: "Marie Dubois",
      email: "marie.dubois@company.com",
      phone: "+33 1 23 45 67 89",
      status: "active",
      wellnessScore: 85
    },
    {
      id: 2,
      name: "Équipe Développement",
      members: 12,
      leader: "Jean Martin",
      email: "jean.martin@company.com",
      phone: "+33 1 23 45 67 90",
      status: "active",
      wellnessScore: 72
    },
    {
      id: 3,
      name: "Équipe Support",
      members: 6,
      leader: "Sophie Laurent",
      email: "sophie.laurent@company.com",
      phone: "+33 1 23 45 67 91",
      status: "active",
      wellnessScore: 90
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Équipes</h1>
          <p className="text-muted-foreground">
            Gérez vos équipes et suivez leur bien-être
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Ajouter une équipe
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                <Badge variant="default">
                  {team.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{team.members} membres</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Responsable d'équipe</h4>
                <p className="text-sm text-muted-foreground">{team.leader}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{team.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{team.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Score de bien-être</span>
                  <span className="font-medium">{team.wellnessScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${team.wellnessScore}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
