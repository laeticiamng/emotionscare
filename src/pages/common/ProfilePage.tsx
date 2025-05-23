
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p>Veuillez vous connecter pour accéder à votre profil.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Profil utilisateur</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata?.avatar_url} alt="Avatar" />
              <AvatarFallback>
                {user.user_metadata?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user.user_metadata?.name || 'Utilisateur'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              
              {/* Informations supplémentaires pourraient être affichées ici */}
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default ProfilePage;
