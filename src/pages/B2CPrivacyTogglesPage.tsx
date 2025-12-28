import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, Shield, Camera, Mic, Heart, MapPin, Users, Coins, 
  BarChart, Sparkles, Info, Download, History, AlertCircle, CheckCircle,
  Lock, Database, FileText, Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrivacy } from '@/modules/privacy';
import { PREFERENCE_METADATA, type PrivacyPreferenceKey } from '@/modules/privacy/types';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera, Mic, Heart, MapPin, Users, Coins, BarChart, Sparkles
};

const B2CPrivacyTogglesPage = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    preferences,
    stats,
    exports,
    consentHistory,
    isLoading,
    error,
    updatePreference,
    requestExport,
    isPreferenceEnabled,
    getEnabledPreferences,
    getDisabledPreferences,
  } = usePrivacy();

  const handleToggle = async (key: PrivacyPreferenceKey, value: boolean) => {
    const success = await updatePreference(key, value);
    
    if (success) {
      toast({
        title: value ? "Préférence activée" : "Préférence désactivée",
        description: `${PREFERENCE_METADATA[key].label} ${value ? 'activé' : 'désactivé'}`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la préférence",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (type: 'all' | 'personal' | 'activity' | 'analytics') => {
    const result = await requestExport(type);
    
    if (result) {
      toast({
        title: "Export demandé",
        description: "Votre export sera prêt dans quelques minutes",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'export",
        variant: "destructive",
      });
    }
  };

  const preferenceKeys: PrivacyPreferenceKey[] = ['cam', 'mic', 'hr', 'gps', 'social', 'nft', 'analytics', 'personalization'];
  const sensorKeys = preferenceKeys.filter(k => PREFERENCE_METADATA[k].category === 'sensors');
  const sharingKeys = preferenceKeys.filter(k => PREFERENCE_METADATA[k].category === 'sharing');
  const analyticsKeys = preferenceKeys.filter(k => PREFERENCE_METADATA[k].category === 'analytics');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/app/home')} 
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Paramètres de Confidentialité
              </h1>
              <p className="text-muted-foreground">
                Contrôlez vos données et votre vie privée
              </p>
            </div>
          </div>
          
          {stats && (
            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="text-sm text-muted-foreground">Score RGPD</div>
                <div className="text-3xl font-bold text-success">{stats.gdprScore}%</div>
              </div>
              <Shield className="w-8 h-8 text-success" />
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-info/30">
              <CardContent className="p-4 text-center">
                <Database className="w-6 h-6 mx-auto mb-2 text-info" />
                <div className="text-2xl font-bold">{stats.totalDataRecords}</div>
                <div className="text-xs text-muted-foreground">Enregistrements</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
              <CardContent className="p-4 text-center">
                <Lock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.personalDataRecords}</div>
                <div className="text-xs text-muted-foreground">Données perso</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-success/30">
              <CardContent className="p-4 text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold">{stats.anonymizedRecords}</div>
                <div className="text-xs text-muted-foreground">Anonymisées</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-warning/30">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-warning" />
                <div className="text-2xl font-bold">{stats.sharedDataRecords}</div>
                <div className="text-xs text-muted-foreground">Partagées</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
            <TabsTrigger value="exports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exports</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              <span className="hidden sm:inline">Résumé</span>
            </TabsTrigger>
          </TabsList>

          {/* Préférences */}
          <TabsContent value="preferences" className="space-y-6">
            {/* Info Banner */}
            <Card className="bg-info/10 border-info/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-info mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Contrôle total</h4>
                    <p className="text-sm text-muted-foreground">
                      Vous gardez le contrôle complet de vos données. Chaque fonctionnalité 
                      dispose d'alternatives respectueuses de votre vie privée.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capteurs */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Capteurs et Périphériques
                </CardTitle>
                <CardDescription>Contrôlez l'accès aux capteurs de votre appareil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sensorKeys.map((key) => (
                  <PreferenceToggle
                    key={key}
                    prefKey={key}
                    isEnabled={isPreferenceEnabled(key)}
                    onToggle={handleToggle}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Partage */}
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Partage et Social
                </CardTitle>
                <CardDescription>Gérez le partage de vos données avec d'autres</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sharingKeys.map((key) => (
                  <PreferenceToggle
                    key={key}
                    prefKey={key}
                    isEnabled={isPreferenceEnabled(key)}
                    onToggle={handleToggle}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-card/50 backdrop-blur-sm border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-success" />
                  Analytique et Personnalisation
                </CardTitle>
                <CardDescription>Options de collecte et personnalisation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsKeys.map((key) => (
                  <PreferenceToggle
                    key={key}
                    prefKey={key}
                    isEnabled={isPreferenceEnabled(key)}
                    onToggle={handleToggle}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exports */}
          <TabsContent value="exports" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Exporter mes données
                </CardTitle>
                <CardDescription>
                  Téléchargez une copie de vos données conformément au RGPD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('all')}
                    className="h-auto p-4 flex-col gap-2"
                  >
                    <FileText className="w-6 h-6" />
                    <span className="font-medium">Export complet</span>
                    <span className="text-xs text-muted-foreground">Toutes vos données</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('personal')}
                    className="h-auto p-4 flex-col gap-2"
                  >
                    <Lock className="w-6 h-6" />
                    <span className="font-medium">Données personnelles</span>
                    <span className="text-xs text-muted-foreground">Profil et préférences</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('activity')}
                    className="h-auto p-4 flex-col gap-2"
                  >
                    <Database className="w-6 h-6" />
                    <span className="font-medium">Historique d'activité</span>
                    <span className="text-xs text-muted-foreground">Sessions et interactions</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('analytics')}
                    className="h-auto p-4 flex-col gap-2"
                  >
                    <BarChart className="w-6 h-6" />
                    <span className="font-medium">Données analytiques</span>
                    <span className="text-xs text-muted-foreground">Métriques anonymisées</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des exports */}
            {exports.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Exports précédents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exports.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{exp.type}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(exp.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          exp.status === 'ready' ? 'default' :
                          exp.status === 'processing' ? 'secondary' :
                          'destructive'
                        }>
                          {exp.status === 'ready' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {exp.status === 'processing' && <Bell className="w-3 h-3 mr-1 animate-pulse" />}
                          {exp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Historique */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Historique des consentements
                </CardTitle>
                <CardDescription>
                  Traçabilité complète de vos choix de confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent>
                {consentHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>Aucun historique disponible</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {consentHistory.slice(0, 20).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {record.granted ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          )}
                          <div>
                            <div className="font-medium text-sm">{record.consent_type}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(record.granted_at).toLocaleString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <Badge variant={record.granted ? 'default' : 'secondary'}>
                          {record.granted ? 'Accordé' : 'Révoqué'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Résumé */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-success/20">
                <CardHeader>
                  <CardTitle className="text-success flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Fonctionnalités activées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getEnabledPreferences().length === 0 ? (
                      <p className="text-muted-foreground text-sm">Aucune fonctionnalité activée</p>
                    ) : (
                      getEnabledPreferences().map((key) => {
                        const meta = PREFERENCE_METADATA[key];
                        const IconComponent = iconMap[meta.icon];
                        return (
                          <div key={key} className="flex items-center gap-2 text-sm">
                            {IconComponent && <IconComponent className="w-4 h-4 text-success" />}
                            <span>{meta.label}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-muted">
                <CardHeader>
                  <CardTitle className="text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Alternatives actives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getDisabledPreferences().length === 0 ? (
                      <p className="text-muted-foreground text-sm">Toutes les fonctionnalités sont activées</p>
                    ) : (
                      getDisabledPreferences().map((key) => {
                        const meta = PREFERENCE_METADATA[key];
                        return (
                          <div key={key} className="text-sm">
                            <span className="font-medium">{meta.label}:</span>{' '}
                            <span className="text-muted-foreground">{meta.fallback}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Score RGPD détaillé */}
            {stats && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-success" />
                    Score de conformité RGPD
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-success">{stats.gdprScore}%</div>
                      <Progress value={stats.gdprScore} className="flex-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Chiffrement activé</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>RLS activée</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Audit trail actif</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Export RGPD disponible</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});

// Composant toggle réutilisable
interface PreferenceToggleProps {
  prefKey: PrivacyPreferenceKey;
  isEnabled: boolean;
  onToggle: (key: PrivacyPreferenceKey, value: boolean) => void;
}

const PreferenceToggle = memo<PreferenceToggleProps>(({ prefKey, isEnabled, onToggle }) => {
  const meta = PREFERENCE_METADATA[prefKey];
  const IconComponent = iconMap[meta.icon];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 p-4 border rounded-lg bg-background/50"
    >
      <div className={`p-3 rounded-lg ${isEnabled ? 'bg-success/20' : 'bg-muted'}`}>
        {IconComponent && (
          <IconComponent className={`w-5 h-5 ${isEnabled ? 'text-success' : 'text-muted-foreground'}`} />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{meta.label}</h4>
          <div className="flex items-center gap-3">
            <Badge variant={isEnabled ? 'default' : 'secondary'}>
              {isEnabled ? 'Activé' : 'Désactivé'}
            </Badge>
            <Switch
              checked={isEnabled}
              onCheckedChange={(value) => onToggle(prefKey, value)}
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">
          {meta.description}
        </p>
        
        <AnimatePresence>
          {!isEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-muted/50 p-2 rounded text-xs text-muted-foreground"
            >
              <strong>Fallback:</strong> {meta.fallback}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

PreferenceToggle.displayName = 'PreferenceToggle';
B2CPrivacyTogglesPage.displayName = 'B2CPrivacyTogglesPage';

export default B2CPrivacyTogglesPage;
