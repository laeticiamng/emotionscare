import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock } from 'lucide-react';

export default function IntegrationsPage() {
  const integrations = [
    { name: 'Google Calendar', description: 'Synchronisez vos sessions', icon: '📅' },
    { name: 'Spotify', description: 'Intégration musicale', icon: '🎵' },
    { name: 'Slack', description: 'Notifications équipe', icon: '💬' },
    { name: 'Notion', description: 'Export du journal', icon: '📝' },
    { name: 'Zapier', description: 'Automatisations', icon: '⚡' },
    { name: 'Apple Health', description: 'Données santé', icon: '❤️' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Intégrations</h1>
        <p className="text-muted-foreground">
          Connectez EmotionsCare avec vos outils préférés
        </p>
        <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Disponible prochainement
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map((integration, i) => (
          <Card key={i} className="p-6 opacity-60">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{integration.icon}</div>
              <div>
                <h3 className="font-semibold">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
