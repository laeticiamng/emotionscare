/**
 * JournalTherapistShare - Partage sécurisé avec thérapeute
 * Permet de partager des entrées de journal avec un professionnel de santé
 */

import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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

const MOCK_ENTRIES: SharedEntry[] = [
  { id: '1', title: 'Réflexions sur ma semaine', date: new Date(), shared: true },
  { id: '2', title: 'Moment de gratitude', date: new Date(Date.now() - 86400000), shared: false },
  { id: '3', title: 'Exercice de respiration', date: new Date(Date.now() - 172800000), shared: true },
  { id: '4', title: 'Objectifs du mois', date: new Date(Date.now() - 259200000), shared: false }
];

const JournalTherapistShare = memo(() => {
  const { toast } = useToast();
  const [therapist, setTherapist] = useState<TherapistConnection | null>({
    id: '1',
    name: 'Dr. Marie Dupont',
    email: 'dr.dupont@cabinet.fr',
    verified: true,
    connectedAt: new Date(Date.now() - 2592000000),
    accessLevel: 'selected'
  });
  const [entries, setEntries] = useState<SharedEntry[]>(MOCK_ENTRIES);
  const [newTherapistEmail, setNewTherapistEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [autoShare, setAutoShare] = useState(false);
  const [endToEndEncryption, setEndToEndEncryption] = useState(true);

  const toggleEntryShare = (entryId: string) => {
    setEntries(prev => prev.map(e => 
      e.id === entryId ? { ...e, shared: !e.shared } : e
    ));
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

  const sharedCount = entries.filter(e => e.shared).length;

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
              {entries.map(entry => (
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
              ))}
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
