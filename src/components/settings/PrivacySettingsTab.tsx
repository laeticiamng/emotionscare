import React, { useState, useEffect, useCallback } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
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
  RefreshCw,
  Loader2,
  FileDown,
  ExternalLink,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { usePrivacy } from '@/modules/privacy/usePrivacy';
import { PREFERENCE_METADATA, type PrivacyPreferenceKey } from '@/modules/privacy/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
  required: boolean;
  enabled: boolean;
  lastUpdated: string;
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
  const [deletionReason, setDeletionReason] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Utiliser le hook usePrivacy pour la persistance Supabase
  const {
    preferences,
    stats,
    exports,
    consentHistory,
    isLoading,
    updatePreference,
    requestExport,
    requestDeletion,
    cancelDeletion,
    refresh,
  } = usePrivacy();

  // Paramètres de visibilité (localStorage pour l'instant)
  const [visibilitySettings, setVisibilitySettings] = useState(() => {
    const saved = localStorage.getItem('privacy_visibility');
    return saved ? JSON.parse(saved) : {
      profileVisibility: 'friends',
      activityStatus: true,
      lastSeen: false,
      progressSharing: 'friends',
    };
  });

  const [securitySettings, setSecuritySettings] = useState(() => {
    const saved = localStorage.getItem('privacy_security');
    return saved ? JSON.parse(saved) : {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: '30',
      deviceTracking: true
    };
  });

  // Consents locaux
  const [consents, setConsents] = useState<ConsentItem[]>(() => {
    const saved = localStorage.getItem('privacy_consents');
    return saved ? JSON.parse(saved) : [
      { id: 'essential', title: 'Cookies essentiels', description: 'Nécessaires au fonctionnement du site', category: 'essential', required: true, enabled: true, lastUpdated: new Date().toISOString() },
      { id: 'preferences', title: 'Préférences utilisateur', description: 'Mémoriser vos paramètres et préférences', category: 'functional', required: false, enabled: true, lastUpdated: new Date().toISOString() },
      { id: 'analytics', title: 'Analytics et statistiques', description: 'Comprendre comment vous utilisez l\'application', category: 'analytics', required: false, enabled: preferences?.analytics ?? true, lastUpdated: new Date().toISOString() },
      { id: 'ai_training', title: 'Amélioration de l\'IA', description: 'Utiliser vos données pour améliorer nos modèles IA (anonymisé)', category: 'analytics', required: false, enabled: false, lastUpdated: new Date().toISOString() },
      { id: 'marketing', title: 'Communications marketing', description: 'Recevoir des offres personnalisées', category: 'marketing', required: false, enabled: false, lastUpdated: new Date().toISOString() }
    ];
  });

  // Connected devices (mock pour l'instant)
  const [devices, setDevices] = useState<ConnectedDevice[]>([
    { id: '1', name: 'Chrome - Windows', type: 'desktop', lastActive: new Date().toISOString(), location: 'Paris, France', current: true },
    { id: '2', name: 'Safari - iPhone', type: 'mobile', lastActive: new Date(Date.now() - 3600000).toISOString(), location: 'Paris, France', current: false },
  ]);

  // Persist local settings
  useEffect(() => {
    localStorage.setItem('privacy_visibility', JSON.stringify(visibilitySettings));
    localStorage.setItem('privacy_security', JSON.stringify(securitySettings));
    localStorage.setItem('privacy_consents', JSON.stringify(consents));
  }, [visibilitySettings, securitySettings, consents]);

  // Calculer le score de confidentialité
  const calculatePrivacyScore = useCallback(() => {
    let score = 50;
    
    if (securitySettings.twoFactor) score += 15;
    if (securitySettings.loginAlerts) score += 5;
    if (!preferences?.analytics) score += 10;
    if (visibilitySettings.profileVisibility === 'private') score += 10;
    if (!visibilitySettings.lastSeen) score += 5;
    if (parseInt(securitySettings.sessionTimeout) <= 30) score += 5;
    
    return Math.min(100, score);
  }, [securitySettings, preferences, visibilitySettings]);

  const privacyScore = calculatePrivacyScore();

  // Gérer l'export de données RGPD
  const handleExportData = async (type: 'all' | 'personal' | 'activity' = 'all') => {
    setIsExporting(true);
    try {
      const result = await requestExport(type);
      if (result) {
        toast({
          title: "Export demandé",
          description: "Vous recevrez un email avec le lien de téléchargement sous 24-48h.",
        });
      } else {
        throw new Error('Échec de la demande');
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande d'export. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Gérer la suppression du compte
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const success = await requestDeletion(deletionReason || undefined);
      if (success) {
        toast({
          title: "Demande enregistrée",
          description: "Votre compte sera supprimé dans 30 jours. Vous pouvez annuler cette demande à tout moment.",
        });
        setDeletionReason('');
      } else {
        throw new Error('Échec de la demande');
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande de suppression. Réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Annuler la suppression
  const handleCancelDeletion = async () => {
    try {
      const success = await cancelDeletion();
      if (success) {
        toast({
          title: "Suppression annulée",
          description: "Votre compte ne sera pas supprimé.",
        });
        refresh();
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la suppression.",
        variant: "destructive",
      });
    }
  };

  // Mettre à jour une préférence
  const handlePreferenceChange = async (key: PrivacyPreferenceKey, value: boolean) => {
    const success = await updatePreference(key, value);
    if (success) {
      toast({
        title: "Préférence mise à jour",
        description: `${PREFERENCE_METADATA[key]?.label || key} ${value ? 'activé' : 'désactivé'}`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la préférence.",
        variant: "destructive",
      });
    }
  };

  const updateConsent = (id: string, enabled: boolean) => {
    setConsents(prev => prev.map(c => 
      c.id === id ? { ...c, enabled, lastUpdated: new Date().toISOString() } : c
    ));
    
    // Synchroniser avec usePrivacy si c'est analytics
    if (id === 'analytics') {
      handlePreferenceChange('analytics', enabled);
    }
  };

  const revokeDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    toast({
      title: "Appareil déconnecté",
      description: "La session a été révoquée"
    });
  };

  const revokeAllOtherDevices = () => {
    setDevices(prev => prev.filter(d => d.current));
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

  const getExportStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />En attente</Badge>;
      case 'processing':
        return <Badge variant="default"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Traitement</Badge>;
      case 'ready':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Prêt</Badge>;
      case 'expired':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Expiré</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Échec</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Vérifier s'il y a une demande de suppression en cours
  const pendingDeletion = exports.find(e => e.type === 'all' && e.status === 'pending');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="privacy" className="gap-1">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Confidentialité
          </TabsTrigger>
          <TabsTrigger value="consents" className="gap-1">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Consentements
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1">
            <Lock className="h-4 w-4" aria-hidden="true" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-1">
            <Laptop className="h-4 w-4" aria-hidden="true" />
            Appareils
          </TabsTrigger>
          <TabsTrigger value="exports" className="gap-1">
            <Download className="h-4 w-4" aria-hidden="true" />
            Exports
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1">
            <History className="h-4 w-4" aria-hidden="true" />
            Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          {/* Score de confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" aria-hidden="true" />
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
                  <Progress value={privacyScore} className="h-3" />
                  <Badge className={`mt-2 ${getPrivacyScoreBg(privacyScore)} text-white`}>
                    {privacyScore >= 80 ? 'Excellent' : privacyScore >= 60 ? 'Bon' : 'À améliorer'}
                  </Badge>
                </div>
              </div>
              
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalDataRecords}</div>
                    <div className="text-xs text-muted-foreground">Données totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.personalDataRecords}</div>
                    <div className="text-xs text-muted-foreground">Données personnelles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{stats.anonymizedRecords}</div>
                    <div className="text-xs text-muted-foreground">Anonymisées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.gdprScore}%</div>
                    <div className="text-xs text-muted-foreground">Score RGPD</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                  Chiffrement end-to-end
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                  Données anonymisées
                </div>
                <div className="flex items-center gap-2">
                  {securitySettings.twoFactor ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                  )}
                  Authentification 2FA
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
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
                <Eye className="h-5 w-5" aria-hidden="true" />
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
            </CardContent>
          </Card>

          {/* Préférences de données avec usePrivacy */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" aria-hidden="true" />
                Préférences de collecte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{PREFERENCE_METADATA.analytics.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {PREFERENCE_METADATA.analytics.description}
                  </p>
                </div>
                <Switch
                  checked={preferences?.analytics ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{PREFERENCE_METADATA.personalization.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {PREFERENCE_METADATA.personalization.description}
                  </p>
                </div>
                <Switch
                  checked={preferences?.personalization ?? true}
                  onCheckedChange={(checked) => handlePreferenceChange('personalization', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{PREFERENCE_METADATA.social.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {PREFERENCE_METADATA.social.description}
                  </p>
                </div>
                <Switch
                  checked={preferences?.social ?? false}
                  onCheckedChange={(checked) => handlePreferenceChange('social', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gestion des données RGPD */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" aria-hidden="true" />
                Gestion des données (RGPD)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleExportData('all')} 
                  disabled={isExporting}
                  className="justify-start"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Exporter toutes mes données
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExportData('personal')} 
                  disabled={isExporting}
                  className="justify-start"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Exporter données personnelles
                </Button>
              </div>

              {/* Zone dangereuse */}
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <h4 className="font-medium text-destructive mb-1">Zone dangereuse</h4>
                    <p className="text-sm text-destructive/80 mb-3">
                      Supprimer définitivement toutes vos données. Cette action prend effet après 30 jours.
                    </p>
                    
                    {pendingDeletion ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Suppression programmée</Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCancelDeletion}
                        >
                          Annuler la suppression
                        </Button>
                      </div>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={isDeleting}>
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Supprimer mon compte
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action programmera la suppression de votre compte dans 30 jours. 
                              Toutes vos données seront définitivement effacées.
                              Vous pouvez annuler cette demande à tout moment avant la date effective.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Label htmlFor="deletion-reason">Raison (optionnel)</Label>
                            <Textarea
                              id="deletion-reason"
                              placeholder="Dites-nous pourquoi vous partez..."
                              value={deletionReason}
                              onChange={(e) => setDeletionReason(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Confirmer la suppression
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
                  <FileText className="h-5 w-5" aria-hidden="true" />
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
                          aria-describedby={`${consent.id}-description`}
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
                          <p id={`${consent.id}-description`} className="text-sm text-muted-foreground">
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
                <Lock className="h-5 w-5" aria-hidden="true" />
                Sécurité avancée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" aria-hidden="true" />
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
                    toast({
                      title: checked ? "2FA activé" : "2FA désactivé",
                      description: checked 
                        ? "Votre compte est maintenant plus sécurisé" 
                        : "La protection 2FA a été désactivée",
                    });
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
                  <Key className="h-4 w-4 mr-2" aria-hidden="true" />
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
                  <Laptop className="h-5 w-5" aria-hidden="true" />
                  Appareils connectés
                </CardTitle>
                <Button variant="outline" size="sm" onClick={revokeAllOtherDevices}>
                  <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />
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
                      <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{device.name}</span>
                          {device.current && (
                            <Badge variant="default" className="text-xs">Cet appareil</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            {device.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
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

        {/* Nouvel onglet Exports */}
        <TabsContent value="exports">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="h-5 w-5" aria-hidden="true" />
                  Historique des exports
                </CardTitle>
                <Button variant="outline" size="sm" onClick={refresh}>
                  <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {exports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileDown className="h-8 w-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                  <p>Aucun export demandé</p>
                  <Button 
                    variant="link" 
                    onClick={() => handleExportData('all')}
                    className="mt-2"
                  >
                    Demander un export
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {exports.map((exp) => (
                    <motion.div
                      key={exp.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FileDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">
                            Export {exp.type === 'all' ? 'complet' : exp.type}
                          </span>
                          {getExportStatusBadge(exp.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Demandé le {formatDate(exp.created_at)}
                          {exp.file_size_bytes && (
                            <span className="ml-2">
                              • {(exp.file_size_bytes / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>
                      {exp.status === 'ready' && exp.file_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={exp.file_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" aria-hidden="true" />
                            Télécharger
                          </a>
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" aria-hidden="true" />
                Journal d'audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {consentHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                    <p>Aucune activité enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {consentHistory.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" aria-hidden="true" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {log.granted ? 'Consentement accordé' : 'Consentement retiré'}
                            </span>
                            <Badge variant="outline" className="text-xs">{log.consent_type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Version: {log.version}
                          </p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(log.granted_at)}
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
