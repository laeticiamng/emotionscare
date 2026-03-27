// @ts-nocheck
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/logger';
import { captureException } from '@/lib/ai-monitoring';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useReducedMotion } from '@/components/ui/AccessibilityOptimized';
import { useSocialBreakPlanner } from '@/features/social-cocon/hooks/useSocialBreakPlanner';
import { useSocialRooms } from '@/features/social-cocon/hooks/useSocialRooms';
import type { SocialRoom } from '@/features/social-cocon/types';

const DURATION_OPTIONS = [
  { id: 'soft', label: 'Moment très court (autour de dix minutes)', minutes: 10 },
  { id: 'tender', label: 'Moment prolongé (presque un quart d’heure)', minutes: 15 },
] as const;

const DELIVERY_CHANNELS: Array<{ id: 'in-app' | 'email'; label: string }> = [
  { id: 'in-app', label: 'Petit rappel discret dans l’app' },
  { id: 'email', label: 'Courriel doux pour prévenir la pause' },
];

const formatIcsDate = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
};

const createIcsFile = (durationMinutes: number) => {
  const start = new Date(Date.now() + 5 * 60 * 1000);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EmotionsCare//Social Cocon//FR',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}@social-cocon`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    'SUMMARY:Pause douce à partager',
    'DESCRIPTION:Un moment calme proposé depuis le Social Cocon.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');

  return new Blob([body], { type: 'text/calendar' });
};

interface SchedulePromptProps {
  highlightRooms?: boolean;
}

export default function SchedulePrompt({ highlightRooms = false }: SchedulePromptProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const { rooms, isLoading: roomsLoading } = useSocialRooms({ enabled: true });
  const { scheduleBreak, isScheduling } = useSocialBreakPlanner({ enabled: true });
  const [roomId, setRoomId] = useState<string>('');
  const [durationId, setDurationId] = useState<(typeof DURATION_OPTIONS)[number]['id']>('soft');
  const [reminderOptIn, setReminderOptIn] = useState(true);
  const [deliveryChannel, setDeliveryChannel] = useState<'in-app' | 'email'>('in-app');
  const [status, setStatus] = useState<string | null>(null);
  const icsUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!roomId && rooms.length > 0) {
      const preferred = rooms.find((room) => room.isPrivate) ?? rooms[0];
      setRoomId(preferred.id);
    }
  }, [roomId, rooms]);

  useEffect(() => () => {
    if (icsUrlRef.current) {
      URL.revokeObjectURL(icsUrlRef.current);
      icsUrlRef.current = null;
    }
  }, []);

  const sortedRooms = useMemo(() => {
    if (!highlightRooms) return rooms;
    return [...rooms].sort((a, b) => Number(b.isPrivate) - Number(a.isPrivate));
  }, [highlightRooms, rooms]);

  const durationMinutes = useMemo(() => {
    const option = DURATION_OPTIONS.find((entry) => entry.id === durationId) ?? DURATION_OPTIONS[0];
    return option.minutes;
  }, [durationId]);

  const selectedRoom = useMemo<SocialRoom | undefined>(
    () => sortedRooms.find((room) => room.id === roomId),
    [roomId, sortedRooms],
  );

  const handlePlan = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setStatus(null);

      if (!roomId) {
        setStatus('Choisis un espace à rejoindre avant de planifier.');
        return;
      }

      const startsAt = new Date(Date.now() + 10 * 60 * 1000);

      try {
        const result = await scheduleBreak({
          roomId,
          startsAtUtc: startsAt.toISOString(),
          durationMinutes,
          reminderOptIn,
          deliveryChannel,
          invitees: [],
        });

        if (!result) {
          throw new Error('schedule_failed');
        }

        logger.info('social:break_planned', { roomId, deliveryChannel }, 'SOCIAL');

        setStatus('Pause planifiée, un rappel sera glissé en douceur.');
      } catch (error) {
        logger.warn('[SchedulePrompt] scheduleBreak failed', error as Error, 'SYSTEM');
        captureException(error, {
          tags: { scope: 'social_cocon', action: 'schedule_break' },
        });
        setStatus('Impossible de planifier automatiquement. Tu peux ajouter la pause à ton agenda.');
      }
    },
    [deliveryChannel, durationMinutes, reminderOptIn, roomId, scheduleBreak],
  );

  const handleDownloadIcs = useCallback(() => {
    if (icsUrlRef.current) {
      URL.revokeObjectURL(icsUrlRef.current);
      icsUrlRef.current = null;
    }
    const blob = createIcsFile(durationMinutes);
    icsUrlRef.current = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = icsUrlRef.current;
    anchor.download = 'pause-douce.ics';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }, [durationMinutes]);

  const motionClass = prefersReducedMotion ? 'transition-none' : 'transition-all duration-150 ease-out';

  return (
    <Card className={`border-emerald-100 bg-emerald-50/80 text-emerald-950 shadow-sm ${motionClass}`}>
      <CardHeader>
        <CardTitle className="text-xl">Planifier une pause partagée</CardTitle>
        <CardDescription className="text-sm text-emerald-700">
          Choisis un cocon, propose un moment respiré et précise si tu souhaites un rappel discret.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handlePlan}>
          <div className="space-y-2">
              <Label htmlFor="schedule-room">Espace choisi</Label>
              <Select value={roomId} onValueChange={setRoomId} disabled={roomsLoading || sortedRooms.length === 0}>
                <SelectTrigger id="schedule-room" className={highlightRooms ? 'border-emerald-400' : undefined}>
                  <SelectValue placeholder="Sélectionne un cocon" />
                </SelectTrigger>
                <SelectContent>
                  {sortedRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id} className={room.isPrivate ? 'font-semibold text-emerald-900' : ''}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRoom && selectedRoom.isPrivate && (
                <p className="text-sm text-emerald-700">Cet espace est réservé, parfait pour une conversation intime.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule-duration">Durée souhaitée</Label>
              <Select value={durationId} onValueChange={(value) => setDurationId(value as typeof durationId)}>
                <SelectTrigger id="schedule-duration">
                  <SelectValue placeholder="Choisis la durée" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="schedule-reminder">Souhaites-tu un rappel ?</Label>
              <div className="flex items-center gap-3 rounded-lg bg-white/70 p-3">
                <Switch
                  id="schedule-reminder"
                  checked={reminderOptIn}
                  onCheckedChange={setReminderOptIn}
                  aria-label="Activer un rappel"
                />
                <span className="text-sm text-emerald-800">
                  Recevoir une douce notification avant la pause.
                </span>
              </div>
            </div>

            {reminderOptIn && (
              <div className="space-y-2">
                <Label htmlFor="schedule-channel">Canal préféré</Label>
                <Select value={deliveryChannel} onValueChange={(value) => setDeliveryChannel(value as 'in-app' | 'email')}>
                  <SelectTrigger id="schedule-channel">
                    <SelectValue placeholder="Choisis le canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_CHANNELS.map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                className="bg-emerald-900 text-emerald-50 hover:bg-emerald-800"
                disabled={roomsLoading || isScheduling || !roomId}
              >
                {isScheduling ? 'Planification en cours…' : 'Proposer le créneau'}
              </Button>
              <Button type="button" variant="ghost" className="text-emerald-800 hover:bg-emerald-100" onClick={handleDownloadIcs}>
                Ajouter dans mon agenda
              </Button>
            </div>

            {status && (
              <p className="text-sm text-emerald-800" role="status" aria-live="polite">
                {status}
              </p>
            )}
        </form>
      </CardContent>
    </Card>
  );
}
