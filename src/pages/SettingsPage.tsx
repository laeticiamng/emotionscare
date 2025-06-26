
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Users, Mail, Database, Zap, AlertTriangle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Hôpital Saint-Martin",
    defaultLanguage: "fr",
    timezone: "Europe/Paris",
    emailNotifications: true,
    maintenanceMode: false,
    dataRetention: 24,
    autoBackup: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 60,
    passwordComplexity: "high",
    loginAttempts: 5,
    dataEncryption: true,
    auditLogging: true,
    ipWhitelist: false
  });

  const saveSettings = (category: string) => {
    toast({
      title: "Paramètres sauvegardés",
      description: `Les paramètres ${category} ont été mis à jour avec succès.`,
    });
  };

  const exportData = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation. Vous recevrez un email quand c'est prêt.",
    });
  };

  const systemStats = {
    totalUsers: 324,
    activeUsers: 287,
    storageUsed: "2.3 GB",
    lastBackup: "Il y a 2h",
    systemLoad: 23,
    uptime: "99.8%"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50 p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Paramètres Administrateur</h1>
          <p className="text-gray-600">Configuration système et paramètres globaux</p>
        </div>

        {/* Stats système */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{systemStats.totalUsers}</div>
              <p className="text-sm text-gray-600">Utilisateurs totaux</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{systemStats.activeUsers}</div>
              <p className="text-sm text-gray-600">Utilisateurs actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{systemStats.storageUsed}</div>
              <p className="text-sm text-gray-600">Stockage utilisé</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{systemStats.systemLoad}%</div>
              <p className="text-sm text-gray-600">Charge système</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{systemStats.uptime}</div>
              <p className="text-sm text-gray-600">Disponibilité</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg font-bold text-cyan-600 mb-2">{systemStats.lastBackup}</div>
              <p className="text-sm text-gray-600">Dernière sauvegarde</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="data">Données</TabsTrigger>
            <TabsTrigger value="integrations">Intégrations</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres Généraux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nom de l'organisation</Label>
                    <Input 
                      value={generalSettings.companyName}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Langue par défaut</Label>
                    <Select 
                      value={generalSettings.defaultLanguage} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fuseau horaire</Label>
                    <Select 
                      value={generalSettings.timezone} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rétention des données (mois)</Label>
                    <Input 
                      type="number"
                      value={generalSettings.dataRetention}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications email</Label>
                      <p className="text-sm text-muted-foreground">Recevoir les alertes système par email</p>
                    </div>
                    <Switch 
                      checked={generalSettings.emailNotifications}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sauvegarde automatique</Label>
                      <p className="text-sm text-muted-foreground">Sauvegardes quotidiennes automatiques</p>
                    </div>
                    <Switch 
                      checked={generalSettings.autoBackup}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, autoBackup: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-orange-600">Mode maintenance</Label>
                      <p className="text-sm text-muted-foreground">Désactiver l'accès pour tous les utilisateurs</p>
                    </div>
                    <Switch 
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={() => saveSettings('généraux')}>
                  Sauvegarder les paramètres généraux
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Paramètres de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Timeout de session (minutes)</Label>
                    <Input 
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Complexité des mots de passe</Label>
                    <Select 
                      value={securitySettings.passwordComplexity} 
                      onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, passwordComplexity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible (8 caractères)</SelectItem>
                        <SelectItem value="medium">Moyenne (8 chars + symboles)</SelectItem>
                        <SelectItem value="high">Élevée (12 chars + symboles + maj/min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tentatives de connexion max</Label>
                    <Input 
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">Obligatoire pour tous les administrateurs</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Chiffrement des données</Label>
                      <p className="text-sm text-muted-foreground">Chiffrement AES-256 en transit et au repos</p>
                    </div>
                    <Switch 
                      checked={securitySettings.dataEncryption}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, dataEncryption: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Journalisation des audits</Label>
                      <p className="text-sm text-muted-foreground">Enregistrer toutes les actions administratives</p>
                    </div>
                    <Switch 
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Liste blanche des IP</Label>
                      <p className="text-sm text-muted-foreground">Restreindre l'accès à certaines adresses IP</p>
                    </div>
                    <Switch 
                      checked={securitySettings.ipWhitelist}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: checked }))}
                    />
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Alertes de Sécurité</h4>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• 3 tentatives de connexion échouées dans les dernières 24h</li>
                    <li>• Dernière mise à jour de sécurité: Il y a 3 jours</li>
                    <li>• Certificat SSL expire dans 45 jours</li>
                  </ul>
                </div>

                <Button onClick={() => saveSettings('de sécurité')}>
                  Sauvegarder les paramètres de sécurité
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion des Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">324</div>
                    <p className="text-sm text-gray-600">Utilisateurs totaux</p>
                    <Badge variant="secondary" className="mt-2">+12 ce mois</Badge>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">287</div>
                    <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                    <Badge variant="default" className="mt-2">88.6% taux d'activité</Badge>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
                    <p className="text-sm text-gray-600">Administrateurs</p>
                    <Badge variant="outline" className="mt-2">Accès complet</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Actions rapides</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Créer un nouvel utilisateur
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer invitation de masse
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter la liste des utilisateurs
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer les rôles
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Politiques d'accès</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Tous les nouveaux utilisateurs ont accès B2C par défaut</li>
                    <li>• L'accès B2B Admin nécessite une approbation</li>
                    <li>• Désactivation automatique après 90 jours d'inactivité</li>
                    <li>• Révision des accès tous les 6 mois</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gestion des Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Sauvegardes</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Dernière sauvegarde:</span>
                        <span className="text-green-600">Il y a 2h (Succès)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Prochaine sauvegarde:</span>
                        <span>Dans 22h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taille totale:</span>
                        <span>2.3 GB</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Créer une sauvegarde maintenant
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Conformité RGPD</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Consentement utilisateur</span>
                        <Badge variant="default">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Données anonymisées</span>
                        <Badge variant="default">Conforme</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Droit à l'oubli</span>
                        <Badge variant="default">Actif</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Actions sur les données</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" onClick={exportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter toutes les données
                    </Button>
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Nettoyer les données anciennes
                    </Button>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Rapport de conformité
                    </Button>
                    <Button variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Optimiser la base de données
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">✅ Statut de la Base de Données</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Performance: Optimale (temps de réponse < 100ms)</li>
                    <li>• Intégrité: 100% des vérifications passées</li>
                    <li>• Sauvegarde: Automatique quotidienne à 2h du matin</li>
                    <li>• Chiffrement: AES-256 activé sur toutes les données sensibles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Intégrations & API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Intégrations disponibles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Microsoft Teams</h5>
                        <Badge variant="default">Connecté</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Notifications et rappels bien-être</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Slack</h5>
                        <Badge variant="outline">Non configuré</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Intégration des alertes équipe</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Google Workspace</h5>
                        <Badge variant="default">Connecté</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Synchronisation calendrier</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">SIRH Existant</h5>
                        <Badge variant="secondary">En cours</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Import des données employés</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">API & Webhooks</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Clés API actives:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Webhooks configurés:</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Appels API ce mois:</span>
                        <span className="font-medium">12,547</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quota restant:</span>
                        <span className="font-medium text-green-600">87,453</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    Gérer les clés API
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Maintenance & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.8%</div>
                    <p className="text-sm text-gray-600">Disponibilité</p>
                    <Badge variant="default" className="mt-2">30 derniers jours</Badge>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">23%</div>
                    <p className="text-sm text-gray-600">Charge CPU</p>
                    <Badge variant="secondary" className="mt-2">Normale</Badge>
                  </div>

                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">156ms</div>
                    <p className="text-sm text-gray-600">Temps de réponse</p>
                    <Badge variant="default" className="mt-2">Optimal</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Actions de maintenance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Redémarrer les services
                    </Button>
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Optimiser la base
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger les logs
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Vider le cache
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Planification de maintenance</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Prochaine maintenance planifiée:</span>
                        <Badge variant="outline">Dimanche 3h-5h</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Type:</span>
                        <span className="text-sm font-medium">Mise à jour sécurité</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Durée estimée:</span>
                        <span className="text-sm font-medium">2 heures</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Alertes Système</h4>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Mise à jour disponible: EmotionsCare v2.1.3</li>
                    <li>• Espace disque: 78% utilisé (surveillance recommandée)</li>
                    <li>• 2 utilisateurs inactifs depuis 90+ jours</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
