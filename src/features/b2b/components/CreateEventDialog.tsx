/**
 * CreateEventDialog - Dialog pour créer un nouvel événement B2B
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
import { Loader2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createEvent } from '@/features/b2b/api';
import type { CreateEventInput, B2BEvent } from '@/features/b2b/types';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgId: string;
  userId: string;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS: { value: B2BEvent['category']; label: string }[] = [
  { value: 'wellness', label: 'Bien-être' },
  { value: 'training', label: 'Formation' },
  { value: 'meditation', label: 'Méditation' },
  { value: 'team-building', label: 'Team Building' },
  { value: 'other', label: 'Autre' },
];

const LOCATION_TYPE_OPTIONS: { value: CreateEventInput['locationType']; label: string }[] = [
  { value: 'onsite', label: 'Présentiel' },
  { value: 'remote', label: 'Distanciel' },
  { value: 'hybrid', label: 'Hybride' },
];

export const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onOpenChange,
  orgId,
  userId,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateEventInput>({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    endTime: '10:00',
    location: '',
    locationType: 'onsite',
    maxParticipants: 20,
    category: 'wellness'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.date) {
      toast({ title: 'Erreur', description: 'Le titre et la date sont requis', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createEvent(orgId, userId, formData);
      
      if (result.success) {
        toast({ title: 'Succès', description: `Événement "${formData.title}" créé avec succès` });
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '09:00',
          endTime: '10:00',
          location: '',
          locationType: 'onsite',
          maxParticipants: 20,
          category: 'wellness'
        });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast({ title: 'Erreur', description: result.error || 'Impossible de créer l\'événement', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Nouvel événement
          </DialogTitle>
          <DialogDescription>
            Planifiez un événement bien-être pour vos collaborateurs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Titre de l'événement *</Label>
            <Input
              id="event-title"
              placeholder="Ex: Atelier Gestion du Stress"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="Décrivez l'événement..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date *</Label>
              <Input
                id="event-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                disabled={isLoading}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value: B2BEvent['category']) => setFormData(prev => ({ ...prev, category: value }))}
                disabled={isLoading}
              >
                <SelectTrigger id="event-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-time">Heure de début</Label>
              <Input
                id="event-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-end-time">Heure de fin</Label>
              <Input
                id="event-end-time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-location">Lieu</Label>
              <Input
                id="event-location"
                placeholder="Salle de réunion A"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-location-type">Type de lieu</Label>
              <Select
                value={formData.locationType}
                onValueChange={(value: CreateEventInput['locationType']) => setFormData(prev => ({ ...prev, locationType: value }))}
                disabled={isLoading}
              >
                <SelectTrigger id="event-location-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-max-participants">Nombre max de participants</Label>
            <Input
              id="event-max-participants"
              type="number"
              min={1}
              max={500}
              value={formData.maxParticipants}
              onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 20 }))}
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
                'Créer l\'événement'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
