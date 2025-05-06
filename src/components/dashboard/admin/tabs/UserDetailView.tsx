import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Phone, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { mockUsers } from '@/data/mockUsers';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import UserActivityTimeline from '@/components/admin/UserActivityTimeline';

interface UserDetailViewProps {
  userId: string;
  onBack: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ userId, onBack }) => {
  // Find user by ID (in a real app, this would be an API call)
  const user = mockUsers.find(u => u.id === userId);
  
  // If user not found
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <CardTitle>Utilisateur non trouvé</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  const getEmotionalHealthLabel = (score?: number) => {
    if (!score) return { label: 'Non évalué', color: 'bg-muted' };
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 65) return { label: 'Bon', color: 'bg-lime-500' };
    if (score >= 50) return { label: 'Moyen', color: 'bg-yellow-500' };
    if (score >= 35) return { label: 'Préoccupant', color: 'bg-orange-500' };
    return { label: 'Critique', color: 'bg-red-500' };
  };
  
  const healthStatus = getEmotionalHealthLabel(user.emotional_score);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Envoyer un message</Button>
            <Button size="sm">Programmer un suivi</Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
          <Avatar className="h-20 w-20 border">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{user.name}</CardTitle>
              <Badge variant="outline">{user.role}</Badge>
            </div>
            <CardDescription className="flex items-center mt-1">
              <Mail className="h-4 w-4 mr-1" />
              {user.email}
            </CardDescription>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{user.anonymity_code}</Badge>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-1 ${healthStatus.color}`}></div>
                <span className="text-sm">{healthStatus.label}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-3">
        <Tabs defaultValue="activity">
          <TabsList className="mb-4">
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="personal">Infos personnelles</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity">
            {/* Ensure UserActivityTimeline accepts userId prop */}
            <UserActivityTimeline userId={userId} />
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="mt-4">
              <h3 className="font-medium mb-2">Statistiques utilisateur</h3>
              <p className="text-muted-foreground">Détails des statistiques à implementer.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="personal">
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium">Informations de contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Compte créé le: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Dernière connexion: {new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Sessions totales: 28</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">Préférences utilisateur</h3>
                <p className="text-muted-foreground mt-1">Information non disponible</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <div className="mt-4">
              <h3 className="font-medium mb-2">Notes administratives</h3>
              <p className="text-muted-foreground">Aucune note enregistrée pour cet utilisateur.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserDetailView;
