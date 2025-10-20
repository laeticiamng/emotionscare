import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, Activity, Download, Loader2, Camera, Globe, Bell, Lock, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { logger } from '@/lib/logger';

const EnhancedProfileDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    timezone: '',
    language: 'fr',
  });
  const [preferences, setPreferences] = useState({
    theme: 'system',
    notificationsEnabled: true,
    emailNotifications: true,
    soundEnabled: true,
    language: 'fr',
    privacyMode: false,
    dataSharing: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
    loadActivityHistory();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('user-profile', {
        body: { action: 'getProfile' },
      });

      if (error) throw error;

      setProfileData(data);
      if (data.profile) {
        setFormData({
          fullName: data.profile.full_name || '',
          bio: data.profile.bio || '',
          location: data.profile.location || '',
          timezone: data.profile.timezone || '',
          language: data.profile.language || 'fr',
        });
      }
    } catch (error) {
      logger.error('Error loading profile', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le profil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadActivityHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-profile', {
        body: { action: 'getActivityHistory' },
      });

      if (error) throw error;
      setActivityHistory(data.history || []);
    } catch (error) {
      logger.error('Error loading activity history', error as Error, 'UI');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const { data, error } = await supabase.functions.invoke('user-profile', {
        body: {
          action: 'updateProfile',
          profileData: formData,
        },
      });

      if (error) throw error;

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été sauvegardées',
      });

      loadProfile();
    } catch (error) {
      logger.error('Error updating profile', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setSaving(true);
      const { data, error } = await supabase.functions.invoke('user-profile', {
        body: {
          action: 'updatePreferences',
          preferences,
        },
      });

      if (error) throw error;

      toast({
        title: 'Préférences mises à jour',
        description: 'Vos paramètres ont été sauvegardés',
      });
    } catch (error) {
      logger.error('Error updating preferences', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les préférences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('user-profile', {
        body: { action: 'exportData' },
      });

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été téléchargées',
      });
    } catch (error) {
      logger.error('Error exporting data', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exporter les données',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec aura */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              {profileData?.aura && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{formData.fullName || 'Utilisateur'}</CardTitle>
              <CardDescription className="mt-1">{formData.bio || 'Aucune bio'}</CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileData?.stats?.currentStreak || 0}</div>
                  <div className="text-xs text-muted-foreground">jours de suite</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profileData?.stats?.totalActivities || 0}</div>
                  <div className="text-xs text-muted-foreground">activités</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{profileData?.stats?.scanCount || 0}</div>
                  <div className="text-xs text-muted-foreground">scans émotionnels</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="h-4 w-4 mr-2" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activité
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="h-4 w-4 mr-2" />
            Confidentialité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Gérez vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Parlez de vous..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Paris, France"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    placeholder="Europe/Paris"
                  />
                </div>
              </div>

              <Button onClick={handleUpdateProfile} disabled={saving} className="w-full">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Sauvegarder le profil
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de l'application</CardTitle>
              <CardDescription>Personnalisez votre expérience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications</Label>
                  <p className="text-sm text-muted-foreground">Recevoir des notifications push</p>
                </div>
                <Switch
                  checked={preferences.notificationsEnabled}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, notificationsEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir des emails</p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sons</Label>
                  <p className="text-sm text-muted-foreground">Activer les sons de l'application</p>
                </div>
                <Switch
                  checked={preferences.soundEnabled}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, soundEnabled: checked })}
                />
              </div>

              <Button onClick={handleUpdatePreferences} disabled={saving} className="w-full">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Sauvegarder les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique d'activité</CardTitle>
              <CardDescription>Vos 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scans" fill="hsl(var(--primary))" name="Scans" />
                  <Bar dataKey="breathing" fill="hsl(var(--chart-2))" name="Respiration" />
                  <Bar dataKey="journals" fill="hsl(var(--chart-3))" name="Journal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confidentialité et données</CardTitle>
              <CardDescription>Gérez vos données personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode privé</Label>
                  <p className="text-sm text-muted-foreground">Masquer votre profil</p>
                </div>
                <Switch
                  checked={preferences.privacyMode}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, privacyMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Partage de données</Label>
                  <p className="text-sm text-muted-foreground">Pour améliorer l'expérience</p>
                </div>
                <Switch
                  checked={preferences.dataSharing}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, dataSharing: checked })}
                />
              </div>

              <div className="pt-4 border-t">
                <Button onClick={handleExportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter mes données (RGPD)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProfileDashboard;
