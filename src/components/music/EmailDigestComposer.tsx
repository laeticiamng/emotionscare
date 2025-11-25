// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Clock,
  Calendar,
  Music,
  Heart,
  TrendingUp,
  Star,
  Bell,
  Send,
  Eye,
  Settings,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface DigestSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek: number;
  time: string;
  email: string;
  sections: {
    listeningStats: boolean;
    topTracks: boolean;
    moodAnalysis: boolean;
    recommendations: boolean;
    achievements: boolean;
    communityHighlights: boolean;
  };
  format: 'detailed' | 'summary';
}

const defaultSettings: DigestSettings = {
  enabled: true,
  frequency: 'weekly',
  dayOfWeek: 1, // Monday
  time: '09:00',
  email: '',
  sections: {
    listeningStats: true,
    topTracks: true,
    moodAnalysis: true,
    recommendations: true,
    achievements: true,
    communityHighlights: false,
  },
  format: 'detailed',
};

const daysOfWeek = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

const sections = [
  {
    key: 'listeningStats',
    label: 'Statistiques d\'écoute',
    description: 'Temps total, nombre de pistes écoutées',
    icon: Clock,
  },
  {
    key: 'topTracks',
    label: 'Top titres',
    description: 'Vos morceaux les plus écoutés',
    icon: Star,
  },
  {
    key: 'moodAnalysis',
    label: 'Analyse émotionnelle',
    description: 'Corrélation musique/émotions',
    icon: Heart,
  },
  {
    key: 'recommendations',
    label: 'Recommandations IA',
    description: 'Suggestions personnalisées',
    icon: Sparkles,
  },
  {
    key: 'achievements',
    label: 'Succès et badges',
    description: 'Vos accomplissements récents',
    icon: TrendingUp,
  },
  {
    key: 'communityHighlights',
    label: 'Highlights communauté',
    description: 'Tendances de la communauté',
    icon: Music,
  },
];

export const EmailDigestComposer: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<DigestSettings>(defaultSettings);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = <K extends keyof DigestSettings>(
    key: K,
    value: DigestSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (sectionKey: keyof DigestSettings['sections']) => {
    setSettings((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: !prev.sections[sectionKey],
      },
    }));
  };

  const handleSave = async () => {
    if (!settings.email) {
      toast({
        title: 'Email requis',
        description: 'Veuillez entrer une adresse email.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Paramètres enregistrés',
        description: 'Vos préférences de digest ont été mises à jour.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!settings.email) {
      toast({
        title: 'Email requis',
        description: 'Veuillez entrer une adresse email.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Email de test envoyé',
      description: `Un aperçu a été envoyé à ${settings.email}`,
    });
  };

  const getNextDeliveryDate = () => {
    const now = new Date();
    const [hours, minutes] = settings.time.split(':').map(Number);

    if (settings.frequency === 'daily') {
      const next = new Date(now);
      next.setHours(hours, minutes, 0, 0);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      return next;
    }

    if (settings.frequency === 'weekly') {
      const next = new Date(now);
      const daysUntilTarget = (settings.dayOfWeek - now.getDay() + 7) % 7 || 7;
      next.setDate(next.getDate() + daysUntilTarget);
      next.setHours(hours, minutes, 0, 0);
      return next;
    }

    // Monthly - first of next month
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    next.setHours(hours, minutes, 0, 0);
    return next;
  };

  const selectedSectionsCount = Object.values(settings.sections).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Digest Email Musical</CardTitle>
                <CardDescription>
                  Recevez un résumé périodique de votre activité musicale
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Activer</span>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <AnimatePresence>
        {settings.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Schedule Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Planification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fréquence</Label>
                    <Select
                      value={settings.frequency}
                      onValueChange={(value: any) =>
                        updateSetting('frequency', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.frequency === 'weekly' && (
                    <div className="space-y-2">
                      <Label>Jour de la semaine</Label>
                      <Select
                        value={settings.dayOfWeek.toString()}
                        onValueChange={(value) =>
                          updateSetting('dayOfWeek', parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem
                              key={day.value}
                              value={day.value.toString()}
                            >
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Heure d'envoi</Label>
                    <Input
                      type="time"
                      value={settings.time}
                      onChange={(e) => updateSetting('time', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Prochain envoi:{' '}
                    <span className="font-medium">
                      {getNextDeliveryDate().toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Contenu du digest
                  </CardTitle>
                  <Badge variant="outline">
                    {selectedSectionsCount} sections sélectionnées
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isChecked =
                    settings.sections[section.key as keyof DigestSettings['sections']];

                  return (
                    <div
                      key={section.key}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                        isChecked ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={section.key}
                          checked={isChecked}
                          onCheckedChange={() =>
                            toggleSection(
                              section.key as keyof DigestSettings['sections']
                            )
                          }
                        />
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-5 w-5 ${
                              isChecked ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                          <div>
                            <Label
                              htmlFor={section.key}
                              className="cursor-pointer"
                            >
                              {section.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Format Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      value: 'detailed',
                      label: 'Détaillé',
                      description: 'Rapport complet avec graphiques et analyses',
                    },
                    {
                      value: 'summary',
                      label: 'Résumé',
                      description: 'Version condensée avec les points clés',
                    },
                  ].map((format) => (
                    <div
                      key={format.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        settings.format === format.value
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-muted-foreground/50'
                      }`}
                      onClick={() =>
                        updateSetting('format', format.value as any)
                      }
                    >
                      <div className="flex items-center gap-2">
                        {settings.format === format.value && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-medium">{format.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 min-w-[150px]"
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button
                variant="outline"
                onClick={handleSendTestEmail}
                className="flex-1 min-w-[150px]"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer un test
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 min-w-[150px]"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!settings.enabled && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Activez le digest pour recevoir des résumés par email
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailDigestComposer;
