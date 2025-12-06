import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Save, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface AlertSetting {
  id: string;
  alert_type: string;
  threshold_count: number;
  time_window_minutes: number;
  enabled: boolean;
  description: string;
  notification_emails: string[];
}

export function AlertSettingsManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ['alert-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings_alerts')
        .select('*')
        .order('alert_type');
      
      if (error) throw error;
      return data as AlertSetting[];
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async (setting: AlertSetting) => {
      const { error } = await supabase
        .from('settings_alerts')
        .update({
          threshold_count: setting.threshold_count,
          time_window_minutes: setting.time_window_minutes,
          enabled: setting.enabled,
        })
        .eq('id', setting.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-settings'] });
      toast.success('Paramètres d\'alerte mis à jour');
      setEditingId(null);
    },
    onError: (error: Error) => {
      logger.error('Failed to update alert setting', error, 'ADMIN');
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const handleSave = (setting: AlertSetting) => {
    updateSettingMutation.mutate(setting);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des paramètres d'alerte
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Paramètres d'Alerte</h2>
      </div>

      <div className="grid gap-4">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {setting.description}
                    {setting.enabled ? (
                      <Badge variant="default">Activé</Badge>
                    ) : (
                      <Badge variant="secondary">Désactivé</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Type: {setting.alert_type}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`threshold-${setting.id}`}>
                      Seuil de déclenchement
                    </Label>
                    <Input
                      id={`threshold-${setting.id}`}
                      type="number"
                      min="1"
                      value={setting.threshold_count}
                      onChange={(e) => {
                        const updated = settings.map((s) =>
                          s.id === setting.id
                            ? { ...s, threshold_count: parseInt(e.target.value) }
                            : s
                        );
                        queryClient.setQueryData(['alert-settings'], updated);
                      }}
                      disabled={!setting.enabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`window-${setting.id}`}>
                      Fenêtre temporelle (min)
                    </Label>
                    <Input
                      id={`window-${setting.id}`}
                      type="number"
                      min="1"
                      value={setting.time_window_minutes}
                      onChange={(e) => {
                        const updated = settings.map((s) =>
                          s.id === setting.id
                            ? { ...s, time_window_minutes: parseInt(e.target.value) }
                            : s
                        );
                        queryClient.setQueryData(['alert-settings'], updated);
                      }}
                      disabled={!setting.enabled}
                    />
                  </div>

                  <div className="flex items-end space-x-2">
                    <div className="flex items-center space-x-2 flex-1">
                      <Switch
                        id={`enabled-${setting.id}`}
                        checked={setting.enabled}
                        onCheckedChange={(checked) => {
                          const updated = settings.map((s) =>
                            s.id === setting.id ? { ...s, enabled: checked } : s
                          );
                          queryClient.setQueryData(['alert-settings'], updated);
                        }}
                      />
                      <Label htmlFor={`enabled-${setting.id}`}>Activé</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave(setting)}
                    disabled={updateSettingMutation.isPending}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
