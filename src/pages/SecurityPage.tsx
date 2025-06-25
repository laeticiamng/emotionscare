
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SecurityPage: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    dataEncryption: true,
    anonymousMode: false,
    sessionTimeout: '30'
  });

  const recentSessions = [
    {
      device: 'Chrome sur Windows',
      location: 'Paris, France',
      time: 'Maintenant',
      current: true,
      ip: '192.168.1.1'
    },
    {
      device: 'Safari sur iPhone',
      location: 'Paris, France',
      time: 'Il y a 2 heures',
      current: false,
      ip: '192.168.1.2'
    },
    {
      device: 'Chrome sur MacOS',
      location: 'Lyon, France',
      time: 'Hier',
      current: false,
      ip: '172.16.0.1'
    }
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    toast.success('Mot de passe modifié avec succès');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleExportData = () => {
    toast.success('Export des données en cours... Vous recevrez un email avec le lien de téléchargement.');
  };

  const handleDeleteAccount = () => {
    toast.error('Cette action nécessite une confirmation par email. Vérifiez votre boîte mail.');
  };

  const terminateSession = (index: number) => {
    toast.success('Session terminée avec succès');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Sécurité et Confidentialité</h1>
            <p className="text-muted-foreground">Gérez la sécurité de votre compte et vos données personnelles</p>
          </div>
        </div>

        {/* Statut de sécurité */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Compte sécurisé</h3>
                <p className="text-sm text-green-700">
                  Toutes les mesures de sécurité recommandées sont activées
                </p>
              </div>
              <Badge className="ml-auto bg-green-600">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="password" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Changer le mot de passe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      required
                    />
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-2">Exigences du mot de passe :</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Au moins 8 caractères</li>
                      <li>• Une lettre majuscule et une minuscule</li>
                      <li>• Au moins un chiffre</li>
                      <li>• Un caractère spécial (!@#$%^&*)</li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full">
                    Changer le mot de passe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Authentification à deux facteurs (2FA)</h4>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez une couche de sécurité supplémentaire avec votre téléphone
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                      }
                    />
                    {securitySettings.twoFactorAuth && (
                      <Badge variant="secondary">Activé</Badge>
                    )}
                  </div>
                </div>

                {securitySettings.twoFactorAuth && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Configuré avec l'application Authenticator</p>
                          <p className="text-sm text-muted-foreground">
                            Téléphone se terminant par ****23
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Modifier
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Notifications de connexion</h4>
                    <p className="text-sm text-muted-foreground">
                      Recevez un email lors de nouvelles connexions
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, loginNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Chiffrement des données</h4>
                    <p className="text-sm text-muted-foreground">
                      Chiffrement de bout en bout de vos données sensibles
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.dataEncryption}
                      disabled
                    />
                    <Badge>Obligatoire</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Expiration de session (minutes)</Label>
                  <select
                    id="session-timeout"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="120">2 heures</option>
                    <option value="0">Jamais</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sessions actives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">IP: {session.ip}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.current ? (
                          <Badge variant="secondary">Session actuelle</Badge>
                        ) : (
                          <Button
                            onClick={() => terminateSession(index)}
                            variant="outline"
                            size="sm"
                          >
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Mode anonyme</h4>
                    <p className="text-sm text-muted-foreground">
                      Vos interactions sociales seront complètement anonymes
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.anonymousMode}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, anonymousMode: checked }))
                    }
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Gestion des données personnelles</h4>
                  <div className="space-y-3">
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter mes données (RGPD)
                    </Button>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Données collectées :</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Données de profil et préférences</li>
                        <li>• Historique des sessions et activités</li>
                        <li>• Données émotionnelles anonymisées</li>
                        <li>• Statistiques d'utilisation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-800 mb-2">Zone de danger</h4>
                        <p className="text-sm text-red-700 mb-4">
                          La suppression de votre compte est définitive et irréversible. 
                          Toutes vos données seront supprimées.
                        </p>
                        <Button
                          onClick={handleDeleteAccount}
                          variant="destructive"
                          size="sm"
                        >
                          Supprimer définitivement mon compte
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SecurityPage;
