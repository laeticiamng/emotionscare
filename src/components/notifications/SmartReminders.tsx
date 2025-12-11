/**
 * Smart Reminders - Rappels intelligents basés sur les patterns utilisateur
 * Analyse les habitudes pour proposer des rappels personnalisés
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bell,
  Brain,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  LucideIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReminderPattern {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'smart';
  bestTime?: string;
  confidence: number;
}

interface UserPattern {
  mostActiveHour: number;
  preferredDays: string[];
  completionRate: number;
  streakDays: number;
  lastActivity: Date;
}

export const SmartReminders: React.FC = () => {
  const { toast } = useToast();
  const [patterns, setPatterns] = useState<ReminderPattern[]>([
    {
      id: 'morning-scan',
      name: 'Scan matinal',
      description: 'Analysez votre état émotionnel au réveil',
      icon: Sun,
      enabled: true,
      frequency: 'smart',
      bestTime: '08:00',
      confidence: 92
    },
    {
      id: 'journal-prompt',
      name: 'Journal quotidien',
      description: 'Prenez un moment pour écrire vos pensées',
      icon: Coffee,
      enabled: true,
      frequency: 'daily',
      bestTime: '21:00',
      confidence: 85
    },
    {
      id: 'breathing-break',
      name: 'Pause respiratoire',
      description: 'Une courte session de respiration guidée',
      icon: Zap,
      enabled: false,
      frequency: 'smart',
      bestTime: '14:00',
      confidence: 78
    },
    {
      id: 'weekly-review',
      name: 'Bilan hebdomadaire',
      description: 'Consultez vos progrès de la semaine',
      icon: Target,
      enabled: true,
      frequency: 'weekly',
      bestTime: 'Dimanche 10:00',
      confidence: 88
    },
    {
      id: 'evening-reflection',
      name: 'Réflexion du soir',
      description: 'Terminez la journée en douceur',
      icon: Moon,
      enabled: false,
      frequency: 'daily',
      bestTime: '22:00',
      confidence: 72
    }
  ]);

  const [userPattern, setUserPattern] = useState<UserPattern>({
    mostActiveHour: 9,
    preferredDays: ['Lundi', 'Mercredi', 'Vendredi'],
    completionRate: 78,
    streakDays: 12,
    lastActivity: new Date()
  });

  const [settings, setSettings] = useState({
    smartMode: true,
    quietHoursStart: 22,
    quietHoursEnd: 7,
    maxNotificationsPerDay: 3
  });

  const togglePattern = (id: string) => {
    setPatterns(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    
    const pattern = patterns.find(p => p.id === id);
    toast({
      title: pattern?.enabled ? 'Rappel désactivé' : 'Rappel activé',
      description: `${pattern?.name} ${pattern?.enabled ? 'ne vous sera plus envoyé' : 'est maintenant actif'}.`
    });
  };

  const enabledCount = patterns.filter(p => p.enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Rappels Intelligents
          </h2>
          <p className="text-muted-foreground">
            Notifications personnalisées selon vos habitudes
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Bell className="h-3 w-3" />
          {enabledCount} actif{enabledCount > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Insights utilisateur */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Vos patterns détectés</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{userPattern.mostActiveHour}h</p>
              <p className="text-xs text-muted-foreground">Heure préférée</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <TrendingUp className="h-5 w-5 mx-auto text-green-500 mb-1" />
              <p className="text-2xl font-bold">{userPattern.completionRate}%</p>
              <p className="text-xs text-muted-foreground">Taux de complétion</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Zap className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <p className="text-2xl font-bold">{userPattern.streakDays}</p>
              <p className="text-xs text-muted-foreground">Jours de suite</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Calendar className="h-5 w-5 mx-auto text-blue-500 mb-1" />
              <p className="text-lg font-bold">{userPattern.preferredDays.length}</p>
              <p className="text-xs text-muted-foreground">Jours actifs/sem</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rappels */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Rappels configurés</h3>
          {patterns.map(pattern => {
          const IconComponent = pattern.icon;
          return (
            <Card key={pattern.id} className={!pattern.enabled ? 'opacity-60' : ''}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${pattern.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      <IconComponent className={`h-5 w-5 ${pattern.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{pattern.name}</h4>
                        {pattern.frequency === 'smart' && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Brain className="h-3 w-3" />
                            IA
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pattern.bestTime}
                        </span>
                        {pattern.frequency === 'smart' && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {pattern.confidence}% confiance
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select
                      value={pattern.frequency}
                      onValueChange={(v) => {
                        setPatterns(prev => prev.map(p => 
                          p.id === pattern.id ? { ...p, frequency: v as any } : p
                        ));
                      }}
                      disabled={!pattern.enabled}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdo</SelectItem>
                        <SelectItem value="smart">Intelligent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch
                      checked={pattern.enabled}
                      onCheckedChange={() => togglePattern(pattern.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Paramètres globaux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paramètres globaux</CardTitle>
          <CardDescription>
            Configurez le comportement général des notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mode intelligent</Label>
              <p className="text-sm text-muted-foreground">
                L'IA ajuste les horaires selon vos habitudes
              </p>
            </div>
            <Switch
              checked={settings.smartMode}
              onCheckedChange={v => setSettings(prev => ({ ...prev, smartMode: v }))}
            />
          </div>

          <div className="space-y-3">
            <Label>Heures silencieuses</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={settings.quietHoursStart.toString()}
                  onValueChange={v => setSettings(prev => ({ ...prev, quietHoursStart: parseInt(v) }))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i}h</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-muted-foreground">à</span>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={settings.quietHoursEnd.toString()}
                  onValueChange={v => setSettings(prev => ({ ...prev, quietHoursEnd: parseInt(v) }))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i}h</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Notifications max par jour</Label>
              <span className="text-sm font-medium">{settings.maxNotificationsPerDay}</span>
            </div>
            <Slider
              value={[settings.maxNotificationsPerDay]}
              onValueChange={([v]) => setSettings(prev => ({ ...prev, maxNotificationsPerDay: v }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Limitez le nombre de notifications pour éviter la surcharge
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartReminders;
