
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TeamsPage: React.FC = () => {
  // Sample team data for demonstration
  const teamMembers = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Responsable RH',
      avatar: 'https://i.pravatar.cc/150?img=21',
      skills: ['Leadership', 'Gestion'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Thomas Bernard',
      role: 'Lead Developer',
      avatar: 'https://i.pravatar.cc/150?img=22',
      skills: ['Technique', 'Développement'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Claire Dubois',
      role: 'UX Designer',
      avatar: 'https://i.pravatar.cc/150?img=23',
      skills: ['Créativité', 'Design'],
      status: 'active'
    },
    {
      id: 4,
      name: 'Marc Lambert',
      role: 'Marketing',
      avatar: 'https://i.pravatar.cc/150?img=24',
      skills: ['Analyse', 'Stratégie'],
      status: 'away'
    },
    {
      id: 5,
      name: 'Julie Petit',
      role: 'Support Client',
      avatar: 'https://i.pravatar.cc/150?img=25',
      skills: ['Communication', 'Relationnel'],
      status: 'active'
    },
  ];

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Équipe</h1>
          <Button>Inviter un membre</Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Membres de l'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {member.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" size="sm">Voir profil</Button>
                      <Button variant="ghost" size="sm">Message</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default TeamsPage;
