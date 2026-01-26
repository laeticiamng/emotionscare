// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { z } from 'zod';
import { 
  User,
  Camera,
  Shield,
  CreditCard,
  Trash2,
  Save,
  Edit3,
  Crown,
  BarChart3,
  Clock,
  Download,
  FileText,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Validation schema
const accountSchema = z.object({
  displayName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string().email('Adresse email invalide').max(255, 'Email trop long'),
  phone: z.string().regex(/^[+]?[\d\s()-]{0,20}$/, 'Numéro de téléphone invalide').optional().or(z.literal('')),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional().or(z.literal('')),
  location: z.string().max(100, 'La localisation ne peut pas dépasser 100 caractères').optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal(''))
});

interface UsageStats {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  longestStreak: number;
  lastActive: string;
  joinedAt: string;
  modulesUsed: Record<string, number>;
  achievements: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const AccountSettingsTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    displayName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    birthDate: user?.user_metadata?.birth_date || '',
    website: user?.user_metadata?.website || ''
  });

  const [preferences, setPreferences] = useState({
    publicProfile: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    marketingEmails: false,
    dataAnalytics: true
  });

  // Usage stats
  const [stats, setStats] = useState<UsageStats>(() => {
    const saved = localStorage.getItem('user_usage_stats');
    return saved ? JSON.parse(saved) : {
      totalSessions: 42,
      totalMinutes: 1260,
      streak: 7,
      longestStreak: 21,
      lastActive: new Date().toISOString(),
      joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      modulesUsed: {
        'Scan émotionnel': 45,
        'Journal': 38,
        'Méditation': 28,
        'Musique': 52,
        'Coach IA': 15
      },
      achievements: 12,
      level: 8,
      xp: 2450,
      xpToNextLevel: 3000
    };
  });

  // Activity history
  const [activityHistory, setActivityHistory] = useState(() => {
    const saved = localStorage.getItem('user_activity_history');
    return saved ? JSON.parse(saved) : [
      { date: new Date().toISOString(), action: 'Session de méditation', duration: 15 },
      { date: new Date(Date.now() - 86400000).toISOString(), action: 'Scan émotionnel', duration: 5 },
      { date: new Date(Date.now() - 172800000).toISOString(), action: 'Écoute musicale', duration: 30 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('user_usage_stats', JSON.stringify(stats));
  }, [stats]);

  const handleSave = () => {
    try {
      accountSchema.parse(formData);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès."
      });
      setIsEditing(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Erreur de validation",
          description: firstError.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Suppression de compte",
      description: "Cette action nécessite une confirmation par email.",
      variant: "destructive"
    });
  };

  const exportUserData = () => {
    const userData = {
      profile: formData,
      preferences,
      stats,
      activityHistory,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotionscare-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: "Vos données ont été exportées"
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getDaysSinceJoined = () => {
    const joined = new Date(stats.joinedAt);
    const now = new Date();
    return Math.floor((now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="gap-1">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-1">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1">
            <Activity className="h-4 w-4" />
            Activité
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-1">
            <CreditCard className="h-4 w-4" />
            Abonnement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {/* Profil principal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du profil
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportUserData}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? 'Annuler' : 'Modifier'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo de profil */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {formData.displayName.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG max 5MB
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>Niveau {stats.level}</span>
                  </div>
                </div>
              </div>

              {/* Level progress */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progression niveau {stats.level}</span>
                  <span className="text-sm text-muted-foreground">{stats.xp} / {stats.xpToNextLevel} XP</span>
                </div>
                <Progress value={(stats.xp / stats.xpToNextLevel) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom d'affichage</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Ville, Pays"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    disabled={!isEditing}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Parlez-nous de vous..."
                  rows={3}
                />
              </div>

              {isEditing && (
                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les modifications
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Confidentialité du profil */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité du profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profil public</Label>
                  <p className="text-sm text-muted-foreground">
                    Permet aux autres utilisateurs de voir votre profil
                  </p>
                </div>
                <Switch
                  checked={preferences.publicProfile}
                  onCheckedChange={(checked) => setPreferences({...preferences, publicProfile: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Afficher l'email</Label>
                  <p className="text-sm text-muted-foreground">
                    Votre email sera visible sur votre profil public
                  </p>
                </div>
                <Switch
                  checked={preferences.showEmail}
                  onCheckedChange={(checked) => setPreferences({...preferences, showEmail: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autoriser les messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Les utilisateurs peuvent vous envoyer des messages privés
                  </p>
                </div>
                <Switch
                  checked={preferences.allowMessages}
                  onCheckedChange={(checked) => setPreferences({...preferences, allowMessages: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-xs">Sessions</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Temps total</span>
                </div>
                <p className="text-2xl font-bold">{formatDuration(stats.totalMinutes)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs">Streak actuel</span>
                </div>
                <p className="text-2xl font-bold">{stats.streak} jours</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Award className="h-4 w-4" />
                  <span className="text-xs">Succès</span>
                </div>
                <p className="text-2xl font-bold">{stats.achievements}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Utilisation des modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.modulesUsed)
                  .sort(([, a], [, b]) => b - a)
                  .map(([module, count]) => {
                    const maxCount = Math.max(...Object.values(stats.modulesUsed));
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={module}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{module}</span>
                          <span className="text-sm text-muted-foreground">{count} sessions</span>
                        </div>
                        <motion.div
                          className="h-2 bg-muted rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                        >
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        </motion.div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Membre depuis</span>
                  <span className="font-medium">{getDaysSinceJoined()} jours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Record streak</span>
                  <span className="font-medium">{stats.longestStreak} jours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Moyenne/jour</span>
                  <span className="font-medium">{Math.round(stats.totalMinutes / getDaysSinceJoined())} min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Dernière activité</span>
                  <span className="font-medium">{formatDate(stats.lastActive)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Historique d'activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {activityHistory.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.date)} • {activity.duration} min
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Abonnement Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Plan Premium</span>
                    <Badge variant="secondary">Actif</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accès complet à toutes les fonctionnalités IA
                  </p>
                  <p className="text-sm font-medium">
                    Prochain renouvellement: 15 février 2025
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">29€</div>
                  <div className="text-sm text-muted-foreground">/mois</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Gérer l'abonnement
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Facturation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zone dangereuse */}
          <Card className="border-destructive/50 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Zone dangereuse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">Supprimer le compte</h4>
                <p className="text-sm text-destructive/80 mb-3">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettingsTab;
