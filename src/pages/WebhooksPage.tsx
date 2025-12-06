import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Webhook, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  lastTrigger?: string;
  createdAt: string;
}

const AVAILABLE_EVENTS = [
  'scan.completed',
  'goal.achieved',
  'session.started',
  'session.completed',
  'mood.changed',
  'achievement.unlocked',
  'report.generated',
];

export default function WebhooksPage() {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [formData, setFormData] = useState({
    url: '',
    events: [] as string[],
  });

  // Charger les webhooks depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('webhooks');
    if (saved) {
      try {
        setWebhooks(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading webhooks:', error);
      }
    }
  }, []);

  // Sauvegarder les webhooks dans localStorage
  useEffect(() => {
    if (webhooks.length > 0 || localStorage.getItem('webhooks')) {
      localStorage.setItem('webhooks', JSON.stringify(webhooks));
    }
  }, [webhooks]);

  const handleOpenDialog = (webhook?: WebhookConfig) => {
    if (webhook) {
      setEditingWebhook(webhook);
      setFormData({
        url: webhook.url,
        events: webhook.events,
      });
    } else {
      setEditingWebhook(null);
      setFormData({ url: '', events: [] });
    }
    setIsDialogOpen(true);
  };

  const handleSaveWebhook = () => {
    if (!formData.url || formData.events.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    if (editingWebhook) {
      // Modifier un webhook existant
      setWebhooks(webhooks.map(w =>
        w.id === editingWebhook.id
          ? { ...w, url: formData.url, events: formData.events }
          : w
      ));
      toast({
        title: 'Webhook modifié',
        description: 'Le webhook a été mis à jour avec succès',
      });
    } else {
      // Créer un nouveau webhook
      const newWebhook: WebhookConfig = {
        id: Date.now().toString(),
        url: formData.url,
        events: formData.events,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setWebhooks([...webhooks, newWebhook]);
      toast({
        title: 'Webhook créé',
        description: 'Le webhook a été ajouté avec succès',
      });
    }

    setIsDialogOpen(false);
    setFormData({ url: '', events: [] });
    setEditingWebhook(null);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast({
      title: 'Webhook supprimé',
      description: 'Le webhook a été supprimé avec succès',
    });
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Webhooks</h1>
          <p className="text-muted-foreground">
            Configurez des webhooks pour recevoir des notifications
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? 'Modifier le webhook' : 'Nouveau webhook'}
              </DialogTitle>
              <DialogDescription>
                Configurez l'URL et les événements pour ce webhook
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL du webhook</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/webhook"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Événements à écouter</Label>
                <div className="space-y-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Checkbox
                        id={event}
                        checked={formData.events.includes(event)}
                        onCheckedChange={() => toggleEvent(event)}
                      />
                      <label
                        htmlFor={event}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {event}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveWebhook}>
                {editingWebhook ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <Card className="p-12 text-center">
          <Webhook className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun webhook configuré</h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre premier webhook
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un webhook
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="p-6">
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
                        {webhook.lastTrigger
                          ? `Dernière exécution: ${webhook.lastTrigger}`
                          : 'Jamais déclenché'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(webhook)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Événements</Label>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
