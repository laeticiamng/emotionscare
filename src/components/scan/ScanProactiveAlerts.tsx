/**
 * ScanProactiveAlerts - Alertes proactives basées sur patterns émotionnels
 * Détection précoce et recommandations personnalisées
 */

import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, BellOff, AlertTriangle, TrendingDown, 
  TrendingUp, Clock, Heart, Brain, Zap, X, Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  pattern: string;
  message: string;
  recommendation: string;
  detectedAt: Date;
  acknowledged: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface AlertSettings {
  enabled: boolean;
  stressAlerts: boolean;
  moodDecline: boolean;
  sleepPatterns: boolean;
  energyFluctuations: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
}

const ScanProactiveAlerts = memo(() => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      pattern: 'stress_increase',
      message: 'Augmentation du stress détectée',
      recommendation: 'Nous avons remarqué une hausse de votre niveau de stress ces 3 derniers jours. Une session de respiration pourrait vous aider.',
      detectedAt: new Date(),
      acknowledged: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'info',
      pattern: 'mood_stable',
      message: 'Humeur stable cette semaine',
      recommendation: 'Votre humeur est restée constante. Continuez vos bonnes habitudes !',
      detectedAt: new Date(Date.now() - 86400000),
      acknowledged: true,
      priority: 'low'
    },
    {
      id: '3',
      type: 'success',
      pattern: 'energy_improvement',
      message: 'Amélioration de l\'énergie',
      recommendation: 'Votre niveau d\'énergie s\'améliore. Les exercices de respiration semblent porter leurs fruits.',
      detectedAt: new Date(Date.now() - 172800000),
      acknowledged: false,
      priority: 'medium'
    }
  ]);

  const [settings, setSettings] = useState<AlertSettings>({
    enabled: true,
    stressAlerts: true,
    moodDecline: true,
    sleepPatterns: false,
    energyFluctuations: true,
    quietHoursStart: 22,
    quietHoursEnd: 7
  });

  const [showSettings, setShowSettings] = useState(false);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
    toast({ title: 'Alerte acquittée' });
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    toast({ title: 'Alerte supprimée' });
  };

  const updateSetting = <K extends keyof AlertSettings>(key: K, value: AlertSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success': return <TrendingUp className="h-5 w-5 text-green-500" />;
      default: return <Brain className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBorder = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return 'border-l-yellow-500';
      case 'critical': return 'border-l-red-500';
      case 'success': return 'border-l-green-500';
      default: return 'border-l-blue-500';
    }
  };

  const getPriorityBadge = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Haute</Badge>;
      case 'medium': return <Badge variant="secondary">Moyenne</Badge>;
      default: return <Badge variant="outline">Basse</Badge>;
    }
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {settings.enabled ? (
              <Bell className="h-5 w-5" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
            Alertes Proactives
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unacknowledgedCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Fermer' : 'Paramètres'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Panneau paramètres */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-muted/50 space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Alertes activées</span>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(v) => updateSetting('enabled', v)}
                    aria-label="Activer les alertes"
                  />
                </div>

                {settings.enabled && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm">Alertes stress</span>
                        </div>
                        <Switch
                          checked={settings.stressAlerts}
                          onCheckedChange={(v) => updateSetting('stressAlerts', v)}
                          aria-label="Alertes stress"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm">Baisse d'humeur</span>
                        </div>
                        <Switch
                          checked={settings.moodDecline}
                          onCheckedChange={(v) => updateSetting('moodDecline', v)}
                          aria-label="Alertes humeur"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">Fluctuations énergie</span>
                        </div>
                        <Switch
                          checked={settings.energyFluctuations}
                          onCheckedChange={(v) => updateSetting('energyFluctuations', v)}
                          aria-label="Alertes énergie"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Heures calmes: {settings.quietHoursStart}h - {settings.quietHoursEnd}h
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des alertes */}
        {!settings.enabled ? (
          <div className="text-center py-8 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Les alertes sont désactivées</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Check className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>Aucune alerte pour le moment</p>
            <p className="text-sm">Nous vous préviendrons si nous détectons des patterns inhabituels</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-lg border-l-4 bg-card ${getAlertBorder(alert.type)} ${
                  alert.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{alert.message}</h4>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.recommendation}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Détecté {new Date(alert.detectedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => acknowledgeAlert(alert.id)}
                        title="Acquitter"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissAlert(alert.id)}
                      title="Supprimer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ScanProactiveAlerts.displayName = 'ScanProactiveAlerts';

export default ScanProactiveAlerts;
