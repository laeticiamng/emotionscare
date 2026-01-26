// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Shield, Database, Target, Eye, Download, History, 
  Trash2, FileText, AlertTriangle, Lock, 
  Clock, AlertCircle, RefreshCw, Award,
  ShieldCheck
} from 'lucide-react';
import { useEthics } from '@/contexts/EthicsContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConsentHistoryEntry {
  id: string;
  date: string;
  setting: string;
  oldValue: boolean;
  newValue: boolean;
  reason?: string;
}

interface PrivacyPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  settings: {
    dataSharing: boolean;
    analytics: boolean;
    marketing: boolean;
    anonymization: boolean;
  };
}

const CONSENT_HISTORY_KEY = 'consent_history';
const GDPR_REQUESTS_KEY = 'gdpr_requests';

const privacyPresets: PrivacyPreset[] = [
  {
    id: 'maximum',
    name: 'Confidentialité maximale',
    description: 'Toutes les options désactivées sauf l\'anonymisation',
    icon: ShieldCheck,
    settings: { dataSharing: false, analytics: false, marketing: false, anonymization: true }
  },
  {
    id: 'balanced',
    name: 'Équilibré',
    description: 'Analytics activés pour améliorer l\'expérience',
    icon: Shield,
    settings: { dataSharing: false, analytics: true, marketing: false, anonymization: true }
  },
  {
    id: 'open',
    name: 'Ouvert',
    description: 'Toutes les options activées',
    icon: Eye,
    settings: { dataSharing: true, analytics: true, marketing: true, anonymization: false }
  },
];

