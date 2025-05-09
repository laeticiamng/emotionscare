
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Bell, Palette, Shield, Key, Music, Eye, Clock, Database,
  HeartHandshake, Sparkles, UserCircle, Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SecureConfirmationDialog } from '@/components/ui/secure-confirmation-dialog';
import { useNavigate } from 'react-router-dom';
import useAudioPreferences from '@/hooks/useAudioPreferences';
import useThemeColors from '@/hooks/useThemeColors';
import useUserPreferences from '@/hooks/useUserPreferences';

// Import des composants de paramètres
import ThemeSettingsForm from '@/components/preferences/ThemeSettingsForm';
import NotificationPreferences from '@/components/preferences/NotificationPreferences';
import AccessibilitySettings from '@/components/preferences/AccessibilitySettings';
import DataPrivacySettings from '@/components/preferences/DataPrivacySettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import PremiumFeatures from '@/components/preferences/PremiumFeatures';
import IdentitySettings from '@/components/preferences/IdentitySettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('identity');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { theme, setThemePreference } = useTheme();
  const { preferences: audioPrefs } = useAudioPreferences();
  const { colors, wellness } = useThemeColors();
  const { preferences, updatePreferences } = useUserPreferences();
  
  const { toast } = useToast();
  const navigate = useNavigate();

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
          <div className="relative overflow-auto">
            <TabsList className="flex mb-8 w-full justify-start overflow-x-auto pb-1">
              <TabsTrigger value="identity" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                <span className="whitespace-nowrap">Identité</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="whitespace-nowrap">Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="whitespace-nowrap">Ambiance</span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="whitespace-nowrap">Accessibilité</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="whitespace-nowrap">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="whitespace-nowrap">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="whitespace-nowrap">Données</span>
              </TabsTrigger>
              <TabsTrigger value="premium" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="whitespace-nowrap">Premium</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Identité */}
          <TabsContent value="identity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>Gérez vos informations de profil et vos préférences d'identité</CardDescription>
              </CardHeader>
              <div className="p-6">
                <IdentitySettings />
              </div>
            </Card>
          </TabsContent>
          
          {/* Apparence */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Apparence & Thème</CardTitle>
                <CardDescription>Personnalisez l'apparence visuelle de l'application</CardDescription>
              </CardHeader>
              <div className="p-6">
                <ThemeSettingsForm />
              </div>
            </Card>
          </TabsContent>
          
          {/* Ambiance Sonore */}
          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ambiance Sonore</CardTitle>
                <CardDescription>Personnalisez votre expérience audio</CardDescription>
              </CardHeader>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Volume général</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue={audioPrefs.volume * 100}
                    onChange={(e) => audioPrefs.setVolume(Number(e.target.value) / 100)}
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
                      onChange={(e) => audioPrefs.setAutoplay(e.target.checked)} 
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
                      onChange={(e) => audioPrefs.toggleEqualizer(e.target.checked)} 
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Presets d'égaliseur</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(audioPrefs.equalizerPresets).map((preset) => (
                      <div 
                        key={preset} 
                        className={`border rounded-lg p-2 text-center cursor-pointer 
                          ${audioPrefs.currentEqualizer === preset ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
                        onClick={() => audioPrefs.setEqualizerPreset(preset)}
                      >
                        <span className="capitalize">{preset}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Accessibilité */}
          <TabsContent value="accessibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Accessibilité & Confort</CardTitle>
                <CardDescription>Paramètres d'accessibilité et de confort cognitif</CardDescription>
              </CardHeader>
              <div className="p-6">
                <AccessibilitySettings />
              </div>
            </Card>
          </TabsContent>
          
          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications & Rappels</CardTitle>
                <CardDescription>Gérez comment et quand vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <div className="p-6">
                <NotificationPreferences />
              </div>
            </Card>
          </TabsContent>
          
          {/* Sécurité */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>Renforcez la protection de votre compte</CardDescription>
              </CardHeader>
              <div className="p-6">
                <SecuritySettings />
              </div>
            </Card>
            
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zone de danger</CardTitle>
                <CardDescription>Actions irréversibles qui affectent votre compte</CardDescription>
              </CardHeader>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-1">Déconnexion</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Déconnectez-vous de votre compte sur cet appareil.
                  </p>
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive text-destructive hover:bg-destructive/10 h-10 px-4 py-2"
                    onClick={handleLogout}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out mr-2 h-4 w-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Déconnexion
                  </button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-1">Supprimer le compte</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Supprimer définitivement votre compte et toutes vos données.
                  </p>
                  <button 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Données */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Données émotionnelles</CardTitle>
                <CardDescription>Gérez vos données émotionnelles et les analyses IA</CardDescription>
              </CardHeader>
              <div className="p-6">
                <DataPrivacySettings />
              </div>
            </Card>
          </TabsContent>
          
          {/* Premium */}
          <TabsContent value="premium" className="space-y-4">
            <PremiumFeatures />
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
