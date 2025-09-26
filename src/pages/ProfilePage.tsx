import React from 'react';
import ProfileManager from '@/components/features/ProfileManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Settings, 
  Award,
  Calendar,
  Heart,
  Brain,
  Activity,
  Target,
  TrendingUp,
  Clock,
  Star,
  Edit,
  Camera
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const profileData = {
    name: 'Utilisateur EmotionsCare',
    email: 'user@emotionscare.com',
    joinDate: '15 Mars 2024',
    lastActive: 'Il y a 2 minutes',
    level: 12,
    xp: 2850,
    nextLevelXp: 3200
  };

  const achievements = [
    { name: 'Premier Journal', description: 'Première entrée dans le journal', icon: '📝', unlocked: true },
    { name: 'Méditation 7 Jours', description: '7 jours consécutifs de méditation', icon: '🧘', unlocked: true },
    { name: 'Analyste Émotionnel', description: '50 analyses d\'émotions complétées', icon: '🎭', unlocked: true },
    { name: 'Musicothérapeute', description: '25 heures d\'écoute musicale', icon: '🎵', unlocked: false },
    { name: 'Guru du Bien-être', description: '100 jours d\'utilisation', icon: '🌟', unlocked: false }
  ];

  const stats = [
    { label: 'Jours Actifs', value: 89, max: 100, icon: Calendar, color: 'text-blue-500' },
    { label: 'Sessions Méditation', value: 45, max: 50, icon: Brain, color: 'text-purple-500' },
    { label: 'Entrées Journal', value: 127, max: 150, icon: Heart, color: 'text-red-500' },
    { label: 'Heures Musique', value: 23, max: 30, icon: Activity, color: 'text-green-500' }
  ];

  const weeklyProgress = [
    { day: 'Lun', mood: 7, sessions: 2 },
    { day: 'Mar', mood: 8, sessions: 3 },
    { day: 'Mer', mood: 6, sessions: 1 },
    { day: 'Jeu', mood: 9, sessions: 4 },
    { day: 'Ven', mood: 8, sessions: 2 },
    { day: 'Sam', mood: 9, sessions: 3 },
    { day: 'Dim', mood: 7, sessions: 2 }
  ];

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Star className="h-3 w-3 mr-1" />
            Niveau {profileData.level}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Gérez votre profil et suivez votre progression
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations du profil */}
        <div>
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-xl">{profileData.name}</CardTitle>
              <CardDescription>{profileData.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Niveau {profileData.level}</div>
                <Progress value={(profileData.xp / profileData.nextLevelXp) * 100} className="mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {profileData.xp} / {profileData.nextLevelXp} XP
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membre depuis:</span>
                  <span>{profileData.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dernière activité:</span>
                  <span>{profileData.lastActive}</span>
                </div>
              </div>

              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Éditer le profil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="achievements">Succès</TabsTrigger>
              <TabsTrigger value="progress">Progrès</TabsTrigger>
            </TabsList>

            {/* Onglet Statistiques */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                          <span className="font-medium">{stat.label}</span>
                        </div>
                        <span className="text-2xl font-bold">{stat.value}</span>
                      </div>
                      <Progress value={(stat.value / stat.max) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-2">
                        Objectif: {stat.max}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Succès */}
            <TabsContent value="achievements" className="space-y-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={achievement.unlocked ? '' : 'opacity-60'}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.unlocked ? (
                        <Badge variant="default">Débloqué</Badge>
                      ) : (
                        <Badge variant="secondary">Verrouillé</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Onglet Progrès */}
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progrès Hebdomadaire
                  </CardTitle>
                  <CardDescription>
                    Votre évolution cette semaine
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyProgress.map((day, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-8 text-center text-sm font-medium">
                          {day.day}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Humeur</span>
                            <span>{day.mood}/10</span>
                          </div>
                          <Progress value={day.mood * 10} className="h-2" />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {day.sessions} sessions
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;