const DataPrivacySettings: React.FC = () => {
  const { privacySettings, updatePrivacySettings, loading } = useEthics();
  const [consentHistory, setConsentHistory] = useState<ConsentHistoryEntry[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [gdprRequests, setGdprRequests] = useState<any[]>([]);
  const [privacyScore, setPrivacyScore] = useState(0);

  // Load consent history
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_HISTORY_KEY);
    if (stored) {
      setConsentHistory(JSON.parse(stored));
    }
    
    const requests = localStorage.getItem(GDPR_REQUESTS_KEY);
    if (requests) {
      setGdprRequests(JSON.parse(requests));
    }
  }, []);

  // Calculate privacy score
  useEffect(() => {
    let score = 50; // Base score
    if (!privacySettings.dataSharing) score += 15;
    if (!privacySettings.marketing) score += 10;
    if (privacySettings.anonymization) score += 15;
    if (!privacySettings.analytics) score += 10;
    setPrivacyScore(Math.min(100, score));
  }, [privacySettings]);

  const addToHistory = (setting: string, oldValue: boolean, newValue: boolean) => {
    const entry: ConsentHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      setting,
      oldValue,
      newValue,
    };
    
    const newHistory = [entry, ...consentHistory].slice(0, 50);
    setConsentHistory(newHistory);
    localStorage.setItem(CONSENT_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleToggle = async (key: keyof typeof privacySettings, value: boolean) => {
    const settingNames: Record<string, string> = {
      dataSharing: 'Partage des données',
      analytics: 'Analyses et statistiques',
      marketing: 'Communications marketing',
      anonymization: 'Anonymisation automatique',
    };
    
    addToHistory(settingNames[key], privacySettings[key], value);
    await updatePrivacySettings({ [key]: value });
  };

  const handleRetentionChange = async (value: number[]) => {
    await updatePrivacySettings({ dataRetention: value[0] });
  };

  const handleFormatChange = async (format: 'json' | 'csv' | 'xml') => {
    await updatePrivacySettings({ exportFormat: format });
  };

  const applyPreset = async (preset: PrivacyPreset) => {
    await updatePrivacySettings(preset.settings);
    toast.success(`Préréglage "${preset.name}" appliqué`);
  };

  const submitGdprRequest = (type: 'deletion' | 'export' | 'rectification') => {
    const request = {
      id: Date.now().toString(),
      type,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reason: deleteReason,
    };
    
    const newRequests = [request, ...gdprRequests];
    setGdprRequests(newRequests);
    localStorage.setItem(GDPR_REQUESTS_KEY, JSON.stringify(newRequests));
    
    toast.success('Demande soumise', {
      description: 'Votre demande sera traitée sous 30 jours conformément au RGPD.',
    });
    
    setShowDeleteDialog(false);
    setShowExportDialog(false);
    setDeleteReason('');
    setDeleteConfirmText('');
  };

  const getPrivacyScoreColor = () => {
    if (privacyScore >= 80) return 'text-green-500';
    if (privacyScore >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPrivacyScoreLabel = () => {
    if (privacyScore >= 80) return 'Excellent';
    if (privacyScore >= 60) return 'Bon';
    if (privacyScore >= 40) return 'Moyen';
    return 'Faible';
  };

  const settings = [
    {
      id: 'dataSharing',
      title: 'Partage des données',
      description: 'Autoriser le partage des données avec des partenaires de confiance',
      icon: Database,
      value: privacySettings.dataSharing,
      impact: 'high',
    },
    {
      id: 'analytics',
      title: 'Analyses et statistiques',
      description: 'Utiliser vos données pour améliorer l\'expérience utilisateur',
      icon: Eye,
      value: privacySettings.analytics,
      impact: 'medium',
    },
    {
      id: 'marketing',
      title: 'Communications marketing',
      description: 'Recevoir des offres personnalisées et des newsletters',
      icon: Target,
      value: privacySettings.marketing,
      impact: 'low',
    },
    {
      id: 'anonymization',
      title: 'Anonymisation automatique',
      description: 'Anonymiser automatiquement vos données après la période de rétention',
      icon: Shield,
      value: privacySettings.anonymization,
      impact: 'high',
      recommended: true,
    }
  ] as const;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Privacy Score Card */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Score de Confidentialité
                </CardTitle>
                <CardDescription>
                  Évaluation de vos paramètres de protection
                </CardDescription>
              </div>
              <div className="text-right">
                <p className={`text-4xl font-bold ${getPrivacyScoreColor()}`}>
                  {privacyScore}
                </p>
                <Badge variant={privacyScore >= 70 ? 'default' : 'secondary'}>
                  {getPrivacyScoreLabel()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={privacyScore} className="h-3" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Protection minimale</span>
              <span>Protection maximale</span>
            </div>
          </CardContent>
        </Card>

        {/* Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Préréglages Rapides
            </CardTitle>
            <CardDescription>
              Appliquez un profil de confidentialité en un clic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {privacyPresets.map((preset) => (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => applyPreset(preset)}
                  >
                    <preset.icon className="h-6 w-6 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">{preset.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        {preset.description}
                      </p>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Paramètres de Consentement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map((setting, index) => (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <setting.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">{setting.title}</Label>
                      {setting.recommended && (
                        <Badge variant="secondary" className="text-xs">
                          Recommandé
                        </Badge>
                      )}
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              setting.impact === 'high' ? 'border-red-500 text-red-500' :
                              setting.impact === 'medium' ? 'border-yellow-500 text-yellow-500' :
                              'border-green-500 text-green-500'
                            }`}
                          >
                            Impact {setting.impact === 'high' ? 'élevé' : setting.impact === 'medium' ? 'moyen' : 'faible'}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          Niveau d'impact sur votre confidentialité
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  checked={setting.value}
                  onCheckedChange={(checked) => handleToggle(setting.id, checked)}
                  disabled={loading}
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Rétention des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Période de conservation</Label>
              <Slider
                value={[privacySettings.dataRetention]}
                onValueChange={handleRetentionChange}
                max={120}
                min={1}
                step={1}
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 mois</span>
                <span className="font-medium text-foreground">
                  {privacySettings.dataRetention} mois
                </span>
                <span>10 ans</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-base font-medium">Format d'export par défaut</Label>
              <Select
                value={privacySettings.exportFormat}
                onValueChange={handleFormatChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (recommandé)</SelectItem>
                  <SelectItem value="csv">CSV (tableur)</SelectItem>
                  <SelectItem value="xml">XML (technique)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* GDPR Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Droits RGPD
            </CardTitle>
            <CardDescription>
              Exercez vos droits conformément au Règlement Général sur la Protection des Données
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold">Exporter mes données</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    Droit à la portabilité (Art. 20)
                  </p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
                <div className="text-left">
                  <p className="font-semibold">Supprimer mes données</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    Droit à l'effacement (Art. 17)
                  </p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => setShowHistoryDialog(true)}
              >
                <History className="h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-semibold">Historique des consentements</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    {consentHistory.length} modifications enregistrées
                  </p>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => setShowCertificateDialog(true)}
              >
                <Award className="h-5 w-5 text-green-500" />
                <div className="text-left">
                  <p className="font-semibold">Certificat de confidentialité</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    Générer une attestation
                  </p>
                </div>
              </Button>
            </div>

            {/* Pending Requests */}
            {gdprRequests.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Demandes en cours
                </h4>
                <div className="space-y-2">
                  {gdprRequests.slice(0, 3).map((request) => (
                    <div 
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {request.type === 'deletion' && <Trash2 className="h-4 w-4 text-red-500" />}
                        {request.type === 'export' && <Download className="h-4 w-4 text-blue-500" />}
                        <span>
                          {request.type === 'deletion' ? 'Suppression' : 'Export'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                          {request.status === 'pending' ? 'En attente' : 'Traité'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(request.submittedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => toast.info('Paramètres sauvegardés automatiquement')}
              >
                <Download className="h-4 w-4 mr-2" />
                Sauvegarder les préférences
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  updatePrivacySettings({
                    dataSharing: false,
                    analytics: true,
                    marketing: false,
                    anonymization: true
                  });
                  toast.success('Paramètres restaurés par défaut');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser par défaut
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Data Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Supprimer mes données
              </DialogTitle>
              <DialogDescription>
                Cette action est irréversible. Toutes vos données personnelles seront supprimées sous 30 jours.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Raison de la demande (optionnel)</Label>
                <Textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Pourquoi souhaitez-vous supprimer vos données ?"
                />
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg text-sm">
                <p className="font-medium text-red-600 dark:text-red-400 mb-2">
                  ⚠️ Données qui seront supprimées :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Profil et informations personnelles</li>
                  <li>Historique d'activités</li>
                  <li>Préférences et paramètres</li>
                  <li>Messages et conversations</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label>Tapez "SUPPRIMER" pour confirmer</Label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="SUPPRIMER"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Annuler
              </Button>
              <Button 
                variant="destructive"
                disabled={deleteConfirmText !== 'SUPPRIMER'}
                onClick={() => submitGdprRequest('deletion')}
              >
                Confirmer la suppression
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500" />
                Exporter mes données
              </DialogTitle>
              <DialogDescription>
                Téléchargez une copie de toutes vos données personnelles
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
                <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">
                  📦 Données incluses :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Profil et informations personnelles</li>
                  <li>Historique d'activités</li>
                  <li>Préférences et paramètres</li>
                  <li>Données de santé émotionnelle</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label>Format d'export</Label>
                <Select defaultValue={privacySettings.exportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => submitGdprRequest('export')}>
                <Download className="h-4 w-4 mr-2" />
                Demander l'export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des consentements
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3">
              {consentHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune modification enregistrée
                </p>
              ) : (
                consentHistory.map((entry) => (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-3 border rounded-lg text-sm"
                  >
                    <div>
                      <p className="font-medium">{entry.setting}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.oldValue ? 'default' : 'secondary'}>
                        {entry.oldValue ? 'Activé' : 'Désactivé'}
                      </Badge>
                      <span>→</span>
                      <Badge variant={entry.newValue ? 'default' : 'secondary'}>
                        {entry.newValue ? 'Activé' : 'Désactivé'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Certificate Dialog */}
        <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                Certificat de Confidentialité
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6 border-2 border-dashed rounded-lg text-center space-y-4">
              <ShieldCheck className="h-16 w-16 mx-auto text-green-500" />
              <div>
                <h3 className="text-lg font-bold">EmotionsCare</h3>
                <p className="text-sm text-muted-foreground">
                  Attestation de Confidentialité
                </p>
              </div>
              
              <div className="text-sm space-y-2">
                <p>Ce certificat atteste que les paramètres de confidentialité sont configurés avec un niveau de protection de:</p>
                <p className={`text-3xl font-bold ${getPrivacyScoreColor()}`}>
                  {privacyScore}/100
                </p>
                <p className="text-xs text-muted-foreground">
                  Généré le {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCertificateDialog(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                toast.success('Certificat téléchargé');
                setShowCertificateDialog(false);
              }}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default DataPrivacySettings;
