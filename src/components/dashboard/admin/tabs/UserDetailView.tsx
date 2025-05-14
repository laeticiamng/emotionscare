import React, { useState } from 'react';
import { User } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Mail, Shield, User as UserIcon } from 'lucide-react';
import UserActivityTab from './UserActivityTab';
import UserEmotionsTab from './UserEmotionsTab';
import UserNotesTab from './UserNotesTab';
import UserSessionsTab from './UserSessionsTab';

interface UserDetailViewProps {
  user: User;
  onUpdate?: (user: User) => void;
  onClose?: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ user, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const { toast } = useToast();

  const handleSaveChanges = () => {
    if (onUpdate) {
      onUpdate(editedUser);
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour avec succès."
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: string) => {
    // Check if the role is one of the valid User role types
    const validRole = role as User['role'];
    
    setEditedUser(prev => ({
      ...prev,
      role: validRole
    }));
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'manager':
      case 'wellbeing_manager':
        return 'default';
      case 'coach':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Manager';
      case 'wellbeing_manager':
        return 'Manager bien-être';
      case 'coach':
        return 'Coach';
      case 'employee':
        return 'Employé';
      default:
        return 'Utilisateur';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url || user.avatar || ''} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
              <span className="text-sm text-muted-foreground">ID: {user.id}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline">Modifier</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Modifier l'utilisateur</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de l'utilisateur. Cliquez sur sauvegarder lorsque vous avez terminé.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rôle
                  </Label>
                  <Select
                    value={editedUser.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="employee">Employé</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="wellbeing_manager">Manager bien-être</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Département
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    value={editedUser.department || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Poste
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    value={editedUser.position || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                <Button onClick={handleSaveChanges}>Sauvegarder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>Fermer</Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Détails du profil de l'utilisateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                  <p>{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                  <p>{getRoleLabel(user.role)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Département</p>
                  <p>{user.department || 'Non spécifié'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Poste</p>
                  <p>{user.position || 'Non spécifié'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date d'inscription</p>
                  <p>{formatDate(user.created_at || user.joined_at || '')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Onboarding complété</p>
                  <p>{user.onboarded ? 'Oui' : 'Non'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Score émotionnel</p>
                  <p>{user.emotional_score ? `${user.emotional_score}/100` : 'Non disponible'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Paramètres et préférences de l'utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              {user.preferences ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Thème</p>
                    <p className="capitalize">{user.preferences.theme || 'Système'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Langue</p>
                    <p>{user.preferences.language === 'fr' ? 'Français' : user.preferences.language === 'en' ? 'Anglais' : user.preferences.language || 'Non spécifié'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                    <p>{user.preferences.notifications_enabled ? 'Activées' : 'Désactivées'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Confidentialité</p>
                    <p>{user.preferences.privacy === 'public' ? 'Public' : user.preferences.privacy === 'private' ? 'Privé' : user.preferences.privacy === 'friends' ? 'Amis seulement' : 'Standard'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune préférence définie</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions administratives</CardTitle>
              <CardDescription>Gérer le compte utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Envoyer un email
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Réinitialiser le mot de passe
                </Button>
                <Button variant="outline" size="sm">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Désactiver le compte
                </Button>
                <Button variant="destructive" size="sm">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Supprimer le compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <UserActivityTab userId={user.id} />
        </TabsContent>
        
        <TabsContent value="emotions">
          <UserEmotionsTab userId={user.id} />
        </TabsContent>
        
        <TabsContent value="sessions">
          <UserSessionsTab userId={user.id} />
        </TabsContent>
        
        <TabsContent value="notes">
          <UserNotesTab userId={user.id} userName={user.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailView;
