import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Plus, Filter } from 'lucide-react';
import { AlertConfiguration } from './types';
import { EmailNotificationSection } from './EmailNotificationSection';
import { SlackNotificationSection } from './SlackNotificationSection';
import { DiscordNotificationSection } from './DiscordNotificationSection';
import { ThrottleSettingsSection } from './ThrottleSettingsSection';

interface AlertConfigFormProps {
  config: Partial<AlertConfiguration>;
  onConfigChange: (updates: Partial<AlertConfiguration>) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const AlertConfigForm = ({ config, onConfigChange, onSave, onCancel, isSaving }: AlertConfigFormProps) => {
  const [categoryInput, setCategoryInput] = useState('');

  const handleAddCategory = (type: 'included' | 'excluded') => {
    if (!categoryInput) return;

    const field = type === 'included' ? 'included_categories' : 'excluded_categories';
    const categories = config[field] || [];

    if (!categories.includes(categoryInput)) {
      onConfigChange({
        [field]: [...categories, categoryInput],
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string, type: 'included' | 'excluded') => {
    const field = type === 'included' ? 'included_categories' : 'excluded_categories';
    onConfigChange({
      [field]: (config[field] || []).filter(c => c !== category),
    });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enabled">Configuration active</Label>
          <Switch
            id="enabled"
            checked={config.enabled}
            onCheckedChange={(enabled) => onConfigChange({ enabled })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            value={config.name}
            onChange={(e) => onConfigChange({ name: e.target.value })}
            placeholder="Ex: Alertes critiques production"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={config.description || ''}
            onChange={(e) => onConfigChange({ description: e.target.value })}
            placeholder="Description optionnelle"
            rows={2}
          />
        </div>
      </div>

      <Separator />

      {/* Thresholds */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="text-lg font-semibold">Seuils et Filtres</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_priority">Priorité minimale</Label>
            <Select
              value={config.min_priority}
              onValueChange={(value) => onConfigChange({ min_priority: value as any })}
            >
              <SelectTrigger id="min_priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_severity">Gravité minimale</Label>
            <Select
              value={config.min_severity}
              onValueChange={(value) => onConfigChange({ min_severity: value as any })}
            >
              <SelectTrigger id="min_severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="require_alert_flag">Nécessite flag d'alerte AI</Label>
          <Switch
            id="require_alert_flag"
            checked={config.require_alert_flag}
            onCheckedChange={(require_alert_flag) => onConfigChange({ require_alert_flag })}
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <Label>Catégories incluses</Label>
          <div className="flex gap-2">
            <Input
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="Ex: auth, api, typescript..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory('included')}
            />
            <Button type="button" onClick={() => handleAddCategory('included')} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(config.included_categories || []).map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
                <button
                  onClick={() => handleRemoveCategory(cat, 'included')}
                  className="ml-2 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Catégories exclues</Label>
          <div className="flex gap-2">
            <Input
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="Ex: ui, performance..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory('excluded')}
            />
            <Button type="button" onClick={() => handleAddCategory('excluded')} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(config.excluded_categories || []).map((cat) => (
              <Badge key={cat} variant="destructive">
                {cat}
                <button
                  onClick={() => handleRemoveCategory(cat, 'excluded')}
                  className="ml-2 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Email Notifications */}
      <EmailNotificationSection config={config} onConfigChange={onConfigChange} />

      <Separator />

      {/* Slack Notifications */}
      <SlackNotificationSection config={config} onConfigChange={onConfigChange} />

      <Separator />

      {/* Discord Notifications */}
      <DiscordNotificationSection config={config} onConfigChange={onConfigChange} />

      <Separator />

      {/* Advanced Settings */}
      <ThrottleSettingsSection config={config} onConfigChange={onConfigChange} />

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};
