/**
 * CreateTeamDialog - Dialog pour créer une nouvelle équipe B2B
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
import { Loader2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTeam } from '@/features/b2b/api';
import type { CreateTeamInput } from '@/features/b2b/types';

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  onSuccess?: () => void;
}

export const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({
  open,
  onOpenChange,
  orgId,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTeamInput>({
    name: '',
    description: '',
    leadEmail: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: 'Erreur', description: 'Le nom de l\'équipe est requis', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createTeam(orgId, formData);
      
      if (result.success) {
        toast({ title: 'Succès', description: `Équipe "${formData.name}" créée avec succès` });
        setFormData({ name: '', description: '', leadEmail: '' });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({ title: 'Erreur', description: result.error || 'Impossible de créer l\'équipe', variant: 'destructive' });
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
            <Users className="h-5 w-5 text-primary" />
            Nouvelle équipe
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle équipe pour organiser vos collaborateurs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Nom de l'équipe *</Label>
            <Input
              id="team-name"
              placeholder="Ex: Équipe Marketing"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              placeholder="Description de l'équipe (optionnel)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">Email du responsable</Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="responsable@entreprise.com"
              value={formData.leadEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, leadEmail: e.target.value }))}
              disabled={isLoading}
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
                  Création...
                </>
              ) : (
                'Créer l\'équipe'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
