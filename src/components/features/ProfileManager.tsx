// @ts-nocheck
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Heart, 
  Brain,
  Target,
  Award,
  Calendar,
  Activity,
  Sparkles,
  Edit,
  Save,
  Camera,
  Star,
  TrendingUp
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profession?: string;
  bio?: string;
  avatar?: string;
  joinDate: Date;
  preferences: {
    notifications: boolean;
    dataSharing: boolean;
    aiInsights: boolean;
    voiceReminders: boolean;
  };
  wellnessProfile: {
    primaryGoals: string[];
    stressLevel: number;
    activityLevel: number;
    sleepQuality: number;
  };
  stats: {
    totalSessions: number;
    streak: number;
    level: number;
    experience: number;
    nextLevelExp: number;
  };
}

const ProfileManager: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'wellness' | 'achievements'>('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    profession: 'Designer UX/UI',
    bio: 'Passionnée par le bien-être mental et le développement personnel. J\'utilise EmotionsCare pour maintenir un équilibre émotionnel dans ma vie professionnelle intense.',
    joinDate: new Date('2024-01-15'),
    preferences: {
      notifications: true,
      dataSharing: false,
      aiInsights: true,
      voiceReminders: false
    },
    wellnessProfile: {
      primaryGoals: ['Réduire le stress', 'Améliorer le sommeil', 'Développer la confiance'],
      stressLevel: 6,
      activityLevel: 8,
      sleepQuality: 5
    },
    stats: {
      totalSessions: 127,
      streak: 15,
      level: 8,
      experience: 2340,
      nextLevelExp: 3000
    }
  });

  const achievements = [
    {
      id: '1',
      title: 'Premier Pas',
      description: 'Première session complétée',
      icon: Star,
      color: 'text-yellow-500',
      unlocked: true,
      date: new Date('2024-01-16')
    },
    {
      id: '2',
      title: 'Constance Hebdomadaire',
      description: '7 jours consécutifs',
      icon: Calendar,
      color: 'text-green-500',
      unlocked: true,
      date: new Date('2024-02-01')
    },
    {
      id: '3',
      title: 'Explorateur Émotionnel',
      description: '50 analyses émotionnelles',
      icon: Brain,
      color: 'text-blue-500',
      unlocked: true,
      date: new Date('2024-03-15')
    },
    {
      id: '4',
      title: 'Maître Zen',
      description: '100 sessions de méditation',
      icon: Heart,
      color: 'text-purple-500',
      unlocked: false,
      progress: 75
    },
    {
      id: '5',
      title: 'Influenceur Bien-être',
      description: 'Inviter 5 amis',
      icon: Award,
      color: 'text-orange-500',
      unlocked: false,
      progress: 20
    }
  ];

  const wellnessGoals = [
    'Réduire le stress',
    'Améliorer le sommeil',
    'Développer la confiance',
    'Gérer l\'anxiété',
    'Augmenter la motivation',
    'Équilibrer vie pro/perso',
    'Améliorer les relations',
    'Développer la créativité'
  ];

  const handleSaveProfile = () => {
    // Simulation sauvegarde
    setIsEditing(false);
    // API call will be implemented when backend is ready
  };

  const togglePreference = (key: keyof typeof profile.preferences) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }));
  };

  const updateWellnessMetric = (metric: keyof typeof profile.wellnessProfile, value: number) => {
    setProfile(prev => ({
      ...prev,
      wellnessProfile: {
        ...prev.wellnessProfile,
        [metric]: value
      }
    }));
  };

  const tabs = [
    { key: 'profile' as const, label: 'Profil', icon: User },
    { key: 'preferences' as const, label: 'Préférences', icon: Settings },
    { key: 'wellness' as const, label: 'Bien-être', icon: Heart },
    { key: 'achievements' as const, label: 'Accomplissements', icon: Award }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête du profil */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 bg-gradient-to-br from-primary to-purple-500">
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-purple-500 text-white">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8" aria-label="Modifier l'avatar">
                <Camera className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
              <p className="text-muted-foreground mb-4">{profile.profession}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Membre depuis {profile.joinDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>{profile.stats.streak} jours consécutifs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Niveau {profile.stats.level}</span>
                </div>
              </div>

              {/* Barre d'expérience */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Expérience</span>
                  <span>{profile.stats.experience}/{profile.stats.nextLevelExp} XP</span>
                </div>
                <Progress value={(profile.stats.experience / profile.stats.nextLevelExp) * 100} className="h-2" />
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'default' : 'outline'}
              className="gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? 'Sauvegarder' : 'Modifier'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation des onglets */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.key)}
            className="gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Onglet Profil */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      disabled={!isEditing}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={profile.profession || ''}
                      disabled={!isEditing}
                      onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={profile.location || ''}
                    disabled={!isEditing}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    disabled={!isEditing}
                    rows={4}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
                
                {isEditing && (
                  <Button onClick={handleSaveProfile} className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder les modifications
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-blue-600">{profile.stats.totalSessions}</div>
                    <div className="text-sm text-muted-foreground">Sessions totales</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-green-600">{profile.stats.streak}</div>
                    <div className="text-sm text-muted-foreground">Jours consécutifs</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-purple-600">{profile.stats.level}</div>
                    <div className="text-sm text-muted-foreground">Niveau actuel</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-yellow-600">{profile.stats.experience}</div>
                    <div className="text-sm text-muted-foreground">Points XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onglet Préférences */}
        {activeTab === 'preferences' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                Préférences & Confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-muted-foreground">Recevoir des rappels et alertes</div>
                    </div>
                  </div>
                  <Button
                    variant={profile.preferences.notifications ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePreference('notifications')}
                  >
                    {profile.preferences.notifications ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium">Insights IA</div>
                      <div className="text-sm text-muted-foreground">Analyses et recommandations personnalisées</div>
                    </div>
                  </div>
                  <Button
                    variant={profile.preferences.aiInsights ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePreference('aiInsights')}
                  >
                    {profile.preferences.aiInsights ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Partage de données</div>
                      <div className="text-sm text-muted-foreground">Contribuer à l'amélioration des algorithmes</div>
                    </div>
                  </div>
                  <Button
                    variant={profile.preferences.dataSharing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePreference('dataSharing')}
                  >
                    {profile.preferences.dataSharing ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Rappels vocaux</div>
                      <div className="text-sm text-muted-foreground">Notifications audio personnalisées</div>
                    </div>
                  </div>
                  <Button
                    variant={profile.preferences.voiceReminders ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePreference('voiceReminders')}
                  >
                    {profile.preferences.voiceReminders ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onglet Bien-être */}
        {activeTab === 'wellness' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Objectifs Principaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wellnessGoals.map((goal) => (
                    <div
                      key={goal}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        profile.wellnessProfile.primaryGoals.includes(goal)
                          ? 'bg-primary/10 border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        const goals = profile.wellnessProfile.primaryGoals.includes(goal)
                          ? profile.wellnessProfile.primaryGoals.filter(g => g !== goal)
                          : [...profile.wellnessProfile.primaryGoals, goal];
                        
                        setProfile(prev => ({
                          ...prev,
                          wellnessProfile: { ...prev.wellnessProfile, primaryGoals: goals }
                        }));
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal}</span>
                        {profile.wellnessProfile.primaryGoals.includes(goal) && (
                          <Badge variant="default" className="text-xs">Sélectionné</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Profil Bien-être
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Niveau de stress</Label>
                    <span className="text-sm font-medium">{profile.wellnessProfile.stressLevel}/10</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Button
                        key={i}
                        variant={i + 1 <= profile.wellnessProfile.stressLevel ? 'default' : 'outline'}
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => updateWellnessMetric('stressLevel', i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Niveau d'activité</Label>
                    <span className="text-sm font-medium">{profile.wellnessProfile.activityLevel}/10</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Button
                        key={i}
                        variant={i + 1 <= profile.wellnessProfile.activityLevel ? 'default' : 'outline'}
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => updateWellnessMetric('activityLevel', i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Qualité du sommeil</Label>
                    <span className="text-sm font-medium">{profile.wellnessProfile.sleepQuality}/10</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Button
                        key={i}
                        variant={i + 1 <= profile.wellnessProfile.sleepQuality ? 'default' : 'outline'}
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => updateWellnessMetric('sleepQuality', i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onglet Accomplissements */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all duration-300 ${
                  achievement.unlocked ? 'bg-gradient-to-br from-background to-primary/5' : 'opacity-60'
                }`}>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                          : 'bg-muted'
                      }`}>
                        <achievement.icon className={`h-8 w-8 ${
                          achievement.unlocked ? achievement.color : 'text-muted-foreground'
                        }`} />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-1">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      
                      {achievement.unlocked ? (
                        <div className="space-y-2">
                          <Badge variant="default" className="text-xs">
                            ✨ Débloqué
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {achievement.date?.toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ) : achievement.progress !== undefined ? (
                        <div className="space-y-2">
                          <Progress value={achievement.progress} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {achievement.progress}% complété
                          </div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Verrouillé
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileManager;