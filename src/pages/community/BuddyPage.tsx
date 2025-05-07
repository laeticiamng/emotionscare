
import React from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus } from 'lucide-react';
import { BuddyCard } from '@/components/community/BuddyCard';

const BuddyPage = () => {
  const buddies = [
    {
      id: "1",
      name: "Alex Dubois",
      role: "Marketing",
      anonymityCode: "AD123456",
      status: "online",
      lastActive: "Il y a 5 minutes",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    {
      id: "2",
      name: "Marie Leroy", 
      role: "Design",
      anonymityCode: "ML789012",
      status: "offline",
      lastActive: "Hier",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: "3",
      name: "Thomas Martin",
      role: "Développeur",
      anonymityCode: "TM345678",
      status: "busy",
      lastActive: "Il y a 3 heures",
      avatar: "https://i.pravatar.cc/150?img=8"
    }
  ];
  
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Programme Buddy</h1>
          <p className="text-muted-foreground">Connexions de confiance avec des collègues pour un soutien mutuel</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mes Buddies</CardTitle>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter un Buddy
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Rechercher un buddy..." />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buddies.map(buddy => (
                    <BuddyCard key={buddy.id} buddy={buddy} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Les suggestions de buddy sont basées sur vos intérêts communs et votre compatibilité émotionnelle.
                </p>
                
                <Button className="w-full">Voir les suggestions</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default BuddyPage;
