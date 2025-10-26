import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Webhook, Plus, Trash2 } from 'lucide-react';

export default function WebhooksPage() {
  const webhooks = [
    { 
      url: 'https://api.example.com/webhook', 
      events: ['scan.completed', 'goal.achieved'],
      status: 'active',
      lastTrigger: '2 heures'
    },
    { 
      url: 'https://myapp.com/notifications', 
      events: ['session.started'],
      status: 'active',
      lastTrigger: '1 jour'
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Webhooks</h1>
          <p className="text-muted-foreground">
            Configurez des webhooks pour recevoir des notifications
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau webhook
        </Button>
      </div>

      <div className="space-y-4">
        {webhooks.map((webhook, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Webhook className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{webhook.url}</p>
                      <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                        {webhook.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dernière exécution: {webhook.lastTrigger}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Événements</Label>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map((event, j) => (
                    <Badge key={j} variant="outline">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
