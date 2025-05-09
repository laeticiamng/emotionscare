
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Bell, Palette, Shield, Key, Music, Eye, Clock, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserPreferences } from '@/types';
import PreferencesForm from '@/components/preferences/PreferencesForm';
import { SecureConfirmationDialog } from '@/components/ui/secure-confirmation-dialog';
import { useNavigate } from 'react-router-dom';
import useAudioPreferences from '@/hooks/useAudioPreferences';
import useThemeColors from '@/hooks/useThemeColors';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'light',
    notifications_enabled: true,
    font_size: 'medium',
    language: 'fr',
  });
  
  const { user, logout, updateUser } = useAuth();
  const { setThemePreference } = useTheme();
  const { preferences: audioPrefs, setVolume, setAutoplay, toggleEqualizer } = useAudioPreferences();
  const { colors, wellness } = useThemeColors();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user preferences from user object if available
    if (user?.preferences) {
      setUserPreferences(user.preferences);
    }
  }, [user]);

  const handleSavePreferences = async (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    
    // Update theme context
    setThemePreference(preferences.theme);
    
    // If user exists and updateUser function is available
    if (user && updateUser) {
      // Update user object with new preferences
      await updateUser({
        ...user,
        preferences,
      });
    }
    
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences ont été mises à jour avec succès.",
    });
  };

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate('/login');
    } else {
      // Fallback if logout function is not available
      window.location.href = '/login';
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteDialogOpen(false);
    
    // Here you would normally call an API to delete the user's account
    toast({
      title: "Compte supprimé",
      description: "Votre compte a été supprimé avec succès.",
      variant: "destructive",
    });
    
    // Redirect to login page
    setTimeout(() => {
      if (logout) logout();
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col gap-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">
            Personnalisez votre expérience EmotionsCare selon vos préférences
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Identité</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Ambiance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Accessibilité</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Données</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Rappels</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Identité */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>Gérez vos informations de profil et vos préférences d'identité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Card */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary flex items-center justify-center text-2xl font-bold">
                        {user?.name?.[0] || user?.email?.[0] || "U"}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">
                          {user?.name || user?.email?.split('@')[0] || "Utilisateur"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user?.email || "Aucun email"}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nom complet</label>
                        <input 
                          type="text" 
                          className="w-full rounded-md border border-input p-2" 
                          defaultValue={user?.name || ""} 
                          placeholder="Votre nom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Pronom préféré</label>
                        <select className="w-full rounded-md border border-input p-2">
                          <option>Il / Lui</option>
                          <option>Elle / Elle</option>
                          <option>Iel / Ellui</option>
                          <option>Autre / Neutre</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio Card */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Biographie</label>
                      <textarea 
                        className="w-full h-32 rounded-md border border-input p-2" 
                        placeholder="Comment souhaitez-vous qu'on vous accueille ici ?"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Langue préférée</label>
                      <select className="w-full rounded-md border border-input p-2">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les modifications</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Apparence */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Apparence & Thème</CardTitle>
                <CardDescription>Personnalisez l'apparence visuelle de l'application</CardDescription>
              </CardHeader>
              <CardContent>
                <PreferencesForm 
                  preferences={userPreferences} 
                  onSave={handleSavePreferences} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Ambiance Sonore */}
          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ambiance Sonore</CardTitle>
                <CardDescription>Personnalisez votre expérience audio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume général</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue={audioPrefs.volume * 100}
                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Lecture continue</label>
                    <p className="text-xs text-muted-foreground">Continuer la lecture audio entre les pages</p>
                  </div>
                  <div>
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={audioPrefs.autoplay}
                      onChange={(e) => setAutoplay(e.target.checked)} 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Égaliseur audio</label>
                    <p className="text-xs text-muted-foreground">Ajustez le son selon vos préférences</p>
                  </div>
                  <div>
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={audioPrefs.equalizerEnabled}
                      onChange={(e) => toggleEqualizer(e.target.checked)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bruit blanc</label>
                  <select className="w-full rounded-md border border-input p-2">
                    <option value="none">Aucun</option>
                    <option value="rain">Pluie</option>
                    <option value="fire">Feu de cheminée</option>
                    <option value="waves">Vagues</option>
                    <option value="forest">Forêt</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Ambiance immersive permanente</label>
                    <p className="text-xs text-muted-foreground">Garder un fond sonore sur toutes les pages</p>
                  </div>
                  <div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les modifications</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications & Rappels</CardTitle>
                <CardDescription>Gérez comment et quand vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="font-medium">Rappels de journal</label>
                      <p className="text-sm text-muted-foreground">Recevez un rappel pour écrire dans votre journal</p>
                    </div>
                    <div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="font-medium">Rappels de respiration</label>
                      <p className="text-sm text-muted-foreground">Recevez un rappel pour prendre un moment de respiration</p>
                    </div>
                    <div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="font-medium">Suggestions musicales</label>
                      <p className="text-sm text-muted-foreground">Recevez des suggestions de musique adaptées à votre humeur</p>
                    </div>
                    <div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="font-medium">Notifications par email</label>
                      <p className="text-sm text-muted-foreground">Recevez des résumés hebdomadaires par email</p>
                    </div>
                    <div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <label className="block font-medium">Style de notification</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border rounded-md p-3 cursor-pointer hover:bg-accent">
                      <h4 className="font-medium">Douce</h4>
                      <p className="text-xs text-muted-foreground">Notifications calmes et discrètes</p>
                    </div>
                    <div className="border rounded-md p-3 cursor-pointer hover:bg-accent">
                      <h4 className="font-medium">Motivante</h4>
                      <p className="text-xs text-muted-foreground">Encouragements positifs</p>
                    </div>
                    <div className="border rounded-md p-3 cursor-pointer hover:bg-accent">
                      <h4 className="font-medium">Silencieuse</h4>
                      <p className="text-xs text-muted-foreground">Visuelles uniquement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Accessibilité */}
          <TabsContent value="accessibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Accessibilité & Confort</CardTitle>
                <CardDescription>Paramètres d'accessibilité et de confort cognitif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Taille du texte</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs">A-</Button>
                    <input type="range" min="1" max="3" defaultValue="2" className="flex-1" />
                    <Button variant="outline" size="sm" className="text-lg">A+</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Contraste renforcé</label>
                    <p className="text-xs text-muted-foreground">Améliore la lisibilité des textes</p>
                  </div>
                  <div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Réduction des animations</label>
                    <p className="text-xs text-muted-foreground">Mode zen avec animations minimales</p>
                  </div>
                  <div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Interface audio-guidée</label>
                    <p className="text-xs text-muted-foreground">Navigation par description audio</p>
                  </div>
                  <div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vitesse d'interaction</label>
                  <select className="w-full rounded-md border border-input p-2">
                    <option value="slow">Lente</option>
                    <option value="normal" selected>Normale</option>
                    <option value="fast">Rapide</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Ajuste la vitesse de transition et animations</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Sécurité */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>Renforcez la protection de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Changer le mot de passe</label>
                    <input
                      type="password"
                      placeholder="Mot de passe actuel"
                      className="w-full rounded-md border border-input p-2"
                    />
                  </div>
                  <div className="grid gap-2">
                    <input
                      type="password"
                      placeholder="Nouveau mot de passe"
                      className="w-full rounded-md border border-input p-2"
                    />
                  </div>
                  <div className="grid gap-2">
                    <input
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      className="w-full rounded-md border border-input p-2"
                    />
                    <Button className="w-full sm:w-auto">
                      <Key className="mr-2 h-4 w-4" />
                      Mettre à jour le mot de passe
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Authentification à deux facteurs</label>
                      <p className="text-xs text-muted-foreground">Ajoute une couche de sécurité supplémentaire</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Configurer</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Verrouiller mes journaux</label>
                      <p className="text-xs text-muted-foreground">Protéger avec code ou biométrie</p>
                    </div>
                    <div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Historique des connexions</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <div className="text-xs p-2 border rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">Paris, France</span>
                        <span className="text-muted-foreground">Aujourd'hui 14:32</span>
                      </div>
                      <div className="text-muted-foreground">Chrome sur Windows</div>
                    </div>
                    <div className="text-xs p-2 border rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">Lyon, France</span>
                        <span className="text-muted-foreground">Hier 10:15</span>
                      </div>
                      <div className="text-muted-foreground">Safari sur iPhone</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zone de danger</CardTitle>
                <CardDescription>Actions irréversibles qui affectent votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Déconnexion</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Déconnectez-vous de votre compte sur cet appareil.
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-1">Supprimer le compte</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Supprimer définitivement votre compte et toutes vos données.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Données */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Données émotionnelles</CardTitle>
                <CardDescription>Gérez vos données émotionnelles et les analyses IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-medium mb-1">Résumé de vos données</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="text-center p-3 bg-background rounded shadow-sm">
                      <p className="text-2xl font-bold">16</p>
                      <p className="text-xs text-muted-foreground">Entrées journal</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded shadow-sm">
                      <p className="text-2xl font-bold">42</p>
                      <p className="text-xs text-muted-foreground">Émotions scannées</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded shadow-sm">
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-xs text-muted-foreground">Sessions coach</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded shadow-sm">
                      <p className="text-2xl font-bold">3h</p>
                      <p className="text-xs text-muted-foreground">Temps d'écoute</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Exporter mes données</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">PDF</Button>
                      <Button variant="outline" size="sm">JSON</Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Téléchargez toutes vos données dans le format de votre choix
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="font-medium">Mode incognito</h3>
                      <p className="text-xs text-muted-foreground">Aucune donnée stockée pendant la session</p>
                    </div>
                    <div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <h3 className="font-medium">Réinitialiser mes données IA</h3>
                  <p className="text-xs text-muted-foreground">
                    Effacer toutes les données d'apprentissage de l'IA et repartir de zéro
                  </p>
                  <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                    Réinitialiser l'IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rappels */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Planification des rappels</CardTitle>
                <CardDescription>Programmez vos rappels et routines émotionnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Rappel quotidien principal</label>
                    <input 
                      type="time" 
                      defaultValue="09:00"
                      className="w-full rounded-md border border-input p-2" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recevez un rappel quotidien à l'heure spécifiée
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium block">Fréquence des rappels</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">Quotidien</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Hebdomadaire</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Flexible</Button>
                      <Button variant="outline" size="sm" className="rounded-full">Personnalisé</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Journées actives</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                      <div key={day} className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer">
                          {day}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <label className="font-medium">Rituel de respiration</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chaque matin, 3 minutes</span>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium">Journal du soir</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chaque soir à 21:00</span>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium">Semaine émotionnelle</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Résumé chaque dimanche</span>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Enregistrer les préférences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <SecureConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Supprimer votre compte"
        description="Cette action est irréversible. Toutes vos données personnelles, journaux, analyses et préférences seront définitivement supprimés."
        actionLabel="Supprimer mon compte"
        confirmationWord="SUPPRIMER"
        isDestructive={true}
      />
    </div>
  );
};

export default SettingsPage;
