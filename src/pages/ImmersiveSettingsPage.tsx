
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import useAudioPreferences from '@/hooks/useAudioPreferences';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Import Icons
import { 
  UserCircle, 
  Shield, 
  Palette, 
  Music, 
  Eye, 
  Bell, 
  Database,
  Sparkles,
  Lock,
  Moon,
  SunMedium,
  CloudRain,
  Trees,
  Heart,
  Save,
  RefreshCcw,
  Upload,
  Volume2,
  Volume1,
  VolumeX
} from 'lucide-react';

// Background images
const backgroundOptions = [
  { name: 'Stars', url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=1920' },
  { name: 'Forest', url: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1920' },
  { name: 'Mountains', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920' },
  { name: 'Ocean', url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1920' },
];

const ImmersiveSettingsPage = () => {
  const { theme, setThemePreference, dynamicThemeMode, setDynamicThemeMode } = useTheme();
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  const audioPrefs = useAudioPreferences();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('identity');
  const [backgroundImage, setBackgroundImage] = useState(backgroundOptions[0].url);
  const [avatarUrl, setAvatarUrl] = useState(preferences.avatarUrl || '');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Handle background change effect
  useEffect(() => {
    if (preferences.customBackground) {
      setBackgroundImage(preferences.customBackground);
    }
  }, [preferences.customBackground]);
  
  // Preview avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  // Save settings
  const handleSaveSettings = async () => {
    // In a real app, you would upload the avatar file to storage here
    // and get back a URL to store in preferences
    
    const updatedPreferences = {
      ...preferences,
      avatarUrl: previewUrl || avatarUrl,
      customBackground: backgroundImage,
    };
    
    const success = await updatePreferences(updatedPreferences);
    
    if (success) {
      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences ont été sauvegardées avec succès.",
      });
    }
  };
  
  // Change background
  const changeBackground = (url: string) => {
    setBackgroundImage(url);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <div 
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 backdrop-blur-sm z-0" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">Votre Sanctuaire Intérieur</h1>
          <p className="text-lg text-white/80 max-w-lg mx-auto">
            Personnalisez votre espace EmotionsCare pour qu'il reflète exactement votre état intérieur
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div 
            className="lg:w-1/4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-xl">
              <CardContent className="p-4">
                <TabsList className="flex flex-col w-full gap-2 bg-transparent">
                  <TabsTrigger 
                    value="identity" 
                    onClick={() => setActiveTab('identity')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'identity' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <UserCircle size={18} />
                    <span>Identité</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="security" 
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'security' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <Shield size={18} />
                    <span>Sécurité</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="appearance" 
                    onClick={() => setActiveTab('appearance')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'appearance' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <Palette size={18} />
                    <span>Apparence</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="audio" 
                    onClick={() => setActiveTab('audio')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'audio' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <Music size={18} />
                    <span>Ambiance sonore</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="accessibility" 
                    onClick={() => setActiveTab('accessibility')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'accessibility' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <Eye size={18} />
                    <span>Accessibilité</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="notifications" 
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'notifications' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="data" 
                    onClick={() => setActiveTab('data')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'data' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <Database size={18} />
                    <span>Données & IA</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="premium" 
                    onClick={() => setActiveTab('premium')}
                    className={`flex items-center gap-2 justify-start px-4 py-3 text-left ${activeTab === 'premium' ? 'bg-white/30 text-primary' : 'text-white'}`}
                  >
                    <Sparkles size={18} />
                    <span>Premium</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-6 pt-6 border-t border-white/20">
                  <Button 
                    variant="outline" 
                    className="w-full mb-2 bg-white/20 backdrop-blur-sm text-white border-white/40 hover:bg-white/30"
                    onClick={handleSaveSettings}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full text-white/70 hover:text-white hover:bg-white/10"
                    onClick={resetPreferences}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Content area */}
          <motion.div 
            className="lg:w-3/4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/20 backdrop-blur-xl border-white/30 shadow-xl">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                  {/* Identity Tab */}
                  <TabsContent value="identity" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Votre Identité Intérieure</h2>
                        <p className="text-white/70">Définissez comment vous souhaitez apparaître et être perçu</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="flex flex-col items-center mb-8">
                          <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src={previewUrl || avatarUrl} alt="Avatar" />
                            <AvatarFallback className="bg-primary/20 text-white">
                              {preferences.displayName?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/40 text-white">
                            <Upload className="mr-2 h-4 w-4" />
                            <label htmlFor="avatar-upload" className="cursor-pointer">
                              Choisir une image
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                              />
                            </label>
                          </Button>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="display-name" className="text-white">Nom affiché</Label>
                            <Input 
                              id="display-name" 
                              value={preferences.displayName || ''} 
                              onChange={(e) => updatePreferences({ displayName: e.target.value })}
                              className="bg-white/20 border-white/40 text-white placeholder:text-white/50"
                              placeholder="Comment souhaitez-vous être appelé?"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="pronouns" className="text-white">Pronoms</Label>
                            <Select 
                              value={preferences.pronouns || 'autre'}
                              onValueChange={(value) => updatePreferences({ pronouns: value as 'il' | 'elle' | 'iel' | 'autre' })}
                            >
                              <SelectTrigger id="pronouns" className="bg-white/20 border-white/40 text-white">
                                <SelectValue placeholder="Choisir vos pronoms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="il">Il (He/Him)</SelectItem>
                                <SelectItem value="elle">Elle (She/Her)</SelectItem>
                                <SelectItem value="iel">Iel (They/Them)</SelectItem>
                                <SelectItem value="autre">Autre/Préfère ne pas préciser</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-2">
                          <Label htmlFor="biography" className="text-white">Biographie intérieure</Label>
                          <Textarea 
                            id="biography" 
                            value={preferences.biography || ''} 
                            onChange={(e) => updatePreferences({ biography: e.target.value })}
                            placeholder="Comment souhaitez-vous qu'on vous parle ici?"
                            className="bg-white/20 border-white/40 text-white placeholder:text-white/50 min-h-[100px]"
                          />
                          <p className="text-sm text-white/70">
                            Ce texte aide l'assistant IA à mieux s'adapter à vos préférences de communication
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                  
                  {/* Security Tab */}
                  <TabsContent value="security" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Sécurité Émotionnelle</h2>
                        <p className="text-white/70">Protégez votre espace intérieur et vos données sensibles</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="space-y-6">
                        <Card className="bg-white/30 border-white/20">
                          <CardHeader>
                            <CardTitle className="text-white">Authentification</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/40 text-white">
                                Changer le mot de passe
                              </Button>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-white">Double authentification</p>
                                  <p className="text-sm text-white/70">Protection renforcée de votre compte</p>
                                </div>
                                <Switch
                                  checked={false}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white/30 border-white/20">
                          <CardHeader>
                            <CardTitle className="text-white">Protection des données sensibles</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-white">Verrouillage biométrique</p>
                                <p className="text-sm text-white/70">Demander Touch ID/Face ID pour accéder aux notes sensibles</p>
                              </div>
                              <Switch 
                                checked={false}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-white">Espace intime</p>
                                <p className="text-sm text-white/70">Masquer automatiquement les entrées sensibles</p>
                              </div>
                              <Switch 
                                checked={preferences.lockJournals || false}
                                onCheckedChange={(checked) => updatePreferences({ lockJournals: checked })}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-white/30 border-white/20">
                          <CardHeader>
                            <CardTitle className="text-white">Réinitialisation</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-white/70">
                                Cette option efface toutes vos données émotionnelles et recommence à zéro. 
                                Un rituel de clôture émotionnelle sera proposé avant la suppression.
                              </p>
                              
                              <Button variant="destructive" className="bg-red-500/80 hover:bg-red-600/80">
                                J'efface tout et je recommence
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                  
                  {/* Appearance Tab */}
                  <TabsContent value="appearance" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Apparence & Ambiance</h2>
                        <p className="text-white/70">Adaptez l'environnement visuel à votre état intérieur</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-8">
                          <Label className="text-white text-lg">Thème</Label>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${theme === 'light' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => setThemePreference('light')}
                            >
                              <div className="flex flex-col items-center text-white">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/80 flex items-center justify-center mb-3">
                                  <SunMedium size={24} className="text-white" />
                                </div>
                                <span>Clair Pur</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${theme === 'dark' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => setThemePreference('dark')}
                            >
                              <div className="flex flex-col items-center text-white">
                                <div className="w-12 h-12 rounded-full bg-indigo-900/80 flex items-center justify-center mb-3">
                                  <Moon size={24} className="text-white" />
                                </div>
                                <span>Nuit Étoilée</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${theme === 'pastel' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => setThemePreference('pastel')}
                            >
                              <div className="flex flex-col items-center text-white">
                                <div className="w-12 h-12 rounded-full bg-pink-300/80 flex items-center justify-center mb-3">
                                  <Heart size={24} className="text-white" />
                                </div>
                                <span>Pastel-Lumière</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${theme === 'nature' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => setThemePreference('nature')}
                            >
                              <div className="flex flex-col items-center text-white">
                                <div className="w-12 h-12 rounded-full bg-green-600/80 flex items-center justify-center mb-3">
                                  <Trees size={24} className="text-white" />
                                </div>
                                <span>Nature Vibrante</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${theme === 'misty' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => setThemePreference('misty')}
                            >
                              <div className="flex flex-col items-center text-white">
                                <div className="w-12 h-12 rounded-full bg-blue-400/80 flex items-center justify-center mb-3">
                                  <CloudRain size={24} className="text-white" />
                                </div>
                                <span>Brume Bleue</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-8">
                          <Label className="text-white text-lg">Thème dynamique</Label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                              <div>
                                <p className="font-medium text-white">Adaptation horaire</p>
                                <p className="text-sm text-white/70">Changer de thème selon l'heure de la journée</p>
                              </div>
                              <Switch 
                                checked={dynamicThemeMode === 'time'}
                                onCheckedChange={(checked) => setDynamicThemeMode(checked ? 'time' : 'none')}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                              <div>
                                <p className="font-medium text-white">Adaptation émotionnelle</p>
                                <p className="text-sm text-white/70">Thème basé sur votre humeur actuelle</p>
                              </div>
                              <Switch 
                                checked={dynamicThemeMode === 'emotion'}
                                onCheckedChange={(checked) => setDynamicThemeMode(checked ? 'emotion' : 'none')}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4">
                          <Label className="text-white text-lg">Arrière-plan</Label>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {backgroundOptions.map((bg) => (
                              <div 
                                key={bg.name} 
                                className={`h-24 rounded-lg cursor-pointer overflow-hidden transition-all ${backgroundImage === bg.url ? 'ring-4 ring-primary' : 'opacity-80 hover:opacity-100'}`}
                                onClick={() => changeBackground(bg.url)}
                              >
                                <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                          
                          <p className="text-sm text-white/70 mt-2">
                            Ces arrière-plans aident à créer une ambiance correspondant à votre état d'esprit
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                  
                  {/* Audio Tab */}
                  <TabsContent value="audio" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Ambiance Sonore</h2>
                        <p className="text-white/70">Personnalisez l'expérience audio de votre espace</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-8">
                          <Label className="text-white text-lg">Volume général</Label>
                          
                          <div className="flex items-center gap-4">
                            <VolumeX className="text-white" />
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              defaultValue={audioPrefs.preferences.volume * 100} 
                              onChange={(e) => audioPrefs.setVolume(Number(e.target.value) / 100)}
                              className="w-full"
                            />
                            <Volume2 className="text-white" />
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-8">
                          <Label className="text-white text-lg">Ambiance sonore durant la navigation</Label>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center bg-white/20 rounded-lg p-4 cursor-pointer transition-all hover:bg-white/30">
                              <VolumeX className="h-8 w-8 mb-2 text-white" />
                              <span className="text-white">Silence conscient</span>
                            </div>
                            
                            <div className="flex flex-col items-center bg-white/20 rounded-lg p-4 cursor-pointer transition-all hover:bg-white/30">
                              <Music className="h-8 w-8 mb-2 text-white" />
                              <span className="text-white">Piano doux</span>
                            </div>
                            
                            <div className="flex flex-col items-center bg-white/20 rounded-lg p-4 cursor-pointer transition-all hover:bg-white/30">
                              <Trees className="h-8 w-8 mb-2 text-white" />
                              <span className="text-white">Sons de nature</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                            <div>
                              <p className="font-medium text-white">Mix adaptatif</p>
                              <p className="text-sm text-white/70">
                                Ajuster automatiquement l'ambiance sonore selon votre navigation
                              </p>
                            </div>
                            <Switch 
                              checked={audioPrefs.preferences.autoplay}
                              onCheckedChange={audioPrefs.setAutoplay}
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                            <div>
                              <p className="font-medium text-white">Équaliseur audio</p>
                              <p className="text-sm text-white/70">Activer l'équaliseur pour une expérience optimisée</p>
                            </div>
                            <Switch 
                              checked={audioPrefs.preferences.equalizerEnabled}
                              onCheckedChange={audioPrefs.toggleEqualizer}
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                  
                  {/* Accessibility Tab */}
                  <TabsContent value="accessibility" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Accessibilité</h2>
                        <p className="text-white/70">Adaptez l'interface à vos besoins visuels et cognitifs</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-8">
                          <Label className="text-white text-lg">Typographie</Label>
                          
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="font-family" className="text-white">Police d'écriture</Label>
                              <Select 
                                value={preferences.font || 'inter'}
                                onValueChange={(value) => updatePreferences({ font: value as FontFamily })}
                              >
                                <SelectTrigger id="font-family" className="bg-white/20 border-white/40 text-white">
                                  <SelectValue placeholder="Choisir une police" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="inter">Inter (par défaut)</SelectItem>
                                  <SelectItem value="dm-sans">DM Sans</SelectItem>
                                  <SelectItem value="atkinson">Atkinson Hyperlegible</SelectItem>
                                  <SelectItem value="serif">Serif</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="font-size" className="text-white">Taille du texte</Label>
                              <Select 
                                value={preferences.fontSize}
                                onValueChange={(value) => updatePreferences({ fontSize: value as FontSize })}
                              >
                                <SelectTrigger id="font-size" className="bg-white/20 border-white/40 text-white">
                                  <SelectValue placeholder="Choisir une taille" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">Petite</SelectItem>
                                  <SelectItem value="medium">Moyenne</SelectItem>
                                  <SelectItem value="large">Grande</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <div className="p-4 mt-2 bg-white/20 rounded-lg">
                                <p className={`text-white ${
                                  preferences.fontSize === 'small' ? 'text-sm' : 
                                  preferences.fontSize === 'large' ? 'text-xl' : 'text-base'
                                }`}>
                                  Exemple de texte avec cette taille
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4">
                          <Label className="text-white text-lg">Options d'accessibilité</Label>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                              <div>
                                <p className="font-medium text-white">Contraste élevé</p>
                                <p className="text-sm text-white/70">Augmenter le contraste pour améliorer la lisibilité</p>
                              </div>
                              <Switch 
                                checked={preferences.highContrast || false}
                                onCheckedChange={(checked) => updatePreferences({ highContrast: checked })}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                              <div>
                                <p className="font-medium text-white">Réduire les animations</p>
                                <p className="text-sm text-white/70">Limiter les effets visuels et les animations</p>
                              </div>
                              <Switch 
                                checked={preferences.reducedAnimations || false}
                                onCheckedChange={(checked) => updatePreferences({ reducedAnimations: checked })}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                              <div>
                                <p className="font-medium text-white">Navigation au clavier</p>
                                <p className="text-sm text-white/70">Améliorer l'accessibilité via le clavier</p>
                              </div>
                              <Switch 
                                checked={preferences.keyboardNavigation || false}
                                onCheckedChange={(checked) => updatePreferences({ keyboardNavigation: checked })}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                              <div>
                                <p className="font-medium text-white">Compatibilité lecteur d'écran</p>
                                <p className="text-sm text-white/70">Optimiser pour les technologies d'assistance</p>
                              </div>
                              <Switch 
                                checked={preferences.screenReader || false}
                                onCheckedChange={(checked) => updatePreferences({ screenReader: checked })}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                              <div>
                                <p className="font-medium text-white">Guidage audio</p>
                                <p className="text-sm text-white/70">Instructions vocales pour la navigation</p>
                              </div>
                              <Switch 
                                checked={preferences.audioGuidance || false}
                                onCheckedChange={(checked) => updatePreferences({ audioGuidance: checked })}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                  
                  {/* Notifications Tab */}
                  <TabsContent value="notifications" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Notifications Émotionnelles</h2>
                        <p className="text-white/70">Adaptez la façon dont nous communiquons avec vous</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between p-4 mb-6 rounded-lg bg-white/20">
                          <div>
                            <p className="font-medium text-white">Activer les notifications</p>
                            <p className="text-sm text-white/70">Recevoir des rappels pour votre bien-être</p>
                          </div>
                          <Switch 
                            checked={preferences.notifications_enabled}
                            onCheckedChange={(checked) => updatePreferences({ notifications_enabled: checked })}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-6">
                          <Label className="text-white text-lg">Fréquence des rappels</Label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationFrequency === 'daily' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationFrequency: 'daily' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Quotidien</span>
                                <span className="text-sm text-white/70">Rappels chaque jour à une heure fixe</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationFrequency === 'weekly' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationFrequency: 'weekly' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Hebdomadaire</span>
                                <span className="text-sm text-white/70">Rappels en début de semaine</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationFrequency === 'flexible' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationFrequency: 'flexible' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Adaptatif</span>
                                <span className="text-sm text-white/70">Basé sur vos habitudes et besoins</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationFrequency === 'none' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationFrequency: 'none' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Aucun</span>
                                <span className="text-sm text-white/70">Désactiver tous les rappels récurrents</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-6">
                          <Label className="text-white text-lg">Style de communication</Label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationTone === 'minimalist' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationTone: 'minimalist' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Minimaliste</span>
                                <span className="text-sm text-white/70">Juste une icône et une vibration</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationTone === 'poetic' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationTone: 'poetic' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Poétique</span>
                                <span className="text-sm text-white/70">"Un moment de silence intérieur t'attend ici."</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationTone === 'directive' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationTone: 'directive' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Directif doux</span>
                                <span className="text-sm text-white/70">"C'est l'heure de ta pause."</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.notificationTone === 'silent' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ notificationTone: 'silent' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Silence émotionnel</span>
                                <span className="text-sm text-white/70">Mode "ne pas déranger" émotionnel</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-2">
                          <Label htmlFor="reminder-time" className="text-white">Heure de rappel préférée</Label>
                          <Input 
                            id="reminder-time" 
                            type="time" 
                            value={preferences.reminder_time || '09:00'}
                            onChange={(e) => updatePreferences({ reminder_time: e.target.value })}
                            className="bg-white/20 border-white/40 text-white"
                          />
                          <p className="text-sm text-white/70">
                            Nous vous enverrons des rappels de bien-être autour de cette heure
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                  
                  {/* Data & IA Tab */}
                  <TabsContent value="data" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Données & Intelligence Artificielle</h2>
                        <p className="text-white/70">Gérez votre empreinte émotionnelle et les analyses IA</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                            <div>
                              <p className="font-medium text-white">Mode incognito</p>
                              <p className="text-sm text-white/70">Les données ne sont pas sauvegardées temporairement</p>
                            </div>
                            <Switch 
                              checked={preferences.incognitoMode || false}
                              onCheckedChange={(checked) => updatePreferences({ incognitoMode: checked })}
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                            <div>
                              <p className="font-medium text-white">Pause IA</p>
                              <p className="text-sm text-white/70">Suspendre l'analyse émotionnelle temporairement</p>
                            </div>
                            <Switch 
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="space-y-4 mb-6">
                          <Label className="text-white text-lg">Export de données</Label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.dataExport === 'pdf' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ dataExport: 'pdf' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Format PDF</span>
                                <span className="text-sm text-white/70">Documents lisibles avec mise en page</span>
                              </div>
                            </div>
                            
                            <div 
                              className={`rounded-xl p-4 cursor-pointer transition-all border-2 ${preferences.dataExport === 'json' ? 'border-primary bg-white/40' : 'border-transparent bg-white/20'}`}
                              onClick={() => updatePreferences({ dataExport: 'json' })}
                            >
                              <div className="flex flex-col text-white">
                                <span className="font-medium">Format JSON</span>
                                <span className="text-sm text-white/70">Données brutes pour import/export</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/40 text-white mt-2">
                            Télécharger mes données
                          </Button>
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <div className="bg-white/20 p-4 rounded-lg">
                          <p className="font-medium text-white mb-2">Réinitialisation de l'empreinte émotionnelle</p>
                          <p className="text-sm text-white/70 mb-4">
                            Recommence l'analyse émotionnelle depuis zéro, sans supprimer vos journaux ou données
                          </p>
                          <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-red-400/40 text-red-400 hover:bg-red-400/20">
                            Réinitialiser mon empreinte émotionnelle
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                  
                  {/* Premium Tab */}
                  <TabsContent value="premium" className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-6"
                    >
                      <motion.div variants={itemVariants} className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">Fonctionnalités Premium</h2>
                        <p className="text-white/70">Découvrez les options avancées pour une expérience optimale</p>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-white/20">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              Mode caméléon émotionnel
                            </CardTitle>
                            <CardDescription className="text-white/80">
                              L'interface s'adapte automatiquement à votre état émotionnel
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-white/90">
                                Ce mode analyse votre comportement, votre humeur et votre rythme 
                                pour adapter automatiquement l'interface. L'application change de 
                                thème et d'ambiance sensorielle pour s'aligner avec votre état intérieur.
                              </p>
                              
                              <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                                <div>
                                  <p className="font-medium text-white">Activer le mode caméléon</p>
                                </div>
                                <Switch 
                                  checked={preferences.emotionalCamouflage || false}
                                  onCheckedChange={(checked) => updatePreferences({ emotionalCamouflage: checked })}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-blue-500/30 to-teal-500/30 border-white/20">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Heart className="h-5 w-5" />
                              Cercle de confiance
                            </CardTitle>
                            <CardDescription className="text-white/80">
                              Partagez votre parcours émotionnel avec des proches
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-white/90">
                                Invitez un ami, un thérapeute ou un partenaire dans votre cercle 
                                de confiance pour partager certains aspects de votre parcours émotionnel. 
                                Vous gardez le contrôle total sur ce qui est partagé.
                              </p>
                              
                              <div className="flex items-center justify-between p-4 rounded-lg bg-white/20">
                                <div>
                                  <p className="font-medium text-white">Activer le cercle de confiance</p>
                                </div>
                                <Switch 
                                  checked={preferences.duoModeEnabled || false}
                                  onCheckedChange={(checked) => updatePreferences({ duoModeEnabled: checked })}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                              
                              <Input 
                                placeholder="Email d'un confident de confiance" 
                                className="bg-white/20 border-white/40 text-white"
                                value={preferences.trustedContact || ''}
                                onChange={(e) => updatePreferences({ trustedContact: e.target.value })}
                                disabled={!preferences.duoModeEnabled}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveSettingsPage;
