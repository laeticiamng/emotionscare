/**
 * Actions rapides pour interagir avec un buddy
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MoreVertical, 
  Phone, 
  Video, 
  Calendar, 
  Bell,
  Heart,
  Flag,
  UserMinus,
  Loader2,
  Send
} from 'lucide-react';
import type { BuddyProfile } from '../types';
import { toast } from 'sonner';

interface QuickActionsProps {
  buddy: BuddyProfile;
  matchId: string;
  onStartCall?: () => void;
  onStartVideo?: () => void;
  onScheduleActivity?: (activity: { title: string; type: string; scheduledAt?: string }) => Promise<void>;
  onSetReminder?: (message: string, time: Date) => Promise<void>;
  onReport?: (reason: string) => Promise<void>;
  onUnmatch?: () => Promise<void>;
}

const ACTIVITY_TYPES = [
  { value: 'meditation', label: '🧘 Méditation' },
  { value: 'exercise', label: '💪 Exercice' },
  { value: 'call', label: '📞 Appel' },
  { value: 'challenge', label: '🏆 Défi' }
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  buddy,
  matchId,
  onStartCall,
  onStartVideo,
  onScheduleActivity,
  onSetReminder,
  onReport,
  onUnmatch
}) => {
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activityForm, setActivityForm] = useState({
    title: '',
    type: 'meditation',
    scheduledAt: ''
  });
  const [reminderMessage, setReminderMessage] = useState('');
  const [reportReason, setReportReason] = useState('');

  const handleScheduleActivity = async () => {
    if (!activityForm.title.trim() || !onScheduleActivity) return;
    
    setLoading(true);
    try {
      await onScheduleActivity({
        title: activityForm.title,
        type: activityForm.type,
        scheduledAt: activityForm.scheduledAt || undefined
      });
      setActivityDialogOpen(false);
      setActivityForm({ title: '', type: 'meditation', scheduledAt: '' });
      toast.success('Activité programmée !');
    } catch (err) {
      toast.error('Erreur lors de la programmation');
    } finally {
      setLoading(false);
    }
  };

  const handleSetReminder = async () => {
    if (!reminderMessage.trim() || !onSetReminder) return;
    
    setLoading(true);
    try {
      await onSetReminder(reminderMessage, new Date(Date.now() + 3600000)); // +1h
      setReminderDialogOpen(false);
      setReminderMessage('');
      toast.success('Rappel créé !');
    } catch (err) {
      toast.error('Erreur lors de la création du rappel');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim() || !onReport) return;
    
    setLoading(true);
    try {
      await onReport(reportReason);
      setReportDialogOpen(false);
      setReportReason('');
      toast.success('Signalement envoyé');
    } catch (err) {
      toast.error('Erreur lors du signalement');
    } finally {
      setLoading(false);
    }
  };

  const handleUnmatch = async () => {
    if (!onUnmatch) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir vous déconnecter de ${buddy.display_name} ?`)) {
      return;
    }

    setLoading(true);
    try {
      await onUnmatch();
      toast.info('Connexion terminée');
    } catch (err) {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions rapides</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {onStartCall && (
            <DropdownMenuItem onClick={onStartCall}>
              <Phone className="h-4 w-4 mr-2" />
              Appel vocal
            </DropdownMenuItem>
          )}
          
          {onStartVideo && (
            <DropdownMenuItem onClick={onStartVideo}>
              <Video className="h-4 w-4 mr-2" />
              Appel vidéo
            </DropdownMenuItem>
          )}
          
          {onScheduleActivity && (
            <DropdownMenuItem onClick={() => setActivityDialogOpen(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Programmer une activité
            </DropdownMenuItem>
          )}
          
          {onSetReminder && (
            <DropdownMenuItem onClick={() => setReminderDialogOpen(true)}>
              <Bell className="h-4 w-4 mr-2" />
              Créer un rappel
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="text-amber-600" onClick={() => setReportDialogOpen(true)}>
            <Flag className="h-4 w-4 mr-2" />
            Signaler
          </DropdownMenuItem>
          
          {onUnmatch && (
            <DropdownMenuItem className="text-destructive" onClick={handleUnmatch}>
              <UserMinus className="h-4 w-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Programmer une activité avec {buddy.display_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                placeholder="Ex: Méditation du soir"
                value={activityForm.title}
                onChange={e => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Type d'activité</Label>
              <Select
                value={activityForm.type}
                onValueChange={v => setActivityForm(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date et heure (optionnel)</Label>
              <Input
                type="datetime-local"
                value={activityForm.scheduledAt}
                onChange={e => setActivityForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleScheduleActivity} disabled={!activityForm.title.trim() || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Programmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Créer un rappel
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Message de rappel</Label>
              <Textarea
                placeholder="Ex: Prendre des nouvelles de mon buddy"
                value={reminderMessage}
                onChange={e => setReminderMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSetReminder} disabled={!reminderMessage.trim() || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
              Créer (dans 1h)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <Flag className="h-5 w-5" />
              Signaler {buddy.display_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Décrivez la raison du signalement. Notre équipe examinera votre rapport.
            </p>
            <div className="space-y-2">
              <Label>Raison du signalement</Label>
              <Textarea
                placeholder="Décrivez le comportement problématique..."
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReport} 
              disabled={!reportReason.trim() || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Flag className="h-4 w-4 mr-2" />}
              Envoyer le signalement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
