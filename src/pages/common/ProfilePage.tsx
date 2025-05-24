
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Award, 
  Target,
  Camera,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || 'Utilisateur',
    bio: 'Passionné par le développement personnel et le bien-être émotionnel.',
    location: 'France',
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
    avatar: user?.user_metadata?.avatar_url || ''
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  // Mock data for profile stats
  const stats = {
    emotionalScore: 75,
    streakDays: 12,
    totalSessions: 48,
    journalEntries: 23,
    coachSessions: 15,
    musicSessions: 32
  };

  const achievements = [
    { id: 1, name: 'Premier pas', description: 'Première session d\'analyse', earned: true, icon: '🎯' },
    { id: 2, name: 'Régularité', description: '7 jours consécutifs', earned: true, icon: '🔥' },
    { id: 3, name: 'Introspection', description: '10 entrées journal', earned: true, icon: '📖' },
    { id: 4, name: 'Bien-être', description: 'Score émotionnel > 70', earned: true, icon: '💚' },
    { id: 5, name: 'Musicothérapie', description: '20 sessions musique', earned: true, icon: '🎵' },
    { id: 6, name: 'Coach expert', description: '30 sessions coach', earned: false, icon: '🧠' }
  ];

  const recentActivity = [
    { date: 'Aujourd\'hui', activity: 'Session de thérapie musicale', type: 'music' },
    { date: 'Hier', activity: 'Entrée journal - "Journée productive"', type: 'journal' },
    { date: 'Il y a 2 jours', activity: 'Coach IA - Gestion du stress', type: 'coach' },
    { date: 'Il y a 3 jours', activity: 'Analyse émotionnelle', type: 'scan' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profil mis à jour !');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'music': return '🎵';
      case 'journal': return '📖';
      case 'coach': return '🧠';
      case 'scan': return '🔍';
      default: return '📊';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <User className="h-8 w-8 text-blue-600" />
          Mon Profil
        </h1>
        <p className="text-muted-foreground">
          Suivez votre progression et gérez vos informations
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Informations
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2"
                    variant="secondary"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom complet"
                  />
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Décrivez-vous en quelques mots..."
                    className="min-h-20"
                  />
                  <Input
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Localisation"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                      {isSaving ? 'Sauvegarde...' : <>
                        <Save className="mr-2 h-4 w-4" />
                        Sauvegarder
                      </>}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <Badge variant="secondary">
                    {getUserModeDisplayName(userMode)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Membre depuis le {profile.joinDate}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats and Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Statistiques
            </CardTitle>
            <CardDescription>
              Votre progression en bien-être émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Emotional Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score émotionnel</span>
                  <span className="text-lg font-bold text-green-600">{stats.emotionalScore}%</span>
                </div>
                <Progress value={stats.emotionalScore} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Excellent ! Votre bien-être s'améliore constamment.
                </p>
              </div>

              {/* Streak */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Série active</span>
                  <span className="text-lg font-bold text-orange-600">{stats.streakDays} jours</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3 text-red-500" />
                  Continue comme ça !
                </div>
              </div>

              {/* Activity Stats */}
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions totales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.journalEntries}</div>
                  <div className="text-xs text-muted-foreground">Entrées journal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.coachSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions coach</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.musicSessions}</div>
                  <div className="text-xs text-muted-foreground">Musique thérapie</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Accomplissements
            </CardTitle>
            <CardDescription>
              Vos réussites sur le chemin du bien-être
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border ${
                    achievement.earned
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        achievement.earned ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Obtenu
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Activité récente
            </CardTitle>
            <CardDescription>
              Vos dernières sessions et interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div className="text-2xl">{getActivityIcon(item.type)}</div>
                  <div className="flex-1">
                    <p className="font-medium">{item.activity}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
