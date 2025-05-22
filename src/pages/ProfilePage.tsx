
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { SaveIcon } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    phone: '',
    department: user?.department || '',
    position: user?.position || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulating update profile
    setTimeout(() => {
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    }, 500);
  };
  
  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Veuillez vous connecter pour voir votre profil</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>
      
      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{user.role}</Badge>
                      {user.department && <Badge variant="secondary">{user.department}</Badge>}
                    </div>
                  </div>
                </div>
                <div>
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Annuler' : 'Modifier le profil'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Poste</Label>
                      <Input 
                        id="position" 
                        name="position"
                        value={formData.position} 
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Département</Label>
                      <Input 
                        id="department" 
                        name="department"
                        value={formData.department} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea 
                      id="bio" 
                      name="bio"
                      value={formData.bio} 
                      onChange={handleChange} 
                      rows={4}
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Rôle</h3>
                      <p className="capitalize">{user.role}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Département</h3>
                      <p>{user.department || '–'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Poste</h3>
                      <p>{user.position || '–'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Dernière connexion</h3>
                      <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Membre depuis</h3>
                      <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end">
                <Button type="submit" onClick={handleSubmit}>
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>
                Personnalisez votre expérience dans l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les préférences seront disponibles bientôt.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Historique de vos interactions avec l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                L'historique d'activité sera disponible prochainement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
