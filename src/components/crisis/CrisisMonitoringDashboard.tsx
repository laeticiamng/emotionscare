import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Clock, TrendingDown, CheckCircle, Phone, Activity, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CrisisAlert {
  id: string;
  crisisScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  acknowledged: boolean;
  factors: string[];
}

interface CrisisSettings {
  autoDetection: boolean;
  notifyEmergencyContact: boolean;
  showResources: boolean;
  sensitivityLevel: 'low' | 'medium' | 'high';
}

export default function CrisisMonitoringDashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [settings, setSettings] = useState<CrisisSettings>({
    autoDetection: true,
    notifyEmergencyContact: false,
    showResources: true,
    sensitivityLevel: 'medium',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCrisisData();
    }
  }, [user]);

  const loadCrisisData = async () => {
    setLoading(true);
    try {
      // Load crisis alerts history
      const { data, error } = await supabase.functions.invoke('crisis-detection', {
        body: { action: 'history' }
      });

      if (!error && data) {
        setAlerts(data.alerts || []);
        setCurrentScore(data.currentScore || 0);
      }

      // Load saved settings from localStorage
      const savedSettings = localStorage.getItem('crisis_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (err) {
      console.error('Failed to load crisis data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: keyof CrisisSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('crisis_settings', JSON.stringify(newSettings));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 50) return 'text-orange-500';
    if (score >= 30) return 'text-amber-500';
    return 'text-green-500';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'Élevé', color: 'destructive' as const };
    if (score >= 50) return { label: 'Modéré', color: 'secondary' as const };
    if (score >= 30) return { label: 'Faible', color: 'outline' as const };
    return { label: 'Très faible', color: 'default' as const };
  };

  const riskLevel = getRiskLevel(currentScore);

  return (
    <div className="space-y-6">
      {/* Score actuel */}
      <Card className="bg-gradient-to-br from-background to-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Surveillance bien-être
          </CardTitle>
          <CardDescription>
            Analyse automatique de votre état émotionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(currentScore)}`}>
                {currentScore}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Score actuel</p>
            </div>
            <div className="flex-1 space-y-2">
              <Progress value={100 - currentScore} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Risque élevé</span>
                <span>Bien-être optimal</span>
              </div>
            </div>
            <Badge variant={riskLevel.color} className="text-sm px-4 py-1">
              {riskLevel.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts" className="gap-1">
            <AlertTriangle className="h-4 w-4" />
            Alertes
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-1">
            <Phone className="h-4 w-4" />
            Ressources
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Historique des alertes */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique des alertes</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p>Aucune alerte détectée</p>
                  <p className="text-sm">Votre bien-être semble stable 💚</p>
                </div>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {alerts.map(alert => (
                      <div 
                        key={alert.id}
                        className={`p-3 rounded-lg border ${alert.acknowledged ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.detectedAt).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>Score: {alert.crisisScore}</span>
                        </div>
                        {alert.factors.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {alert.factors.map((factor, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ressources d'aide */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lignes d'écoute disponibles</CardTitle>
              <CardDescription>
                Ces services sont gratuits et confidentiels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href="tel:3114" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">3114 - Numéro national</p>
                  <p className="text-xs text-muted-foreground">Prévention du suicide - 24h/24</p>
                </div>
              </a>
              
              <a href="tel:0800235236" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Fil Santé Jeunes</p>
                  <p className="text-xs text-muted-foreground">0 800 235 236 - Gratuit et anonyme</p>
                </div>
              </a>

              <a href="tel:01 45 39 40 00" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">SOS Amitié</p>
                  <p className="text-xs text-muted-foreground">09 72 39 40 50 - Écoute 24h/24</p>
                </div>
              </a>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paramètres de détection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Détection automatique</Label>
                  <p className="text-xs text-muted-foreground">
                    Analyser automatiquement votre activité
                  </p>
                </div>
                <Switch
                  checked={settings.autoDetection}
                  onCheckedChange={(v) => handleSettingChange('autoDetection', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Afficher les ressources d'aide</Label>
                  <p className="text-xs text-muted-foreground">
                    Afficher les numéros d'urgence si besoin
                  </p>
                </div>
                <Switch
                  checked={settings.showResources}
                  onCheckedChange={(v) => handleSettingChange('showResources', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifier contact d'urgence</Label>
                  <p className="text-xs text-muted-foreground">
                    Alerter un proche en cas de crise
                  </p>
                </div>
                <Switch
                  checked={settings.notifyEmergencyContact}
                  onCheckedChange={(v) => handleSettingChange('notifyEmergencyContact', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
