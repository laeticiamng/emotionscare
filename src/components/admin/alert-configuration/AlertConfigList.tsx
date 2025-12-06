import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Mail, MessageSquare, Bell, Clock, AlertCircle } from 'lucide-react';
import { AlertConfiguration } from './types';

interface AlertConfigListProps {
  configs: AlertConfiguration[] | undefined;
  isLoading: boolean;
  onEdit: (config: AlertConfiguration) => void;
  onDelete: (id: string) => void;
}

export const AlertConfigList = ({ configs, isLoading, onEdit, onDelete }: AlertConfigListProps) => {
  const handleDelete = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la configuration "${name}" ?`)) {
      onDelete(id);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Chargement...
            </CardContent>
          </Card>
        ) : !configs || configs.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucune configuration trouvée
            </CardContent>
          </Card>
        ) : (
          configs.map((config) => (
            <Card key={config.id} className={!config.enabled ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {config.name}
                      {!config.enabled && <Badge variant="secondary">Désactivée</Badge>}
                    </CardTitle>
                    {config.description && (
                      <CardDescription>{config.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(config)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(config.id, config.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Priorité min.</div>
                    <Badge variant="outline">{config.min_priority}</Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Gravité min.</div>
                    <Badge variant="outline">{config.min_severity}</Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Throttling</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {config.throttle_minutes} min
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Max/heure</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      {config.max_alerts_per_hour}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {config.notify_email && (
                    <Badge variant="secondary">
                      <Mail className="w-3 h-3 mr-1" />
                      Email ({config.email_recipients.length})
                    </Badge>
                  )}
                  {config.notify_slack && (
                    <Badge variant="secondary">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Slack
                    </Badge>
                  )}
                  {config.notify_discord && (
                    <Badge variant="secondary">
                      <Bell className="w-3 h-3 mr-1" />
                      Discord
                    </Badge>
                  )}
                </div>

                {config.included_categories.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Catégories incluses</div>
                    <div className="flex flex-wrap gap-1">
                      {config.included_categories.map((cat) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {config.last_triggered_at && (
                  <div className="text-xs text-muted-foreground">
                    Dernière alerte: {new Date(config.last_triggered_at).toLocaleString('fr-FR')}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
};
