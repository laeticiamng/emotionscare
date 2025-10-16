import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Edit2, Trash2, Clock } from 'lucide-react';
import type { JournalReminder } from '@/services/journalReminders';

interface JournalRemindersListProps {
  reminders: JournalReminder[];
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (reminder: JournalReminder) => void;
  onDelete: (id: string) => void;
}

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

/**
 * Liste des rappels de journal avec actions
 */
export const JournalRemindersList = memo<JournalRemindersListProps>(({
  reminders,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (reminders.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Aucun rappel configuré
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Créez un rappel pour maintenir votre habitude d'écriture
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className={reminder.is_active ? '' : 'opacity-60'}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base font-semibold">
                    {reminder.reminder_time}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reminder.message || 'Temps d\'écrire dans votre journal'}
                  </p>
                </div>
              </div>
              <Switch
                checked={reminder.is_active}
                onCheckedChange={(checked) => onToggle(reminder.id, checked)}
                aria-label="Activer/Désactiver le rappel"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1 mb-3">
              {reminder.days_of_week.map((day) => (
                <Badge
                  key={day}
                  variant={reminder.is_active ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {daysOfWeek[day]}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(reminder)}
                className="flex-1"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(reminder.id)}
                disabled={deletingId === reminder.id}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

JournalRemindersList.displayName = 'JournalRemindersList';
