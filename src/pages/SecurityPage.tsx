
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Download,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const SecurityPage: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const securitySettings = [
    {
      id: 'two-factor',
      title: 'Authentification à deux facteurs',
      description: 'Ajoutez une couche de sécurité supplémentaire à votre compte',
      enabled: twoFactorEnabled,
      onToggle: setTwoFactorEnabled,
      icon: <Smartphone className="h-5 w-5" />,
      status: twoFactorEnabled ? 'active' : 'inactive'
    },
    {
      id: 'login-notifications',
      title: 'Notifications de connexion',
      description: 'Recevez des alertes lors de nouvelles connexions',
      enabled: loginNotifications,
      onToggle: setLoginNotifications,
      icon: <AlertTriangle className="h-5 w-5" />,
      status: loginNotifications ? 'active' : 'inactive'
    },
    {
      id: 'data-encryption',
      title: 'Chiffrement des données',
      description: 'Vos données sensibles sont chiffrées end-to-end',
      enabled: dataEncryption,
      onToggle: setDataEncryption,
      icon: <Lock className="h-5 w-5" />,
      status: 'active'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      action: 'Connexion réussie',
      device: 'Chrome sur Windows',
      location: 'Paris, France',
      timestamp: '2024-01-15 14:30',
      status: 'success'
    },
    {
      id: '2',
      action: 'Changement de mot de passe',
      device: 'Firefox sur macOS',
      location: 'Lyon, France',
      timestamp: '2024-01-14 09:15',
      status: 'success'
    },
    {
      id: '3',
      action: 'Tentative de connexion échouée',
      device: 'Safari sur iOS',
      location: 'Marseille, France',
      timestamp: '2024-01-13 18:45',
      status: 'warning'
    }
  ];

  const handlePasswordChange = () => {
    toast.success('Mot de passe mis à jour avec succès');
  };

  const handleTwoFactorSetup = () => {
    if (!twoFactorEnabled) {
      toast.info('Configuration de l\'authentification à deux facteurs...');
      // Simulation de l'activation
      setTimeout(() => {
        setTwoFactorEnabled(true);
        toast.success('Authentification à deux facteurs activée !');
      }, 2000);
    } else {
      toast.warning('Authentification à deux facteurs désactivée');
      setTwoFactorEnabled(false);
    }
  };

  const exportSecurityData = () => {
    toast.success('Export des données de sécurité initié');
  };

  const deleteAccount = () => {
    toast.error('Fonctionnalité de suppression de compte - confirmation requise');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sécurité & Confidentialité
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gérez vos paramètres de sécurité et protégez votre compte avec des mesures de protection avancées.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Security Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Status Overview */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  État de la Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">Compte Sécurisé</h3>
                      <p className="text-sm text-green-600">Toutes les mesures de sécurité sont activées</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">85% Sécurisé</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-800">Chiffrement</h4>
                    <p className="text-sm text-blue-600">AES-256</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Key className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-purple-800">2FA</h4>
                    <p className="text-sm text-purple-600">{twoFactorEnabled ? 'Activé' : 'Désactivé'}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium text-orange-800">Sessions</h4>
                    <p className="text-sm text-orange-600">2 actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-600" />
                  Changer le Mot de Passe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mot de passe actuel</label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Mot de passe actuel"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Nouveau mot de passe"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <p>Le mot de passe doit contenir :</p>
                    <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                      <li>Au moins 8 caractères</li>
                      <li>Une majuscule et une minuscule</li>
                      <li>Un chiffre et un caractère spécial</li>
                    </ul>
                  </div>
                  <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700">
                    Mettre à jour
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Paramètres de Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {securitySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        setting.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {setting.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{setting.title}</h3>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={setting.status === 'active' ? 'default' : 'secondary'}>
                        {setting.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={setting.id === 'two-factor' ? handleTwoFactorSetup : setting.onToggle}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'success' ? 'bg-green-100' : 
                          activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {activity.status === 'success' ? (
                            <CheckCircle className={`h-4 w-4 ${
                              activity.status === 'success' ? 'text-green-600' : 
                              activity.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                          ) : (
                            <AlertTriangle className={`h-4 w-4 ${
                              activity.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{activity.action}</h4>
                          <p className="text-sm text-gray-600">{activity.device} • {activity.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                        <Badge variant={
                          activity.status === 'success' ? 'default' : 
                          activity.status === 'warning' ? 'secondary' : 'destructive'
                        }>
                          {activity.status === 'success' ? 'Succès' : 
                           activity.status === 'warning' ? 'Attention' : 'Échec'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={exportSecurityData}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les données
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Sessions actives
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le compte
                </Button>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Conseils de Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Utilisez un mot de passe unique et complexe</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Activez l'authentification à deux facteurs</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Vérifiez régulièrement votre activité</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Ne partagez jamais vos identifiants</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Besoin d'Aide ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Notre équipe sécurité est là pour vous aider en cas de problème.
                </p>
                <Button variant="outline" className="w-full">
                  Contacter le Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
