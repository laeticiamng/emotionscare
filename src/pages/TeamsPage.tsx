
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Search, Users, BarChart2, MessageCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  wellnessScore: number;
  members: TeamMember[];
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Marketing',
    description: 'Équipe en charge de la stratégie marketing et communication',
    memberCount: 12,
    wellnessScore: 82,
    members: [
      { id: '1', name: 'Marie Dupont', role: 'Directrice Marketing' },
      { id: '2', name: 'Thomas Leroux', role: 'Chef de projet' },
      { id: '3', name: 'Sophie Martin', role: 'Designer' },
      // ... autres membres
    ]
  },
  {
    id: '2',
    name: 'Développement',
    description: 'Équipe technique responsable du développement produit',
    memberCount: 18,
    wellnessScore: 75,
    members: [
      { id: '4', name: 'Lucas Bernard', role: 'Lead Developer' },
      { id: '5', name: 'Emma Petit', role: 'Frontend Developer' },
      { id: '6', name: 'Hugo Durand', role: 'Backend Developer' },
      // ... autres membres
    ]
  },
  {
    id: '3',
    name: 'Commercial',
    description: 'Équipe commerciale et relation client',
    memberCount: 8,
    wellnessScore: 68,
    members: [
      { id: '7', name: 'Julie Moreau', role: 'Directrice Commerciale' },
      { id: '8', name: 'Nicolas Roux', role: 'Account Manager' },
      { id: '9', name: 'Camille Simon', role: 'Business Developer' },
      // ... autres membres
    ]
  }
];

const TeamsPage: React.FC = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCreateTeam = () => {
    toast({
      title: "Création d'équipe",
      description: "Cette fonctionnalité sera disponible prochainement",
    });
  };
  
  const handleShowTeamDetails = (teamId: string) => {
    toast({
      title: "Détails de l'équipe",
      description: "La vue détaillée de l'équipe sera disponible prochainement",
    });
  };
  
  const handleShowWellnessSummary = () => {
    toast({
      title: "Résumé bien-être",
      description: "Le rapport détaillé de bien-être sera disponible prochainement",
    });
  };
  
  const handleMessageTeam = (teamId: string) => {
    toast({
      title: "Message à l'équipe",
      description: "La messagerie d'équipe sera disponible prochainement",
    });
  };
  
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Équipes</h1>
          <p className="text-muted-foreground">Gérez vos équipes et suivez leur bien-être</p>
        </div>
        <Button onClick={handleCreateTeam}>Créer une équipe</Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Rechercher une équipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Toutes les équipes</TabsTrigger>
          <TabsTrigger value="my-teams">Mes équipes</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map((team) => (
                <TeamCard 
                  key={team.id}
                  team={team}
                  onViewDetails={() => handleShowTeamDetails(team.id)}
                  onShowWellness={() => handleShowWellnessSummary()}
                  onMessageTeam={() => handleMessageTeam(team.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune équipe trouvée pour cette recherche.</p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Voir toutes les équipes
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-teams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.slice(0, 1).map((team) => (
              <TeamCard 
                key={team.id}
                team={team}
                onViewDetails={() => handleShowTeamDetails(team.id)}
                onShowWellness={() => handleShowWellnessSummary()}
                onMessageTeam={() => handleMessageTeam(team.id)}
                isMember={true}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Niveau de bien-être par équipe</CardTitle>
                <CardDescription>Comparaison du score de bien-être entre les équipes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.map(team => (
                    <div key={team.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{team.name}</span>
                        <span className="font-medium">{team.wellnessScore}%</span>
                      </div>
                      <Progress value={team.wellnessScore} />
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-6 w-full"
                  onClick={handleShowWellnessSummary}
                >
                  Voir le rapport complet
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistiques d'utilisation</CardTitle>
                <CardDescription>Engagement des équipes avec la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-muted-foreground">
                  Les statistiques détaillées seront disponibles prochainement.
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({
                    title: "Statistiques",
                    description: "Le rapport statistique détaillé sera disponible prochainement",
                  })}
                >
                  Générer un rapport
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TeamCardProps {
  team: Team;
  onViewDetails: () => void;
  onShowWellness: () => void;
  onMessageTeam: () => void;
  isMember?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  onViewDetails, 
  onShowWellness, 
  onMessageTeam,
  isMember = false
}) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
        <CardDescription>{team.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{team.memberCount} membres</span>
          {isMember && (
            <span className="text-xs text-emerald-500 ml-auto font-medium">
              Vous êtes membre
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Niveau de bien-être</span>
            <span className="font-medium">{team.wellnessScore}%</span>
          </div>
          <Progress value={team.wellnessScore} />
        </div>
        
        <div className="flex -space-x-2 overflow-hidden">
          {team.members.slice(0, 3).map((member) => (
            <Avatar key={member.id} className="border-2 border-background">
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              {member.avatar && <AvatarImage src={member.avatar} alt={member.name} />}
            </Avatar>
          ))}
          {team.memberCount > 3 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
              +{team.memberCount - 3}
            </div>
          )}
        </div>
      </CardContent>
      
      <div className="p-4 pt-0 mt-auto space-y-2">
        <Button variant="default" className="w-full" onClick={onViewDetails}>
          Voir les détails
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" onClick={onShowWellness}>
            <BarChart2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex-1" onClick={onMessageTeam}>
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TeamsPage;
