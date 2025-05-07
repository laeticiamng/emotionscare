
import React, { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BuddyCard from '@/components/community/BuddyCard';
import { useActivityLogging } from '@/hooks/useActivityLogging';

// Mock data for buddy matches
const mockBuddies = [
  {
    id: '1',
    name: 'Sophie Martin',
    department: 'Marketing',
    interests: ['Yoga', 'Méditation', 'Randonnée'],
    compatibility: 87,
    avatar: 'https://i.pravatar.cc/150?u=sophie'
  },
  {
    id: '2',
    name: 'Thomas Dubois',
    department: 'Finance',
    interests: ['Course à pied', 'Lecture', 'Cuisine'],
    compatibility: 82,
    avatar: 'https://i.pravatar.cc/150?u=thomas'
  },
  {
    id: '3',
    name: 'Emma Petit',
    department: 'Ressources Humaines',
    interests: ['Natation', 'Jardinage', 'Photographie'],
    compatibility: 78,
    avatar: 'https://i.pravatar.cc/150?u=emma'
  },
  {
    id: '4',
    name: 'Lucas Bernard',
    department: 'Informatique',
    interests: ['Musique', 'Cyclisme', 'Échecs'],
    compatibility: 75,
    avatar: 'https://i.pravatar.cc/150?u=lucas'
  }
];

const BuddyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBuddies, setFilteredBuddies] = useState(mockBuddies);
  const [activeTab, setActiveTab] = useState('matches');
  
  // Log page visit
  const { logUserAction } = useActivityLogging('buddy_page');
  
  useEffect(() => {
    const filtered = mockBuddies.filter(
      buddy => buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               buddy.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
               buddy.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredBuddies(filtered);
  }, [searchTerm]);
  
  return (
    <ProtectedLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Trouvez votre Buddy</h1>
          <p className="text-muted-foreground mt-2">
            Rencontrez des collègues qui partagent vos intérêts et vos objectifs de bien-être
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Connexions de bien-être</CardTitle>
              
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, département..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <CardDescription>
              Votre buddy vous aide à maintenir vos engagements de bien-être et partage des intérêts similaires
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="matches" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="matches">Suggestions</TabsTrigger>
                <TabsTrigger value="myBuddies">Mes Buddies</TabsTrigger>
                <TabsTrigger value="requests">Demandes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches">
                {filteredBuddies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBuddies.map(buddy => (
                      <BuddyCard
                        key={buddy.id}
                        name={buddy.name}
                        department={buddy.department}
                        interests={buddy.interests}
                        compatibility={buddy.compatibility}
                        avatarUrl={buddy.avatar}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Aucun résultat correspondant à votre recherche</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="myBuddies">
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Vous n'avez pas encore de buddies actifs</p>
                  <Button className="mt-4" onClick={() => setActiveTab('matches')}>
                    Découvrir des buddies
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="requests">
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Vous n'avez pas de demandes en attente</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline">Comment ça marche</Button>
            <Button onClick={() => logUserAction('find_buddy')}>Trouver plus de buddies</Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default BuddyPage;
