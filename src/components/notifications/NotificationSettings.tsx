// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, Smartphone, Monitor, Volume2 } from 'lucide-react';

interface NotificationPreference {
  category: string;
  enabled: boolean;
  delivery_methods: string[];
  frequency: string;
}

const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      category: 'security',
      enabled: true,
      delivery_methods: ['in_app', 'email'],
      frequency: 'immediate'
    },
    {
      category: 'system',
      enabled: true,
      delivery_methods: ['in_app'],
      frequency: 'immediate'
    },
    {
      category: 'social',
      enabled: false,
      delivery_methods: ['in_app'],
      frequency: 'daily'
    },
    {
      category: 'updates',
      enabled: true,
      delivery_methods: ['in_app', 'email'],
      frequency: 'weekly'
    }
  ]);

  const updatePreference = (category: string, updates: Partial<NotificationPreference>) => {
    setPreferences(prev => prev.map(pref => 
      pref.category === category ? { ...pref, ...updates } : pref
    ));
  };

  const toggleDeliveryMethod = (category: string, method: string) => {
    const pref = preferences.find(p => p.category === category);
    if (!pref) return;

    const methods = pref.delivery_methods.includes(method)
      ? pref.delivery_methods.filter(m => m !== method)
      : [...pref.delivery_methods, method];

    updatePreference(category, { delivery_methods: methods });
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case 'in_app': return <Bell className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'push': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'sound': return <Volume2 className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'security': return 'Sécurité & Accès';
      case 'system': return 'Système & Maintenance';
      case 'social': return 'Social & Communauté';
      case 'updates': return 'Mises à jour';
      default: return category;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferences.map((pref) => (
          <div key={pref.category} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{getCategoryLabel(pref.category)}</h4>
                <p className="text-sm text-muted-foreground">
                  Gérez les notifications pour cette catégorie
                </p>
              </div>
              <Switch
                checked={pref.enabled}
                onCheckedChange={(enabled) => updatePreference(pref.category, { enabled })}
              />
            </div>

            {pref.enabled && (
              <div className="pl-4 space-y-3">
                {/* Delivery Methods */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Méthodes de livraison
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['in_app', 'email', 'push', 'desktop'].map((method) => (
                      <Button
                        key={method}
                        variant={pref.delivery_methods.includes(method) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleDeliveryMethod(pref.category, method)}
                        className="flex items-center gap-2"
                      >
                        {getDeliveryIcon(method)}
                        {method === 'in_app' && 'App'}
                        {method === 'email' && 'Email'}
                        {method === 'push' && 'Push'}
                        {method === 'desktop' && 'Bureau'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Fréquence
                  </label>
                  <Select
                    value={pref.frequency}
                    onValueChange={(frequency) => updatePreference(pref.category, { frequency })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiat</SelectItem>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Separator />
          </div>
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">
            Réinitialiser
          </Button>
          <Button>
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
