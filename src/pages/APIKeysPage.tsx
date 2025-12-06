import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Plus, Copy, Trash2 } from 'lucide-react';

export default function APIKeysPage() {
  const apiKeys = [
    { name: 'Production Key', created: '2025-01-15', lastUsed: '2 heures', key: 'ec_prod_***********' },
    { name: 'Development Key', created: '2025-01-10', lastUsed: '1 jour', key: 'ec_dev_***********' },
  ];

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Clés API</h1>
          <p className="text-muted-foreground">
            Gérez vos clés d'accès API
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle clé
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Clés actives</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez ces clés pour accéder à l'API
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {apiKeys.map((key, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{key.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Créée le {key.created}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label="Copier la clé API">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Supprimer la clé API">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={key.key} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Dernière utilisation: {key.lastUsed}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
