import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Mail, Plus } from 'lucide-react';
import { AlertConfiguration } from './types';

interface EmailNotificationSectionProps {
  config: Partial<AlertConfiguration>;
  onConfigChange: (updates: Partial<AlertConfiguration>) => void;
}

export const EmailNotificationSection = ({ config, onConfigChange }: EmailNotificationSectionProps) => {
  const [emailInput, setEmailInput] = useState('');

  const handleAddEmail = () => {
    if (!emailInput) return;

    const emails = config.email_recipients || [];
    if (!emails.includes(emailInput)) {
      onConfigChange({
        email_recipients: [...emails, emailInput],
      });
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    onConfigChange({
      email_recipients: (config.email_recipients || []).filter(e => e !== email),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <h3 className="text-lg font-semibold">Notifications Email</h3>
        </div>
        <Switch
          checked={config.notify_email}
          onCheckedChange={(notify_email) => onConfigChange({ notify_email })}
        />
      </div>

      {config.notify_email && (
        <div className="space-y-3">
          <Label>Destinataires</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="email@example.com"
              onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
            />
            <Button type="button" onClick={handleAddEmail} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(config.email_recipients || []).map((email) => (
              <Badge key={email} variant="secondary">
                {email}
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="ml-2 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
