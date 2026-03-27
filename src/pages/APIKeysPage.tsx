// @ts-nocheck
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Plus, Copy, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
}

export default function APIKeysPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState('');

  const { data: apiKeys = [], isLoading } = useQuery<ApiKey[]>({
    queryKey: ['api-keys', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, key_prefix, created_at, last_used_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const prefix = `ec_${name.toLowerCase().includes('prod') ? 'prod' : 'dev'}_`;
      const key = prefix + crypto.randomUUID().replace(/-/g, '').slice(0, 24);
      const { error } = await supabase.from('api_keys').insert({
        user_id: user?.id,
        name,
        key_prefix: prefix + '***',
        key_hash: key,
      });
      if (error) throw error;
      return key;
    },
    onSuccess: (key) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({ title: 'Clé créée', description: `Votre clé : ${key}. Copiez-la maintenant, elle ne sera plus affichée.` });
      setNewKeyName('');
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de créer la clé API', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('api_keys').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast({ title: 'Clé supprimée' });
    },
  });

  const handleCopy = async (keyPrefix: string) => {
    await navigator.clipboard.writeText(keyPrefix);
    toast({ title: 'Copié', description: 'Préfixe de clé copié dans le presse-papier' });
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR');

  const formatLastUsed = (dateStr: string | null) => {
    if (!dateStr) return 'Jamais utilisée';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Il y a moins d\'une heure';
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Cles API</h1>
          <p className="text-muted-foreground">
            Gerez vos cles d'acces API
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Nom de la cle..."
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="w-48"
          />
          <Button
            onClick={() => newKeyName.trim() && createMutation.mutate(newKeyName.trim())}
            disabled={!newKeyName.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Nouvelle cle
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Cles actives</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez ces cles pour acceder a l'API
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : apiKeys.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Aucune cle API. Creez-en une pour commencer.</p>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{key.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Creee le {formatDate(key.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Copier la cle API"
                        onClick={() => handleCopy(key.key_prefix)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Supprimer la cle API"
                        onClick={() => deleteMutation.mutate(key.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={key.key_prefix}
                      readOnly
                      className="font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Derniere utilisation: {formatLastUsed(key.last_used_at)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
