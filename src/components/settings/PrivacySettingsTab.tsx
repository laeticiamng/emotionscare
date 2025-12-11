// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database,
  Share2,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Users,
  UserCheck,
  Clock,
  History,
  FileText,
  Fingerprint,
  Key,
  Smartphone,
  Laptop,
  MapPin,
  BarChart3,
  RefreshCw,
  Settings2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
  required: boolean;
  enabled: boolean;
  lastUpdated: string;
}

interface AuditLog {
  id: string;
  action: string;
  category: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastActive: string;
  location: string;
  current: boolean;
}

const PrivacySettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('privacy');
  
  const [dataSettings, setDataSettings] = useState({
    analytics: true,
    personalization: true,
    advertising: false,
    research: true,
    sharing: false
  });

  const [visibilitySettings, setVisibilitySettings] = useState({
    profileVisibility: 'public',
    activityStatus: true,
    lastSeen: false,
    progressSharing: 'friends',
    sessionsPublic: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: '30',
    deviceTracking: true
  });

  // Consents
  const [consents, setConsents] = useState<ConsentItem[]>(() => {
    const saved = localStorage.getItem('privacy_consents');
    return saved ? JSON.parse(saved) : [
      { id: 'essential', title: 'Cookies essentiels', description: 'Nécessaires au fonctionnement du site', category: 'essential', required: true, enabled: true, lastUpdated: new Date().toISOString() },
      { id: 'preferences', title: 'Préférences utilisateur', description: 'Mémoriser vos paramètres et préférences', category: 'functional', required: false, enabled: true, lastUpdated: new Date().toISOString() },
      { id: 'analytics', title: 'Analytics et statistiques', description: 'Comprendre comment vous utilisez l\'application', category: 'analytics', required: false, enabled: true, lastUpdated: new Date().toISOString() },
      { id: 'ai_training', title: 'Amélioration de l\'IA', description: 'Utiliser vos données pour améliorer nos modèles IA (anonymisé)', category: 'analytics', required: false, enabled: false, lastUpdated: new Date().toISOString() },
      { id: 'marketing', title: 'Communications marketing', description: 'Recevoir des offres personnalisées', category: 'marketing', required: false, enabled: false, lastUpdated: new Date().toISOString() }
    ];
  });

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('privacy_audit_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', action: 'Connexion réussie', category: 'auth', details: 'Connexion depuis Chrome/Windows', timestamp: new Date().toISOString(), ipAddress: '192.168.1.x', device: 'Desktop' },
      { id: '2', action: 'Export de données', category: 'data', details: 'Export RGPD demandé', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: '3', action: 'Modification des consentements', category: 'privacy', details: 'Analytics désactivé', timestamp: new Date(Date.now() - 172800000).toISOString() }
    ];
  });

  // Connected devices
  const [devices, setDevices] = useState<ConnectedDevice[]>([
    { id: '1', name: 'Chrome - Windows', type: 'desktop', lastActive: new Date().toISOString(), location: 'Paris, France', current: true },
    { id: '2', name: 'Safari - iPhone', type: 'mobile', lastActive: new Date(Date.now() - 3600000).toISOString(), location: 'Paris, France', current: false },
    { id: '3', name: 'Firefox - MacOS', type: 'desktop', lastActive: new Date(Date.now() - 86400000).toISOString(), location: 'Lyon, France', current: false }
  ]);

  // Calculate privacy score based on settings
  const calculatePrivacyScore = () => {
    let score = 50; // Base score
    
    if (securitySettings.twoFactor) score += 15;
    if (securitySettings.loginAlerts) score += 5;
    if (!dataSettings.advertising) score += 10;
    if (!dataSettings.sharing) score += 10;
    if (visibilitySettings.profileVisibility === 'private') score += 10;
    if (!visibilitySettings.lastSeen) score += 5;
    if (parseInt(securitySettings.sessionTimeout) <= 30) score += 5;
    
    return Math.min(100, score);
  };

  const privacyScore = calculatePrivacyScore();

  // Persist settings
  useEffect(() => {
    localStorage.setItem('privacy_consents', JSON.stringify(consents));
    localStorage.setItem('privacy_audit_logs', JSON.stringify(auditLogs.slice(-100)));
  }, [consents, auditLogs]);

  const addAuditLog = (action: string, category: string, details: string) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      action,
      category,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [...prev, log]);
  };

  const updateConsent = (id: string, enabled: boolean) => {
    setConsents(prev => prev.map(c => 
      c.id === id ? { ...c, enabled, lastUpdated: new Date().toISOString() } : c
    ));
    addAuditLog('Modification des consentements', 'privacy', `${id} ${enabled ? 'activé' : 'désactivé'}`);
  };

  const handleExportData = () => {
    addAuditLog('Export de données', 'data', 'Export RGPD demandé');
    toast({
      title: "Export en cours",
      description: "Vos données seront envoyées par email dans les 24h."
    });
  };

  const handleDeleteData = () => {
    addAuditLog('Demande de suppression', 'data', 'Suppression de compte demandée');
    toast({
      title: "Suppression programmée",
      description: "Un email de confirmation va être envoyé.",
      variant: "destructive"
    });
  };

  const revokeDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    addAuditLog('Révocation de session', 'security', `Appareil ${deviceId} déconnecté`);
    toast({
      title: "Appareil déconnecté",
      description: "La session a été révoquée"
    });
  };

  const revokeAllOtherDevices = () => {
    setDevices(prev => prev.filter(d => d.current));
    addAuditLog('Révocation de toutes les sessions', 'security', 'Toutes les autres sessions ont été déconnectées');
    toast({
      title: "Sessions révoquées",
      description: "Toutes les autres sessions ont été déconnectées"
    });
  };

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPrivacyScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return Smartphone;
      case 'tablet': return Smartphone;
      default: return Laptop;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="privacy" className="gap-1">
            <Shield className="h-4 w-4" />
            Confidentialité
          </TabsTrigger>
          <TabsTrigger value="consents" className="gap-1">
            <FileText className="h-4 w-4" />
            Consentements
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1">
            <Lock className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-1">
            <Laptop className="h-4 w-4" />
            Appareils
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1">
            <History className="h-4 w-4" />
            Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          {/* Score de confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Score de confidentialité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-3xl font-bold ${getPrivacyScoreColor(privacyScore)}`}>
                    {privacyScore}/100
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Niveau de protection de vos données
                  </p>
                </div>
                <div className="w-32">
                  <Progress value={privacyScore} className={`h-3 ${getPrivacyScoreBg(privacyScore)}`} />
                  <Badge className={`mt-2 ${getPrivacyScoreBg(privacyScore)} text-white`}>
                    {privacyScore >= 80 ? 'Excellent' : privacyScore >= 60 ? 'Bon' : 'À améliorer'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Chiffrement end-to-end
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Données anonymisées
                </div>
                <div className="flex items-center gap-2">
                  {securitySettings.twoFactor ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  Authentification 2FA
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Contrôle utilisateur
                </div>
              </div>

              {privacyScore < 80 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 Activez l'authentification à deux facteurs pour améliorer votre score
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visibilité du profil */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visibilité du profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Visibilité du profil</Label>
                  <p className="text-sm text-muted-foreground">
                    Qui peut voir votre profil et vos informations
                  </p>
                </div>
                <Select 
                  value={visibilitySettings.profileVisibility}
                  onValueChange={(value) => setVisibilitySettings({...visibilitySettings, profileVisibility: value})}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Amis
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Privé
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Statut d'activité</Label>
                  <p className="text-sm text-muted-foreground">
                    Montrer quand vous êtes en ligne
                  </p>
                </div>
                <Switch
                  checked={visibilitySettings.activityStatus}
                  onCheckedChange={(checked) => setVisibilitySettings({...visibilitySettings, activityStatus: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dernière connexion</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher votre dernière connexion
                  </p>
                </div>
                <Switch
                  checked={visibilitySettings.lastSeen}
                  onCheckedChange={(checked) => setVisibilitySettings({...visibilitySettings, lastSeen: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Partage des progrès</Label>
                  <p className="text-sm text-muted-foreground">
                    Qui peut voir vos statistiques de bien-être
                  </p>
                </div>
                <Select 
                  value={visibilitySettings.progressSharing}
                  onValueChange={(value) => setVisibilitySettings({...visibilitySettings, progressSharing: value})}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Amis</SelectItem>
                    <SelectItem value="private">Privé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Utilisation des données */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Utilisation des données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics et amélioration</Label>
                  <p className="text-sm text-muted-foreground">
                    Aider à améliorer l'application avec des données anonymes
                  </p>
                </div>
                <Switch
                  checked={dataSettings.analytics}
                  onCheckedChange={(checked) => setDataSettings({...dataSettings, analytics: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Personnalisation IA</Label>
                  <p className="text-sm text-muted-foreground">
                    Utiliser vos données pour personnaliser l'expérience IA
                  </p>
                </div>
                <Switch
                  checked={dataSettings.personalization}
                  onCheckedChange={(checked) => setDataSettings({...dataSettings, personalization: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recherche médicale</Label>
                  <p className="text-sm text-muted-foreground">
                    Contribuer à la recherche en santé mentale (anonyme)
                  </p>
                </div>
                <Switch
                  checked={dataSettings.research}
                  onCheckedChange={(checked) => setDataSettings({...dataSettings, research: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publicité personnalisée</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des publicités basées sur vos intérêts
                  </p>
                </div>
                <Switch
                  checked={dataSettings.advertising}
                  onCheckedChange={(checked) => setDataSettings({...dataSettings, advertising: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gestion des données */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Gestion des données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleExportData} className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter mes données (RGPD)
                </Button>
                <Button variant="outline" className="justify-start">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Portabilité des données
                </Button>
              </div>

              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive mb-1">Zone dangereuse</h4>
                    <p className="text-sm text-destructive/80 mb-3">
                      Supprimer définitivement toutes vos données de nos serveurs.
                      Cette action est irréversible.
                    </p>
                    <Button variant="destructive" size="sm" onClick={handleDeleteData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mes données
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Gestion des consentements
                </CardTitle>
                <Badge variant="outline">RGPD</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consents.map((consent) => (
                  <motion.div
                    key={consent.id}
                    className="p-4 border rounded-lg"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={consent.id}
                          checked={consent.enabled}
                          onCheckedChange={(checked) => updateConsent(consent.id, !!checked)}
                          disabled={consent.required}
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={consent.id} className="font-medium cursor-pointer">
                              {consent.title}
                            </Label>
                            {consent.required && (
                              <Badge variant="secondary" className="text-xs">Requis</Badge>
                            )}
                            <Badge variant="outline" className="text-xs capitalize">
                              {consent.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {consent.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Dernière mise à jour: {formatDate(consent.lastUpdated)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité avancée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" />
                    Authentification à deux facteurs
                    <Badge variant="outline" className="text-xs">Recommandé</Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactor}
                  onCheckedChange={(checked) => {
                    setSecuritySettings({...securitySettings, twoFactor: checked});
                    addAuditLog('2FA modifié', 'security', checked ? 'Activé' : 'Désactivé');
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes de connexion</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification lors de nouvelles connexions
                  </p>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Timeout de session</Label>
                  <p className="text-sm text-muted-foreground">
                    Déconnexion automatique après inactivité
                  </p>
                </div>
                <Select 
                  value={securitySettings.sessionTimeout}
                  onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15min</SelectItem>
                    <SelectItem value="30">30min</SelectItem>
                    <SelectItem value="60">1h</SelectItem>
                    <SelectItem value="0">Jamais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Laptop className="h-5 w-5" />
                  Appareils connectés
                </CardTitle>
                <Button variant="outline" size="sm" onClick={revokeAllOtherDevices}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Déconnecter tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device) => {
                  const Icon = getDeviceIcon(device.type);
                  return (
                    <motion.div
                      key={device.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        device.current ? 'bg-primary/5 border-primary' : ''
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Icon className="h-6 w-6 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{device.name}</span>
                          {device.current && (
                            <Badge variant="default" className="text-xs">Cet appareil</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {device.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(device.lastActive)}
                          </span>
                        </div>
                      </div>
                      {!device.current && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeDevice(device.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Déconnecter
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Journal d'audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune activité enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...auditLogs].reverse().map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{log.action}</span>
                            <Badge variant="outline" className="text-xs">{log.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{formatDate(log.timestamp)}</span>
                            {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                            {log.device && <span>{log.device}</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrivacySettingsTab;
