
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Camera, Trophy, Activity, Calendar, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Marie Dubois',
    email: 'marie.dubois@example.com',
    bio: 'Passionnée de bien-être et de développement personnel',
    location: 'Paris, France',
    joinDate: '2024-01-15'
  });

  const stats = [
    { label: 'Jours actifs', value: '147', icon: Calendar },
    { label: 'Sessions VR', value: '23', icon: Activity },
    { label: 'Badges gagnés', value: '8', icon: Trophy },
    { label: 'Bien-être moyen', value: '87%', icon: Heart }
  ];

  const badges = [
    { name: 'Premier pas', description: 'Première connexion', color: 'bg-blue-500' },
    { name: 'Régulier', description: '30 jours consécutifs', color: 'bg-green-500' },
    { name: 'Explorateur', description: 'Toutes les fonctionnalités utilisées', color: 'bg-purple-500' },
    { name: 'Mentor', description: 'Aide à la communauté', color: 'bg-orange-500' }
  ];

  const handleSave = () => {
    toast.success('Profil mis à jour avec succès');
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header avec avatar et infos principales */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/lovable-uploads/avatar-placeholder.jpg" />
                  <AvatarFallback className="text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                <p className="text-muted-foreground mb-4">{profileData.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary">{profileData.location}</Badge>
                  <Badge variant="outline">Membre depuis {new Date(profileData.joinDate).toLocaleDateString()}</Badge>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "secondary" : "default"}
              >
                <User className="h-4 w-4 mr-2" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleSave} className="w-full">
                      Sauvegarder les modifications
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div><strong>Email:</strong> {profileData.email}</div>
                    <div><strong>Localisation:</strong> {profileData.location}</div>
                    <div><strong>Membre depuis:</strong> {new Date(profileData.joinDate).toLocaleDateString()}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Mes badges ({badges.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center`}>
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Session VR complétée', time: 'Il y a 2 heures', type: 'vr' },
                    { action: 'Nouvelle entrée de journal', time: 'Il y a 5 heures', type: 'journal' },
                    { action: 'Badge "Régulier" obtenu', time: 'Hier', type: 'badge' },
                    { action: 'Scan émotionnel effectué', time: 'Il y a 2 jours', type: 'scan' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-primary bg-muted/50">
                      <Activity className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
