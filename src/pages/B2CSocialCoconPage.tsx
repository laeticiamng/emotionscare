import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  CalendarPlus,
  Heart,
  Lock,
  Mail,
  MicOff,
  Moon,
  Share2,
  Sparkles,
  Users,
  Volume2,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { captureException } from '@/lib/ai-monitoring';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { cn } from '@/lib/utils';
import { useSocialRooms } from '@/features/social-cocon/hooks/useSocialRooms';
import { useSocialBreakPlanner } from '@/features/social-cocon/hooks/useSocialBreakPlanner';
import { useMspssSummary } from '@/features/social-cocon/hooks/useMspssSummary';
import { computeSocialCoconUIHints, serializeHints } from '@/features/orchestration';
import { createSession } from '@/services/sessions/sessionsApi';
import {
  type ScheduleBreakPayload,
  type SocialBreakPlan,
  type SocialRoom,
  type SocialRoomMember,
} from '@/features/social-cocon/types';

const toDateTimeLocalValue = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatTimeRange = (plan: SocialBreakPlan) => {
  const starts = new Date(plan.startsAt);
  const ends = new Date(starts.getTime() + plan.durationMinutes * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formatter.format(starts)} – ${formatter.format(ends)}`;
};

const deriveRoomMembersLabel = (members: SocialRoomMember[]) => {
  if (!members.length) {
    return 'Aucun membre pour le moment';
  }
  if (members.length === 1) {
    return `${members[0].displayName} est prêt·e à écouter`;
  }
  if (members.length === 2) {
    return `${members[0].displayName} et ${members[1].displayName} sont connectés`;
  }
  return `${members.length} personnes présentes en douceur`;
};

const createQuickSuggestions = (supportLow: boolean) => {
  if (!supportLow) return [];

  const now = new Date();
  const inThirty = new Date(now.getTime() + 30 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(10, 0, 0, 0);

  return [
    {
      id: 'now',
      label: 'Dans 30 minutes',
      datetimeLocal: toDateTimeLocalValue(inThirty),
    },
    {
      id: 'tomorrow',
      label: 'Demain matin (10h00)',
      datetimeLocal: toDateTimeLocalValue(tomorrow),
    },
  ];
};

const B2CSocialCoconPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const { has } = useFlags();
  const featureEnabled = has('FF_SOCIAL_COCON');
  const mspssEnabled = has('FF_ASSESS_MSPSS');
  const orchestratorEnabled = has('FF_ORCH_SOCIAL_COCON');

  const {
    rooms,
    memberships,
    createRoom,
    joinRoom,
    leaveRoom,
    setSoftMode,
    isLoading,
    error,
    isCreating,
    isJoining,
    isLeaving,
    isSoftModeUpdating,
  } = useSocialRooms({ enabled: featureEnabled });

  const {
    quietHours,
    upcomingBreaks,
    isLoading: breaksLoading,
    scheduleBreak,
    cancelBreak,
    isScheduling,
  } = useSocialBreakPlanner({ enabled: featureEnabled });

  const mspssAssessment = useAssessment('MSPSS');
  const { data: mspssHistory } = useAssessmentHistory('MSPSS', {
    limit: 1,
    enabled: featureEnabled && mspssEnabled && orchestratorEnabled && mspssAssessment.state.canDisplay,
  });
  const { summary: mspssSummary } = useMspssSummary({ enabled: featureEnabled && mspssEnabled });
  const supportLow = mspssSummary?.supportLevel === 'low';

  const mspssLevel = orchestratorEnabled
    ? mspssHistory?.[0]?.level ?? mspssAssessment.state.lastComputation?.level
    : undefined;

  const consented = Boolean(mspssAssessment.state.hasConsent);

  const socialHints = useMemo(
    () =>
      orchestratorEnabled
        ? computeSocialCoconUIHints({
            mspssLevel: typeof mspssLevel === 'number' ? mspssLevel : undefined,
            consented,
          })
        : [],
    [consented, mspssLevel, orchestratorEnabled],
  );

  const shouldPrioritizeCta = socialHints.some(
    (hint) => hint.action === 'promote_cta' && hint.key === 'schedule_break',
  );
  const shouldPromoteRooms = socialHints.some(
    (hint) => hint.action === 'highlight_rooms_private',
  );

  const serializedHints = useMemo(() => serializeHints(socialHints), [socialHints]);
  const hintsSignature = useMemo(() => serializedHints.join('|'), [serializedHints]);
  const lastLoggedSignature = useRef<string | null>(null);
  const highlightSupport = shouldPrioritizeCta || supportLow;
  const planSectionOrder = shouldPrioritizeCta ? 'lg:order-1' : 'lg:order-2';
  const roomsSectionOrder = shouldPrioritizeCta ? 'lg:order-2' : 'lg:order-1';

  const [roomForm, setRoomForm] = useState({
    name: '',
    topic: '',
    allowAudio: true,
  });
  const [scheduleForm, setScheduleForm] = useState({
    roomId: '',
    datetime: '',
    durationMinutes: 15,
    reminderOptIn: true,
    deliveryChannel: 'in-app' as ScheduleBreakPayload['deliveryChannel'],
    includeMembers: true,
    emailInvites: '',
  });
  const [hintTagged, setHintTagged] = useState(false);

  const quickSuggestions = useMemo(
    () => createQuickSuggestions(highlightSupport),
    [highlightSupport],
  );

  useEffect(() => {
    if (!scheduleForm.roomId && rooms.length > 0) {
      setScheduleForm((prev) => ({ ...prev, roomId: rooms[0].id }));
    }
  }, [rooms, scheduleForm.roomId]);

  useEffect(() => {
    if (!orchestratorEnabled) return;
    if (hintsSignature === lastLoggedSignature.current) return;
    lastLoggedSignature.current = hintsSignature;

    Sentry.addBreadcrumb({
      category: 'orch:social',
      message: 'apply',
      level: 'info',
      data: { hints: serializedHints },
    });

    if (serializedHints.length === 0) {
      return;
    }

    void createSession({
      type: 'social_cocon',
      duration_sec: 0,
      meta: { hints: serializedHints },
    }).catch((error) => {
      Sentry.captureException(error);
    });
  }, [orchestratorEnabled, serializedHints, hintsSignature]);

  if (!featureEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <Heart className="h-12 w-12 text-rose-400 mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-semibold mb-2">Social Cocon arrive bientôt</h1>
        <p className="text-muted-foreground max-w-md">
          Les rooms privées seront disponibles dès que votre organisation active la fonctionnalité.
        </p>
        <Button className="mt-6" onClick={() => navigate(-1)}>
          Revenir en arrière
        </Button>
      </div>
    );
  }

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!roomForm.name.trim()) {
      toast({
        title: 'Nom requis',
        description: 'Choisissez un nom doux et explicite pour votre room privée.',
        variant: 'warning',
      });
      return;
    }

    await createRoom({
      name: roomForm.name.trim(),
      topic: roomForm.topic.trim() || 'Pause partagée',
      allowAudio: roomForm.allowAudio,
    });

    setRoomForm({ name: '', topic: '', allowAudio: true });
  };

  const handleJoinRoom = async (room: SocialRoom) => {
    await joinRoom({
      roomId: room.id,
      displayName: 'Vous',
      preferAudio: room.allowAudio,
      preferText: true,
    });
  };

  const handleLeaveRoom = async (room: SocialRoom) => {
    const membership = memberships[room.id];
    await leaveRoom({
      roomId: room.id,
      memberId: membership?.id,
    });
    toast({
      title: 'À bientôt',
      description: 'Un message de clôture bienveillant a été partagé dans la room.',
      variant: 'info',
    });
  };

  const handleScheduleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!scheduleForm.roomId || !scheduleForm.datetime) {
      toast({
        title: 'Sélection incomplète',
        description: 'Choisissez une room et un créneau avant de planifier votre pause.',
        variant: 'warning',
      });
      return;
    }

    const startsAt = new Date(scheduleForm.datetime);
    if (Number.isNaN(startsAt.getTime())) {
      toast({
        title: 'Créneau invalide',
        description: 'Le format de date ne peut pas être compris.',
        variant: 'destructive',
      });
      return;
    }

    const baseInvitees: ScheduleBreakPayload['invitees'] = [];
    const targetRoom = rooms.find((room) => room.id === scheduleForm.roomId);
    if (scheduleForm.includeMembers && targetRoom) {
      for (const member of targetRoom.members) {
        baseInvitees.push({ id: member.id, type: 'member', label: member.displayName });
      }
    }

    if (scheduleForm.emailInvites.trim()) {
      const rawEntries = scheduleForm.emailInvites
        .split(/\s|,|;/)
        .map((entry) => entry.trim())
        .filter(Boolean);
      for (const entry of rawEntries) {
        baseInvitees.push({ id: entry.toLowerCase(), type: 'email', label: entry });
      }
    }

    const payload: ScheduleBreakPayload = {
      roomId: scheduleForm.roomId,
      startsAtUtc: startsAt.toISOString(),
      durationMinutes: scheduleForm.durationMinutes,
      reminderOptIn: scheduleForm.reminderOptIn,
      deliveryChannel: scheduleForm.deliveryChannel,
      invitees: baseInvitees,
    };

    const result = await scheduleBreak(payload);
    if (result) {
      setScheduleForm((prev) => ({
        ...prev,
        datetime: '',
        emailInvites: '',
      }));
    }
  };

  const handleApplySuggestion = (datetimeLocal: string) => {
    setScheduleForm((prev) => ({ ...prev, datetime: datetimeLocal }));
    if (!hintTagged) {
      Sentry.setTag('mspss_hint_used', 'true');
      setHintTagged(true);
    }
  };

  const heroAnimation = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 120, damping: 14 },
      };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="flex items-center justify-between">
          <Button variant="ghost" className="rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Revenir à la page précédente</span>
          </Button>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-rose-500">Espace d'écoute privée</p>
            <h1 className="text-3xl font-semibold">Social Cocon</h1>
          </div>
          <div className="w-10" aria-hidden="true" />
        </header>

        <motion.section
          initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
          animate={heroAnimation}
          className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-sm"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                <Heart className="h-4 w-4" aria-hidden="true" />
                <span>Espaces calmes, sans jugement</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Prenez des pauses partagées en toute confidentialité
              </h2>
              <p className="text-muted-foreground">
                Créez une room privée pour un moment d'écoute douce, planifiez une mini-pause et invitez une personne de confiance. Aucun détail clinique n'est affiché, seulement votre envie de souffler ensemble.
              </p>
              {highlightSupport && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 mt-0.5" aria-hidden="true" />
                    <p>
                      Nous avons remarqué que votre dernier ressenti indiquait un besoin accru de soutien. Planifier une pause ensemble peut aider à recréer ce lien.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-rose-200 blur-2xl opacity-60" aria-hidden="true" />
                <motion.div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600"
                  animate={prefersReducedMotion ? undefined : { rotate: [0, 4, -3, 0] }}
                  transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Users className="h-10 w-10 text-white" aria-hidden="true" />
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                Des rooms privées audio/texte avec mode très doux pour garder le calme.
              </p>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={cn('space-y-4', planSectionOrder)}>
            <Card className={cn('h-full border', shouldPrioritizeCta && 'border-rose-200 shadow-lg shadow-rose-100/60')}>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CalendarPlus className="h-5 w-5" aria-hidden="true" />
                      Planifier une pause partagée
                    </CardTitle>
                    <CardDescription>
                      Mini-pauses de 10 à 15 minutes, rappelées 10 minutes avant si vous le souhaitez.
                    </CardDescription>
                  </div>
                  {quietHours?.enabled && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                      Quiet hours {quietHours.startUtc} – {quietHours.endUtc} UTC
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {quickSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">Suggestions rapides</p>
                    <div className="flex flex-wrap gap-2">
                      {quickSuggestions.map((suggestion) => (
                        <Button
                          key={suggestion.id}
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => handleApplySuggestion(suggestion.datetimeLocal)}
                        >
                          <Sparkles className="h-4 w-4 mr-1" aria-hidden="true" />
                          {suggestion.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleScheduleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="room-select">Room concernée</Label>
                    <select
                      id="room-select"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      value={scheduleForm.roomId}
                      onChange={(event) => setScheduleForm((prev) => ({ ...prev, roomId: event.target.value }))}
                    >
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="datetime">Créneau (heure locale, enregistré en UTC)</Label>
                    <Input
                      id="datetime"
                      type="datetime-local"
                      required
                      value={scheduleForm.datetime}
                      onChange={(event) => setScheduleForm((prev) => ({ ...prev, datetime: event.target.value }))}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée</Label>
                      <select
                        id="duration"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                        value={scheduleForm.durationMinutes}
                        onChange={(event) =>
                          setScheduleForm((prev) => ({ ...prev, durationMinutes: Number.parseInt(event.target.value, 10) }))
                        }
                      >
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="channel">Canal d'invitation</Label>
                      <select
                        id="channel"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                        value={scheduleForm.deliveryChannel}
                        onChange={(event) =>
                          setScheduleForm((prev) => ({
                            ...prev,
                            deliveryChannel: event.target.value as ScheduleBreakPayload['deliveryChannel'],
                          }))
                        }
                      >
                        <option value="in-app">Notification in-app</option>
                        <option value="email">Email (Resend)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="space-y-1">
                      <Label htmlFor="reminder" className="flex items-center gap-2 text-sm">
                        <Bell className="h-4 w-4 text-rose-500" aria-hidden="true" />
                        Rappel 10 minutes avant
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Un rappel doux vous est envoyé uniquement si vous l'activez.
                      </p>
                    </div>
                    <Switch
                      id="reminder"
                      checked={scheduleForm.reminderOptIn}
                      onCheckedChange={(checked) =>
                        setScheduleForm((prev) => ({ ...prev, reminderOptIn: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-members" className="text-sm font-medium">
                        Inviter les membres déjà présents
                      </Label>
                      <Switch
                        id="include-members"
                        checked={scheduleForm.includeMembers}
                        onCheckedChange={(checked) =>
                          setScheduleForm((prev) => ({ ...prev, includeMembers: checked }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emails">Inviter une personne par email</Label>
                      <Textarea
                        id="emails"
                        placeholder="Entrez des emails séparés par un espace ou une virgule"
                        value={scheduleForm.emailInvites}
                        onChange={(event) => setScheduleForm((prev) => ({ ...prev, emailInvites: event.target.value }))}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isScheduling || isJoining || isLeaving}>
                    {isScheduling ? 'Planification…' : 'Planifier cette pause'}
                  </Button>
                </form>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-rose-500" aria-hidden="true" />
                    <h3 className="text-sm font-semibold">Mini-pauses à venir</h3>
                  </div>
                  {breaksLoading && <p className="text-sm text-muted-foreground">Chargement des prochains créneaux…</p>}
                  {!breaksLoading && upcomingBreaks.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucun créneau planifié pour le moment. Vous pouvez en créer un juste au-dessus.
                    </p>
                  )}
                  <ul className="space-y-3">
                    {upcomingBreaks.map((plan) => {
                      const room = rooms.find((item) => item.id === plan.roomId);
                      return (
                        <li key={plan.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {room?.name ?? 'Room confidentielle'} – {formatTimeRange(plan)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Rappel {plan.remindAt ? 'activé' : 'désactivé'} · {plan.deliveryChannel === 'email' ? 'Email' : 'In-app'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cancelBreak(plan.id)}
                              aria-label="Annuler cette pause"
                            >
                              Annuler
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className={cn('space-y-4', roomsSectionOrder)}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                  Créer une room privée
                </CardTitle>
                <CardDescription>
                  Audio facultatif, mode très doux disponible pour amortir tous les sons et latences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleCreateRoom}>
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Nom de la room</Label>
                    <Input
                      id="room-name"
                      placeholder="Ex. Pause douceur"
                      value={roomForm.name}
                      onChange={(event) => setRoomForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-topic">Intention partagée</Label>
                    <Textarea
                      id="room-topic"
                      placeholder="Décrivez en quelques mots l'esprit de cette pause"
                      value={roomForm.topic}
                      onChange={(event) => setRoomForm((prev) => ({ ...prev, topic: event.target.value }))}
                      className="min-h-[90px]"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">Autoriser l'audio court</p>
                      <p className="text-xs text-muted-foreground">
                        Limité à 5 minutes, uniquement stocké en métadonnées (durée et présence).
                      </p>
                    </div>
                    <Switch
                      checked={roomForm.allowAudio}
                      onCheckedChange={(checked) => setRoomForm((prev) => ({ ...prev, allowAudio: checked }))}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? 'Création…' : 'Ouvrir la room'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {error && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Impossible de charger toutes les rooms pour le moment. Les rooms de démonstration sont affichées.
                </div>
              )}

              {isLoading && (
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                    Chargement des rooms privées…
                  </CardContent>
                </Card>
              )}

              {!isLoading && rooms.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="space-y-3 py-8 text-center">
                    <Users className="mx-auto h-8 w-8 text-rose-400" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">
                      Aucun espace ouvert pour l'instant. Créez une première room pour inviter quelqu'un.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {rooms.map((room) => {
                  const membership = memberships[room.id];
                  const isMember = Boolean(membership);
                  return (
                    <Card
                      key={room.id}
                      className={cn(
                        'border shadow-sm',
                        shouldPromoteRooms ? 'border-rose-200 bg-rose-50/80' : 'border-white/40 bg-white/90',
                      )}
                    >
                      <CardHeader className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{room.name}</CardTitle>
                            <CardDescription>{room.topic}</CardDescription>
                          </div>
                          <Badge variant={room.isPrivate ? 'outline' : 'default'} className="gap-1 text-xs">
                            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                            Accès privé
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" aria-hidden="true" />
                            {deriveRoomMembersLabel(room.members)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Lien interne : <code className="rounded bg-slate-100 px-1 py-0.5">{room.inviteCode}</code>
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            variant={isMember ? 'secondary' : 'default'}
                            onClick={() => (isMember ? handleLeaveRoom(room) : handleJoinRoom(room))}
                            disabled={isJoining || isLeaving}
                          >
                            {isMember ? 'Quitter en douceur' : 'Rejoindre la room'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              setSoftMode({ roomId: room.id, softMode: !room.softModeEnabled }).then(() => {
                                toast({
                                  title: room.softModeEnabled ? 'Mode standard réactivé' : 'Mode très doux activé',
                                  description: room.softModeEnabled
                                    ? 'Les effets audio reviennent doucement.'
                                    : 'Tous les effets sont coupés et la latence est amortie.',
                                  variant: 'info',
                                });
                              })
                            }
                            disabled={isSoftModeUpdating}
                          >
                            <MicOff className="h-4 w-4 mr-2" aria-hidden="true" />
                            {room.softModeEnabled ? 'Mode standard' : 'Passer en mode très doux'}
                          </Button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                            <p className="font-medium flex items-center gap-2 text-slate-800">
                              <Volume2 className="h-4 w-4 text-rose-500" aria-hidden="true" />
                              Audio court {room.allowAudio ? 'autorisé' : 'désactivé'}
                            </p>
                            <p>
                              {room.allowAudio
                                ? 'Les échanges audio sont limités à 5 minutes, aucune donnée sensible enregistrée.'
                                : 'Cette room reste 100% texte, parfaite pour les moments silencieux.'}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                            <p className="font-medium flex items-center gap-2 text-slate-800">
                              <Mail className="h-4 w-4 text-rose-500" aria-hidden="true" />
                              Invitations internes
                            </p>
                            <p>
                              Envoyez le lien interne ou passez par la planification pour déclencher une notification.
                            </p>
                          </div>
                        </div>

                        {isMember && (
                          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-800">
                            <p>
                              Un message automatique sera partagé à votre départ : « Merci pour ce moment, je prends soin de moi et je reste disponible si besoin ».
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <footer className="rounded-3xl bg-white/80 backdrop-blur border border-white/60 p-6 text-xs text-muted-foreground">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>
              RLS : seules les personnes invitées peuvent voir les rooms privées et leurs événements. Les liens ne sont jamais publics.
            </p>
            <p>
              Observabilité : breadcrumbs « social:create » et « social:join » sont envoyés, avec tag « mspss_hint_used » si une suggestion est utilisée.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default B2CSocialCoconPage;
