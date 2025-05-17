
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { getRoleName } from '@/utils/roleUtils';

interface UserDetailViewProps {
  user: User;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ user }) => {
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails de l'utilisateur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || user.avatarUrl || user.avatar_url} />
            <AvatarFallback>{getInitials(user.name || '')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2">{getRoleName(user.role)}</Badge>
          </div>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">Général</TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1">Préférences</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">ID</h4>
                <p className="text-sm truncate">{user.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date d'inscription</h4>
                <p className="text-sm">{user.joined_at || user.created_at || 'Non disponible'}</p>
              </div>
              {user.department && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Département</h4>
                  <p className="text-sm">{user.department}</p>
                </div>
              )}
              {user.position && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Position</h4>
                  <p className="text-sm">{user.position}</p>
                </div>
              )}
              {user.emotional_score !== undefined && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Score émotionnel</h4>
                  <p className="text-sm">{user.emotional_score}</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="preferences" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Thème</h4>
                <p className="text-sm">{user.preferences?.theme || 'Défaut'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Langue</h4>
                <p className="text-sm">{user.preferences?.language || 'Français'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Notifications</h4>
                <p className="text-sm">
                  {user.preferences?.notifications?.enabled ? 'Activées' : 'Désactivées'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Layout dashboard</h4>
                <p className="text-sm">{user.preferences?.dashboardLayout || 'Défaut'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Onboarding complété</h4>
                <p className="text-sm">{user.preferences?.onboardingCompleted ? 'Oui' : 'Non'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserDetailView;
