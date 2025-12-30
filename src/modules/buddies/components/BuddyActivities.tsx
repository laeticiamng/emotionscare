/**
 * Gestion des activités partagées entre buddies
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2,
  XCircle,
  Play,
  Heart,
  Loader2,
  Sparkles
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import type { BuddyActivity, BuddyProfile } from '../types';
import { BuddyService } from '../services/buddyService';
import { toast } from 'sonner';

interface BuddyActivitiesProps {
  matchId: string;
  buddy: BuddyProfile;
  currentUserId: string;
}

const ACTIVITY_TYPES = [
  { value: 'meditation', label: 'Méditation', icon: '🧘' },
  { value: 'exercise', label: 'Exercice', icon: '💪' },
  { value: 'reading', label: 'Lecture', icon: '📚' },
  { value: 'gaming', label: 'Jeux', icon: '🎮' },
  { value: 'creative', label: 'Créatif', icon: '🎨' },
  { value: 'call', label: 'Appel', icon: '📞' },
  { value: 'challenge', label: 'Défi', icon: '🏆' }
];

const DURATIONS = [15, 30, 45, 60, 90, 120];

export const BuddyActivities: React.FC<BuddyActivitiesProps> = ({
  matchId,
  buddy,
  currentUserId
}) => {
  const [activities, setActivities] = useState<BuddyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    activity_type: 'meditation' as BuddyActivity['activity_type'],
    scheduled_at: '',
    duration_minutes: 30
  });

  useEffect(() => {
    loadActivities();
  }, [matchId]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await BuddyService.getActivities(matchId);
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async () => {
    if (!newActivity.title.trim()) return;

    setCreating(true);
    try {
      const activity = await BuddyService.createActivity(matchId, currentUserId, {
        ...newActivity,
        scheduled_at: newActivity.scheduled_at || undefined
      });
      setActivities(prev => [...prev, activity]);
      setCreateOpen(false);
      setNewActivity({
        title: '',
        description: '',
        activity_type: 'meditation',
        scheduled_at: '',
        duration_minutes: 30
      });
      toast.success('Activité créée !');
    } catch (err) {
      console.error('Error creating activity:', err);
      toast.error('Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const handleCompleteActivity = async (activityId: string) => {
    try {
      await BuddyService.completeActivity(activityId);
      setActivities(prev => 
        prev.map(a => a.id === activityId ? { ...a, status: 'completed' as const, completed_at: new Date().toISOString() } : a)
      );
      toast.success('Activité complétée ! +XP');
    } catch (err) {
      console.error('Error completing activity:', err);
      toast.error('Erreur');
    }
  };

  const getStatusBadge = (status: BuddyActivity['status']) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline" className="gap-1"><Calendar className="h-3 w-3" /> Planifiée</Badge>;
      case 'in_progress':
        return <Badge className="gap-1 bg-blue-500"><Play className="h-3 w-3" /> En cours</Badge>;
      case 'completed':
        return <Badge className="gap-1 bg-green-500"><CheckCircle2 className="h-3 w-3" /> Complétée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Annulée</Badge>;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: string) => {
    return ACTIVITY_TYPES.find(t => t.value === type)?.icon || '📌';
  };

  const upcomingActivities = activities.filter(a => a.status === 'planned' && (!a.scheduled_at || !isPast(new Date(a.scheduled_at))));
  const completedActivities = activities.filter(a => a.status === 'completed');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Activités avec {buddy.display_name}
        </h3>
        <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Nouvelle
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Aucune activité partagée pour le moment
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              Proposer une activité
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Upcoming */}
          {upcomingActivities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">À venir</h4>
              <AnimatePresence>
                {upcomingActivities.map(activity => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getActivityIcon(activity.activity_type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{activity.title}</h4>
                              {getStatusBadge(activity.status)}
                            </div>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.duration_minutes} min
                              </span>
                              {activity.scheduled_at && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(activity.scheduled_at), 'dd MMM à HH:mm', { locale: fr })}
                                </span>
                              )}
                              <Badge variant="outline" className="text-xs">
                                +{activity.xp_reward} XP
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleCompleteActivity(activity.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Terminé
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Completed */}
          {completedActivities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Complétées ({completedActivities.length})
              </h4>
              {completedActivities.slice(0, 3).map(activity => (
                <Card key={activity.id} className="opacity-75">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{getActivityIcon(activity.activity_type)}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.completed_at && formatDistanceToNow(new Date(activity.completed_at), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">+{activity.xp_reward} XP</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Activity Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle activité</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                placeholder="Ex: Méditation du matin"
                value={newActivity.title}
                onChange={e => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Type d'activité</Label>
              <Select
                value={newActivity.activity_type}
                onValueChange={v => setNewActivity(prev => ({ ...prev, activity_type: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Détails de l'activité..."
                value={newActivity.description}
                onChange={e => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durée</Label>
                <Select
                  value={String(newActivity.duration_minutes)}
                  onValueChange={v => setNewActivity(prev => ({ ...prev, duration_minutes: Number(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => (
                      <SelectItem key={d} value={String(d)}>{d} minutes</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date & Heure (optionnel)</Label>
                <Input
                  type="datetime-local"
                  value={newActivity.scheduled_at}
                  onChange={e => setNewActivity(prev => ({ ...prev, scheduled_at: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Annuler</Button>
            <Button 
              onClick={handleCreateActivity}
              disabled={!newActivity.title.trim() || creating}
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuddyActivities;
