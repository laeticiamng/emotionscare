import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Clock, TrendingUp, Users, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NotificationLevel {
  level: number;
  roles: string[];
  priority: string;
}

interface EscalationRule {
  id: string;
  name: string;
  description: string;
  delay_hours: number;
  max_escalation_level: number;
  priority_increase: boolean;
  notification_levels: NotificationLevel[];
  is_active: boolean;
}

export default function AlertEscalationConfig() {
  const { toast } = useToast();
  const [rules, setRules] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<EscalationRule | null>(null);
  const [newLevel, setNewLevel] = useState<NotificationLevel>({
    level: 1,
    roles: [],
    priority: 'medium',
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('alert_escalation_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRule = async () => {
    if (!editingRule) return;

    try {
      const { error } = await supabase
        .from('alert_escalation_rules')
        .upsert({
          ...editingRule,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Règle d\'escalade sauvegardée',
      });

      await loadRules();
      setEditingRule(null);
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
    }
  };

  const addNotificationLevel = () => {
    if (!editingRule) return;
    
    const maxLevel = Math.max(0, ...editingRule.notification_levels.map(l => l.level));
    const newLevelData = {
      ...newLevel,
      level: maxLevel + 1,
    };

    setEditingRule({
      ...editingRule,
      notification_levels: [...editingRule.notification_levels, newLevelData],
    });

    setNewLevel({
      level: maxLevel + 2,
      roles: [],
      priority: 'medium',
    });
  };

  const removeNotificationLevel = (level: number) => {
    if (!editingRule) return;
    
    setEditingRule({
      ...editingRule,
      notification_levels: editingRule.notification_levels.filter(l => l.level !== level),
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuration de l'Escalade des Alertes</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les règles d'escalade automatique et les niveaux de notification
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Règles actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Délai moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.length > 0
                ? Math.round(rules.reduce((acc, r) => acc + r.delay_hours, 0) / rules.length)
                : 0}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveaux max</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.length > 0 ? Math.max(...rules.map(r => r.max_escalation_level)) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des règles */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {rule.name}
                    {rule.is_active && <Badge variant="default">Active</Badge>}
                  </CardTitle>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setEditingRule(rule)}
                >
                  Modifier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Délai d'escalade</p>
                  <p className="font-semibold">{rule.delay_hours}h</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Niveaux max</p>
                  <p className="font-semibold">{rule.max_escalation_level}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Augmentation priorité</p>
                  <p className="font-semibold">{rule.priority_increase ? 'Oui' : 'Non'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Niveaux notif</p>
                  <p className="font-semibold">{rule.notification_levels.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal d'édition */}
      {editingRule && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-background shadow-lg">
          <CardHeader>
            <CardTitle>Modifier la règle d'escalade</CardTitle>
            <CardDescription>
              Configurez les paramètres d'escalade automatique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nom de la règle</Label>
                <Input
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editingRule.description || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Délai avant escalade (heures)</Label>
                  <Input
                    type="number"
                    value={editingRule.delay_hours}
                    onChange={(e) =>
                      setEditingRule({ ...editingRule, delay_hours: parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Niveaux d'escalade maximum</Label>
                  <Input
                    type="number"
                    value={editingRule.max_escalation_level}
                    onChange={(e) =>
                      setEditingRule({
                        ...editingRule,
                        max_escalation_level: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingRule.priority_increase}
                  onCheckedChange={(checked) =>
                    setEditingRule({ ...editingRule, priority_increase: checked })
                  }
                />
                <Label>Augmenter automatiquement la priorité à chaque niveau</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingRule.is_active}
                  onCheckedChange={(checked) =>
                    setEditingRule({ ...editingRule, is_active: checked })
                  }
                />
                <Label>Règle active</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Niveaux de notification
                </h3>
                <Button onClick={addNotificationLevel} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un niveau
                </Button>
              </div>

              <div className="space-y-3">
                {editingRule.notification_levels
                  .sort((a, b) => a.level - b.level)
                  .map((level) => (
                    <Card key={level.level}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge>Niveau {level.level}</Badge>
                              <Badge variant="outline">{level.priority}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Rôles notifiés : {level.roles.join(', ')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotificationLevel(level.level)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={saveRule} className="flex-1">
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={() => setEditingRule(null)} className="flex-1">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
