import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function IntegrationsPage() {
  const integrations = [
    { name: 'Google Calendar', description: 'Synchronisez vos sessions', icon: '📅', connected: true },
    { name: 'Spotify', description: 'Intégration musicale', icon: '🎵', connected: true },
    { name: 'Slack', description: 'Notifications équipe', icon: '💬', connected: false },
    { name: 'Notion', description: 'Export du journal', icon: '📝', connected: false },
    { name: 'Zapier', description: 'Automatisations', icon: '⚡', connected: false },
    { name: 'Apple Health', description: 'Données santé', icon: '❤️', connected: true },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Intégrations</h1>
        <p className="text-muted-foreground">
          Connectez EmotionsCare avec vos outils préférés
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map((integration, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{integration.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{integration.name}</h3>
                    {integration.connected && (
                      <Badge variant="secondary" className="text-xs">
                        Connecté
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              <Switch defaultChecked={integration.connected} aria-label={`${integration.connected ? 'Déconnecter' : 'Connecter'} ${integration.name}`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
