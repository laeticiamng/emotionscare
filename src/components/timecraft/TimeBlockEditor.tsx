/**
 * TimeBlockEditor - Modal d'édition de bloc temporel
 */
import React, { useState, useEffect } from 'react';
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
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  Moon,
  AlertTriangle,
  Heart,
  Target,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TimeBlock, TimeBlockType, CreateTimeBlockInput } from '@/hooks/timecraft';

interface TimeBlockEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block?: TimeBlock | null;
  defaultDay?: number;
  defaultHour?: number;
  onSave: (data: CreateTimeBlockInput) => Promise<void>;
  isLoading?: boolean;
}

const blockTypes: { value: TimeBlockType; label: string; icon: LucideIcon; color: string }[] = [
  { value: 'creation', label: 'Création', icon: Sparkles, color: 'text-purple-600' },
  { value: 'recovery', label: 'Récupération', icon: Moon, color: 'text-blue-600' },
  { value: 'constraint', label: 'Contrainte', icon: AlertTriangle, color: 'text-orange-600' },
  { value: 'emotional', label: 'Charge émotionnelle', icon: Heart, color: 'text-red-600' },
  { value: 'chosen', label: 'Temps choisi', icon: Target, color: 'text-green-600' },
  { value: 'imposed', label: 'Temps subi', icon: Clock, color: 'text-gray-600' },
];

const daysOfWeek = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

export function TimeBlockEditor({
  open,
  onOpenChange,
  block,
  defaultDay = 1,
  defaultHour = 9,
  onSave,
  isLoading = false,
}: TimeBlockEditorProps) {
  const [formData, setFormData] = useState<CreateTimeBlockInput>({
    block_type: 'creation',
    day_of_week: defaultDay,
    start_hour: defaultHour,
    duration_hours: 1,
    label: '',
    notes: '',
    energy_level: 50,
  });

  useEffect(() => {
    if (block) {
      setFormData({
        block_type: block.block_type,
        day_of_week: block.day_of_week,
        start_hour: block.start_hour,
        duration_hours: block.duration_hours,
        label: block.label || '',
        notes: block.notes || '',
        energy_level: block.energy_level || 50,
        version_id: block.version_id || undefined,
      });
    } else {
      setFormData({
        block_type: 'creation',
        day_of_week: defaultDay,
        start_hour: defaultHour,
        duration_hours: 1,
        label: '',
        notes: '',
        energy_level: 50,
      });
    }
  }, [block, defaultDay, defaultHour]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onOpenChange(false);
  };

  const selectedType = blockTypes.find(t => t.value === formData.block_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {block ? 'Modifier le bloc' : 'Nouveau bloc temporel'}
          </DialogTitle>
          <DialogDescription>
            Définissez les caractéristiques de ce bloc de temps
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de bloc */}
          <div className="space-y-3">
            <Label>Type de temps</Label>
            <div className="grid grid-cols-3 gap-2">
              {blockTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.block_type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, block_type: type.value }))}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', type.color)} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Label personnalisé */}
          <div className="space-y-2">
            <Label htmlFor="label">Nom (optionnel)</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder={selectedType?.label}
            />
          </div>

          {/* Jour et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jour</Label>
              <Select
                value={String(formData.day_of_week)}
                onValueChange={(v) => setFormData(prev => ({ ...prev, day_of_week: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={String(day.value)}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Heure de début</Label>
              <Select
                value={String(formData.start_hour)}
                onValueChange={(v) => setFormData(prev => ({ ...prev, start_hour: Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {i}h00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Durée */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Durée</Label>
              <Badge variant="secondary">{formData.duration_hours}h</Badge>
            </div>
            <Slider
              value={[formData.duration_hours]}
              onValueChange={([v]) => setFormData(prev => ({ ...prev, duration_hours: v }))}
              min={0.5}
              max={8}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Niveau d'énergie */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Niveau d'énergie ressenti</Label>
              <Badge variant="outline">{formData.energy_level}%</Badge>
            </div>
            <Slider
              value={[formData.energy_level || 50]}
              onValueChange={([v]) => setFormData(prev => ({ ...prev, energy_level: v }))}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observations, contexte..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : block ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TimeBlockEditor;
