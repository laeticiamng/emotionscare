import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Settings, 
  Shield, 
  Bell,
  CreditCard,
  Trophy,
  Calendar,
  Download,
  Upload,
  Trash2,
  Edit
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavAction } from '@/hooks/useNavAction';

export function AccountHub() {
  const { user } = useAuth();
  const navAction = useNavAction();
  const [activeTab, setActiveTab] = useState('profile');

  const userStats = {
    joinDate: '2024-01-15',
    totalSessions: 127,
    streakDays: 12,
    favoriteActivity: 'Scan Émotionnel',
    subscription: 'Premium'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {user?.user_metadata?.name || 'Utilisateur'}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <Badge variant="secondary" className="mt-1">
              {userStats.subscription}
            </Badge>
          </div>
        </div>
        <Button 
          onClick={() => navAction({ type: 'modal', id: 'edit-profile' })}
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier le profil
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{userStats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Sessions totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{userStats.streakDays}</div>
            <div className="text-sm text-muted-foreground">Jours consécutifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-muted-foreground">Membre depuis</div>
            <div className="text-xs">Janvier 2024</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-sm text-muted-foreground">Activité favorite</div>
            <div className="text-xs">Scan Émotionnel</div>
          </CardContent>
        </Card>
      </div>

      {/* Account Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations de profil et préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'edit-name' })}
              >
                <User className="w-4 h-4 mr-2" />
                Modifier le nom et prénom
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'edit-avatar' })}
              >
                <Upload className="w-4 h-4 mr-2" />
                Changer la photo de profil
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'preferences' })}
              >
                <Settings className="w-4 h-4 mr-2" />
                Préférences de l'application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>
                Protégez votre compte avec des paramètres de sécurité robustes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'change-password' })}
              >
                <Shield className="w-4 h-4 mr-2" />
                Changer le mot de passe
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: '2fa-setup' })}
              >
                <Shield className="w-4 h-4 mr-2" />
                Authentification à deux facteurs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Contrôlez quand et comment vous recevez les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'notification-settings' })}
              >
                <Bell className="w-4 h-4 mr-2" />
                Paramètres de notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement Premium</CardTitle>
              <CardDescription>
                Gérez votre abonnement et facturation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'billing' })}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Facturation et paiement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>
                Exportez, sauvegardez ou supprimez vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'export-data' })}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter mes données
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => navAction({ type: 'modal', id: 'delete-account' })}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer le compte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}