
import React, { useState } from 'react';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Avatar, 
  AvatarImage,
  AvatarFallback
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin,
  Building,
  Award,
  Briefcase,
  Activity
} from 'lucide-react';
import { User as UserType } from '@/types/user';

interface UserDetailViewProps {
  user: UserType;
  onClose?: () => void;
}

// Mocked user data for the component example with all fields properly typed
const mockUser: UserType = {
  id: "user123",
  name: "Sophie Martin",
  email: "sophie.martin@example.com",
  role: "b2b_user",
  avatar_url: "/images/avatars/sophie.jpg",
  joined_at: "2023-03-15T09:30:00Z",
  created_at: "2023-03-15T09:30:00Z",
  department: "Marketing",
  position: "Content Strategist",
  emotional_score: 82,
  onboarded: true,
  preferences: {
    theme: "light",
    fontSize: "medium",
    fontFamily: "sans",
    reduceMotion: false,
    colorBlindMode: false,
    autoplayMedia: true,
    soundEnabled: true,
    language: "fr",
    notifications_enabled: true,
    privacy: {
      showProfile: true,
      shareActivity: true,
      allowMessages: true,
      allowNotifications: true
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      frequency: "daily"
    }
  }
};

const UserDetailView: React.FC<UserDetailViewProps> = ({ user = mockUser, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Format date to readable string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate user account age
  const calculateAccountAge = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const joinedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} jours`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return diffMonths === 1 ? '1 mois' : `${diffMonths} mois`;
    }
  };

  // Get role display name
  const getRoleName = (role: string) => {
    switch(role) {
      case 'b2c': return 'Particulier';
      case 'b2b_user': return 'Collaborateur';
      case 'b2b_admin': return 'Administrateur';
      default: return role;
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Détails de l'utilisateur</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </CardHeader>
      
      <div className="px-6 pb-2">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="w-24 h-24 border-2 border-primary/10">
            <AvatarImage src={user?.avatar_url || user?.avatar} />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">{user.name || 'Utilisateur'}</h3>
            <div className="text-muted-foreground flex items-center gap-1 justify-center md:justify-start mb-1">
              <Mail className="h-3.5 w-3.5" />
              <span>{user.email || 'Email non renseigné'}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <Badge variant="outline" className="bg-primary/10">
                {getRoleName(user.role)}
              </Badge>
              {user.department && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {user.department}
                </Badge>
              )}
              {user.position && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {user.position}
                </Badge>
              )}
              {user.onboarded && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  Onboarding complété
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="profile" className="text-sm">Profil</TabsTrigger>
              <TabsTrigger value="activity" className="text-sm">Activité</TabsTrigger>
              <TabsTrigger value="preferences" className="text-sm">Préférences</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date d'inscription</div>
                    <div className="font-medium">{formatDate(user.created_at || user.joined_at)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Statut de l'onboarding</div>
                    <div className="font-medium">{user.onboarded ? 'Complété' : 'Non complété'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Département</div>
                    <div className="font-medium">{user.department || 'Non renseigné'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Poste</div>
                    <div className="font-medium">{user.position || 'Non renseigné'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Score émotionnel</div>
                    <div className="font-medium">
                      {user.emotional_score !== undefined ? `${user.emotional_score}/100` : 'Non calculé'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Activité récente</h4>
              
              {/* Placeholder for activity data */}
              <div className="text-center text-muted-foreground py-8">
                Les données d'activité seront disponibles bientôt
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Préférences utilisateur</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Thème</span>
                  <span className="text-sm font-medium">
                    {user.preferences?.theme === 'light' ? 'Clair' : 
                     user.preferences?.theme === 'dark' ? 'Sombre' : 
                     user.preferences?.theme === 'pastel' ? 'Pastel' : 'Système'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Langue</span>
                  <span className="text-sm font-medium">
                    {user.preferences?.language === 'fr' ? 'Français' : 
                     user.preferences?.language === 'en' ? 'Anglais' : 
                     user.preferences?.language || 'Français'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Notifications</span>
                  <span className="text-sm font-medium">
                    {user.preferences?.notifications_enabled ? 'Activées' : 'Désactivées'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Autoplay média</span>
                  <span className="text-sm font-medium">
                    {user.preferences?.autoplayMedia ? 'Activé' : 'Désactivé'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Mode privé</span>
                  <span className="text-sm font-medium">
                    {user.preferences?.privacy?.showProfile === false ? 'Activé' : 'Désactivé'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Partage d'activité</span>
                  <span className="text-sm font-medium">
                    {user.preferences?.privacy?.shareActivity ? 'Activé' : 'Désactivé'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Messagerie</span>
                  <span className="text-sm font-medium">
                    {user.preferences?.privacy?.allowMessages ? 'Autorisée' : 'Bloquée'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Son</span>
                  <span className="text-sm font-medium">{user.preferences?.soundEnabled ? 'Activé' : 'Désactivé'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Mode daltonien</span>
                  <span className="text-sm font-medium">{user.preferences?.colorBlindMode ? 'Activé' : 'Désactivé'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm">Réduction d'animation</span>
                  <span className="text-sm font-medium">{user.preferences?.reduceMotion ? 'Activée' : 'Désactivée'}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-4">
        <Button variant="outline" className="mr-2" onClick={onClose}>Fermer</Button>
        <Button>Modifier</Button>
      </CardFooter>
    </Card>
  );
};

export default UserDetailView;
