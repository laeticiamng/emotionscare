// @ts-nocheck

import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import UserSessionsTab from './UserSessionsTab';
import UserEmotionsTab from './UserEmotionsTab';
import UserActivityTab from './UserActivityTab';

interface UserDetailViewProps {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    department?: string;
    phone?: string;
    location?: string;
    joinDate?: string | Date;
    emotionalScore?: number;
    avatarUrl?: string;
  };
  onBack: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ userId, user, onBack }) => {
  // Format date properly if it's a Date object
  const formattedJoinDate = user.joinDate 
    ? typeof user.joinDate === 'string'
      ? user.joinDate
      : format(new Date(user.joinDate), 'dd MMMM yyyy', { locale: fr })
    : 'Date inconnue';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Profil utilisateur</CardTitle>
          <CardDescription>Détails de l'utilisateur et activités</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="text-lg">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              {user.emotionalScore !== undefined && (
                <div className="mt-2 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                  Score émotionnel : {user.emotionalScore}%
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.department}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Inscrit le {formattedJoinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <UserActivityTab userId={userId} />
        </TabsContent>
        <TabsContent value="emotions">
          <UserEmotionsTab userId={userId} />
        </TabsContent>
        <TabsContent value="sessions">
          <UserSessionsTab userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailView;
