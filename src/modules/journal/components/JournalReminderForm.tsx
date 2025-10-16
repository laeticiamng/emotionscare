import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { JournalReminder, CreateReminderParams } from '@/services/journalReminders';

const reminderSchema = z.object({
  reminder_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:MM requis'),
  days_of_week: z.array(z.number().min(0).max(6)).min(1, 'Sélectionnez au moins un jour'),
  message: z.string().max(200).optional(),
  is_active: z.boolean().optional(),
});

interface JournalReminderFormProps {
  reminder?: JournalReminder;
  onSubmit: (data: CreateReminderParams) => Promise<void>;
  onCancel: () => void;
}

const daysOfWeek = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

/**
 * Formulaire de création/édition de rappel de journal
 */
export const JournalReminderForm = memo<JournalReminderFormProps>(({
  reminder,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateReminderParams>({
    resolver: zodResolver(reminderSchema),
    defaultValues: reminder
      ? {
          reminder_time: reminder.reminder_time,
          days_of_week: reminder.days_of_week,
          message: reminder.message || '',
          is_active: reminder.is_active,
        }
      : {
          reminder_time: '09:00',
          days_of_week: [1, 2, 3, 4, 5], // Lun-Ven par défaut
          message: '',
          is_active: true,
        },
  });

  const selectedDays = watch('days_of_week') || [];

  const toggleDay = (day: number) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day].sort((a, b) => a - b);
    setValue('days_of_week', newDays, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reminder_time">Heure du rappel</Label>
        <Input
          id="reminder_time"
          type="time"
          {...register('reminder_time')}
          aria-invalid={!!errors.reminder_time}
        />
        {errors.reminder_time && (
          <p className="text-sm text-destructive">{errors.reminder_time.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Jours de la semaine</Label>
        <div className="grid grid-cols-2 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={selectedDays.includes(day.value)}
                onCheckedChange={() => toggleDay(day.value)}
              />
              <Label
                htmlFor={`day-${day.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {day.label}
              </Label>
            </div>
          ))}
        </div>
        {errors.days_of_week && (
          <p className="text-sm text-destructive">{errors.days_of_week.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message personnalisé (optionnel)</Label>
        <Textarea
          id="message"
          placeholder="Temps d'écrire dans votre journal..."
          maxLength={200}
          {...register('message')}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : reminder ? 'Mettre à jour' : 'Créer le rappel'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
});

JournalReminderForm.displayName = 'JournalReminderForm';
