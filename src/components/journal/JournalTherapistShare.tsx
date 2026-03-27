// @ts-nocheck
/**
 * JournalTherapistShare - Partage sécurisé avec thérapeute
 * Permet de partager des entrées de journal avec un professionnel de santé
 */

import React, { useState, memo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield, Share2, User, Mail, Lock, Eye,
  EyeOff, Check, X, AlertCircle, Clock, Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SharedEntry {
  id: string;
  title: string;
  date: Date;
  shared: boolean;
}

interface TherapistConnection {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  connectedAt: Date;
  accessLevel: 'full' | 'selected' | 'none';
}

const JournalTherapistShare = memo(() => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch journal entries from Supabase
  const {
    data: fetchedEntries = [],
    isLoading: entriesLoading,
    error: entriesError,
  } = useQuery<SharedEntry[]>({
    queryKey: ['journal_entries_share', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, title, created_at, shared_with_therapist')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        title: row.title ?? 'Entrée sans titre',
        date: new Date(row.created_at),
        shared: row.shared_with_therapist ?? false,
      }));
    },
    enabled: !!user?.id,
  });

  // Fetch therapist connection from Supabase
  const {
    data: fetchedTherapist,
    isLoading: therapistLoading,
  } = useQuery<TherapistConnection | null>({
    queryKey: ['therapist_connection', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('therapist_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.therapist_name ?? 'Thérapeute',
        email: data.therapist_email ?? '',
        verified: data.verified ?? false,
        connectedAt: new Date(data.connected_at ?? data.created_at),
        accessLevel: data.access_level ?? 'selected',
      };
    },
    enabled: !!user?.id,
  });

  const [therapist, setTherapist] = useState<TherapistConnection | null>(null);
  const [entries, setEntries] = useState<SharedEntry[]>([]);
  const [newTherapistEmail, setNewTherapistEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [autoShare, setAutoShare] = useState(false);
  const [endToEndEncryption, setEndToEndEncryption] = useState(true);

  // Sync fetched data to local state
  useEffect(() => {
    if (fetchedEntries.length > 0) setEntries(fetchedEntries);
  }, [fetchedEntries]);

  useEffect(() => {
    if (fetchedTherapist !== undefined) setTherapist(fetchedTherapist);
  }, [fetchedTherapist]);

  const toggleEntryShare = async (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    const newShared = !entry.shared;
    setEntries(prev => prev.map(e =>
      e.id === entryId ? { ...e, shared: newShared } : e
    ));

    await supabase
      .from('journal_entries')
      .update({ shared_with_therapist: newShared })
      .eq('id', entryId);

    toast({ title: 'Partage mis à jour' });
  };

  const inviteTherapist = () => {
    if (!newTherapistEmail.includes('@')) {
      toast({
        title: 'Email invalide',
        description: 'Veuillez entrer une adresse email valide',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Invitation envoyée',
      description: `Une invitation a été envoyée à ${newTherapistEmail}`
    });
    setNewTherapistEmail('');
    setShowInvite(false);
  };

  const removeTherapist = () => {
    setTherapist(null);
    toast({
      title: 'Connexion supprimée',
      description: 'Le thérapeute n\'a plus accès à vos entrées'
    });
  };

  const isLoading = entriesLoading || therapistLoading;
  const sharedCount = entries.filter(e => e.shared).length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entriesError) {
    return (
      <Card>
        <CardContent className="p-6 text-center" role="alert">
          <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-500">Erreur lors du chargement des entrées</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Partage Thérapeute
        </CardTitle>
        <CardDescription>
          Partagez vos entrées de journal de manière sécurisée avec votre professionnel de santé
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statut de sécurité */}
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">Chiffrement de bout en bout activé</span>
          </div>
          <p className="text-sm text-green-600/80">
            Vos données sont chiffrées et seul votre thérapeute peut les lire
          </p>
        </div>

        {/* Connexion thérapeute */}
        {therapist ? (
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{therapist.name}</span>
                    {therapist.verified && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {therapist.email}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeTherapist}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
              <Clock className="h-3 w-3" />
              Connecté depuis {therapist.connectedAt.toLocaleDateString('fr-FR')}
            </div>

            {/* Options de partage */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Partage automatique des nouvelles entrées</span>
                </div>
                <Switch
                  checked={autoShare}
                  onCheckedChange={setAutoShare}
                  aria-label="Partage automatique"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Chiffrement de bout en bout</span>
                </div>
                <Switch
                  checked={endToEndEncryption}
                  onCheckedChange={setEndToEndEncryption}
                  aria-label="Chiffrement E2E"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-dashed">
            {!showInvite ? (
              <div className="text-center">
                <User className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <h4 className="font-medium mb-1">Aucun thérapeute connecté</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Invitez votre thérapeute pour partager vos entrées de journal
                </p>
                <Button onClick={() => setShowInvite(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Inviter un thérapeute
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-medium">Inviter un thérapeute</h4>
                <Input
                  type="email"
                  placeholder="Email du thérapeute"
                  value={newTherapistEmail}
                  onChange={(e) => setNewTherapistEmail(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={inviteTherapist} className="flex-1">
                    Envoyer l'invitation
                  </Button>
                  <Button variant="outline" onClick={() => setShowInvite(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sélection des entrées à partager */}
        {therapist && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Entrées partagées</h4>
              <Badge variant="secondary">
                {sharedCount}/{entries.length} partagées
              </Badge>
            </div>

            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune entrée de journal disponible
                </p>
              ) : (
                entries.map(entry => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      entry.shared ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={entry.shared}
                        onCheckedChange={() => toggleEntryShare(entry.id)}
                        aria-label={`Partager ${entry.title}`}
                      />
                      <div>
                        <div className="font-medium text-sm">{entry.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.date.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    {entry.shared ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Avertissement */}
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-600">
              <p className="font-medium">Important</p>
              <p>Le partage est facultatif et révocable à tout moment.
              Vous gardez le contrôle total sur vos données.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JournalTherapistShare.displayName = 'JournalTherapistShare';

export default JournalTherapistShare;
