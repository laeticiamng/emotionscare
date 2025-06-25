
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Lock, 
  Key,
  Eye,
  EyeOff,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Trash2,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { performanceMonitor } from '@/utils/pagePerformanceMonitor';

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'settings_change' | 'suspicious';
  description: string;
  timestamp: string;
  location: string;
  device: string;
  risk: 'low' | 'medium' | 'high';
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastSeen: string;
  location: string;
  current: boolean;
}

const SecurityPage: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [securityEvents] = useState<SecurityEvent[]>([
    { id: '1', type: 'login', description: 'Connexion réussie', timestamp: '2024-01-15 14:30', location: 'Paris, France', device: 'iPhone 14', risk: 'low' },
    { id: '2', type: 'settings_change', description: 'Modification des préférences', timestamp: '2024-01-15 10:15', location: 'Paris, France', device: 'MacBook Pro', risk: 'low' },
    { id: '3', type: 'password_change', description: 'Changement de mot de passe', timestamp: '2024-01-14 16:45', location: 'Paris, France', device: 'MacBook Pro', risk: 'medium' },
    { id: '4', type: 'suspicious', description: 'Tentative de connexion échouée', timestamp: '2024-01-13 22:30', location: 'Inconnue', device: 'Navigateur inconnu', risk: 'high' }
  ]);

  const [connectedDevices] = useState<ConnectedDevice[]>([
    { id: '1', name: 'iPhone 14', type: 'mobile', lastSeen: '2024-01-15 14:30', location: 'Paris, France', current: true },
    { id: '2', name: 'MacBook Pro', type: 'desktop', lastSeen: '2024-01-15 10:15', location: 'Paris, France', current: false },
    { id: '3', name: 'iPad Air', type: 'tablet', lastSeen: '2024-01-14 18:20', location: 'Paris, France', current: false }
  ]);

  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const loadTime = Date.now() - startTime;
      performanceMonitor.recordPageLoad('/security', loadTime);
    };
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Simuler le changement de mot de passe
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Mot de passe modifié avec succès');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const enable2FA = async () => {
    // Simuler l'activation de la 2FA
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTwoFactorEnabled(true);
    toast.success('Authentification à deux facteurs activée');
  };

  const revokeDevice = async (deviceId: string) => {
    // Simuler la révocation d'un appareil
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Appareil révoqué avec succès');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return CheckCircle;
      case 'password_change': return Key;
      case 'settings_change': return Settings;
      case 'suspicious': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold">Centre de Sécurité</h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Protégez votre compte avec nos outils de sécurité avancés
            </p>
          </div>

          {/* Score de Sécurité */}
          <Card className="mb-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-12 w-12 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold">Score de Sécurité</h2>
                    <p className="text-lg opacity-90">Votre compte est bien protégé</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">85%</div>
                  <Badge className="bg-white text-green-600 mt-2">Bon Niveau</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
              <TabsTrigger value="password">Mot de Passe</TabsTrigger>
              <TabsTrigger value="devices">Appareils</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Authentification à Deux Facteurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Ajoutez une couche de sécurité supplémentaire à votre compte.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {twoFactorEnabled ? 'Activée' : 'Désactivée'}
                      </span>
                      <Switch 
                        checked={twoFactorEnabled}
                        onCheckedChange={enable2FA}
                      />
                    </div>
                    {!twoFactorEnabled && (
                      <Button onClick={enable2FA} className="w-full">
                        Activer la 2FA
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      Authentification Biométrique
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Utilisez votre empreinte ou reconnaissance faciale.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {biometricEnabled ? 'Activée' : 'Désactivée'}
                      </span>
                      <Switch 
                        checked={biometricEnabled}
                        onCheckedChange={setBiometricEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Notifications de Connexion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Recevez des alertes lors de nouvelles connexions.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {loginNotifications ? 'Activées' : 'Désactivées'}
                      </span>
                      <Switch 
                        checked={loginNotifications}
                        onCheckedChange={setLoginNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Téléchargement de Données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Exportez vos données de sécurité (conforme RGPD).
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le Rapport
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-6 w-6 mr-2" />
                    Changer le Mot de Passe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input 
                          id="current-password"
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input 
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                      <Input 
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Conseils pour un mot de passe sécurisé :</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Au moins 8 caractères</li>
                        <li>• Mélanger majuscules et minuscules</li>
                        <li>• Inclure des chiffres et symboles</li>
                        <li>• Éviter les mots du dictionnaire</li>
                      </ul>
                    </div>

                    <Button 
                      onClick={handlePasswordChange}
                      disabled={!currentPassword || !newPassword || !confirmPassword}
                      className="w-full"
                    >
                      Modifier le Mot de Passe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <h3 className="text-2xl font-semibold">Appareils Connectés</h3>
              
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <Card key={device.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-6 w-6 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{device.name}</h4>
                            <p className="text-sm text-gray-500">
                              {device.location} • Dernière activité: {device.lastSeen}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {device.current && (
                            <Badge className="bg-green-100 text-green-800">Actuel</Badge>
                          )}
                          {!device.current && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => revokeDevice(device.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Révoquer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <h3 className="text-2xl font-semibold">Activité de Sécurité</h3>
              
              <div className="space-y-3">
                {securityEvents.map((event) => {
                  const EventIcon = getEventIcon(event.type);
                  
                  return (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <EventIcon className="h-5 w-5 text-gray-500" />
                            <div>
                              <h4 className="font-medium">{event.description}</h4>
                              <p className="text-sm text-gray-500">
                                {event.device} • {event.location}
                              </p>
                              <p className="text-xs text-gray-400">{event.timestamp}</p>
                            </div>
                          </div>
                          <Badge className={getRiskColor(event.risk)}>
                            {event.risk === 'low' ? 'Faible' : event.risk === 'medium' ? 'Moyen' : 'Élevé'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityPage;
