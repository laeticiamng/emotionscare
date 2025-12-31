/**
 * InviteMemberDialog - Dialog pour inviter un membre à l'organisation
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendInvitation } from '@/features/b2b/api';
import type { InviteMemberInput, B2BTeam } from '@/features/b2b/types';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  teams?: B2BTeam[];
  onSuccess?: () => void;
}

export const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({
  open,
  onOpenChange,
  orgId,
  teams = [],
  onSuccess
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InviteMemberInput>({
    email: '',
    teamId: undefined,
    role: 'member',
    message: ''
  });

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast({ title: 'Erreur', description: 'L\'email est requis', variant: 'destructive' });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({ title: 'Erreur', description: 'L\'email n\'est pas valide', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendInvitation(orgId, formData);
      
      if (result.success) {
        toast({ 
          title: 'Invitation envoyée', 
          description: `Une invitation a été envoyée à ${formData.email}` 
        });
        setFormData({ email: '', teamId: undefined, role: 'member', message: '' });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({ title: 'Erreur', description: result.error || 'Impossible d\'envoyer l\'invitation', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Inviter un collaborateur
          </DialogTitle>
          <DialogDescription>
            Envoyez une invitation par email pour rejoindre votre organisation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">Email du collaborateur *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="member-email"
                type="email"
                placeholder="collaborateur@entreprise.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isLoading}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'member' | 'admin') => setFormData(prev => ({ ...prev, role: value }))}
              disabled={isLoading}
            >
              <SelectTrigger id="member-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membre</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {teams.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="member-team">Équipe (optionnel)</Label>
              <Select
                value={formData.teamId || 'none'}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  teamId: value === 'none' ? undefined : value 
                }))}
                disabled={isLoading}
              >
                <SelectTrigger id="member-team">
                  <SelectValue placeholder="Sélectionner une équipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune équipe</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="member-message">Message personnalisé (optionnel)</Label>
            <Textarea
              id="member-message"
              placeholder="Ajoutez un message personnel à l'invitation..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer l\'invitation'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
