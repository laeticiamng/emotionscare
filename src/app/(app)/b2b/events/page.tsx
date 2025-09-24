'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  OrgEvent,
  createEvent,
  deleteEvent,
  listEvents,
  sendEventNotifications,
  updateEvent,
  updateEventRsvp,
} from '@/services/b2b/suiteClient';

const RSVP_LABELS: Record<'yes' | 'no' | 'maybe', string> = {
  yes: 'Oui',
  no: 'Non',
  maybe: 'Peut-être',
};

interface EventDraft {
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location: string;
  reminders: { email: boolean; push: boolean };
}

const initialDraft: EventDraft = {
  title: '',
  description: '',
  starts_at: '',
  ends_at: '',
  location: '',
  reminders: { email: false, push: false },
};

export default function EventsPage() {
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [draft, setDraft] = useState<EventDraft>(initialDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [workingEvent, setWorkingEvent] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await listEvents();
      setEvents(data);
    } catch (error) {
      console.error('events.list.failed', error);
      setStatus('Impossible de charger les événements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetDraft = () => {
    setDraft(initialDraft);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateEvent(editingId, {
          title: draft.title,
          description: draft.description,
          starts_at: draft.starts_at,
          ends_at: draft.ends_at,
          location: draft.location,
          reminders: draft.reminders,
        });
        setStatus('Événement mis à jour.');
      } else {
        await createEvent({
          title: draft.title,
          description: draft.description,
          starts_at: draft.starts_at,
          ends_at: draft.ends_at,
          location: draft.location,
          reminders: draft.reminders,
        });
        setStatus('Événement créé.');
      }
      resetDraft();
      loadEvents();
    } catch (error) {
      console.error('events.save.failed', error);
      setStatus("L’événement n’a pas pu être enregistré.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: OrgEvent) => {
    setEditingId(event.id);
    setDraft({
      title: event.title,
      description: event.description ?? '',
      starts_at: event.starts_at.slice(0, 16),
      ends_at: event.ends_at.slice(0, 16),
      location: event.location ?? '',
      reminders: {
        email: Boolean(event.reminders?.email),
        push: Boolean(event.reminders?.push),
      },
    });
  };

  const toggleReminder = async (event: OrgEvent, channel: 'email' | 'push') => {
    setWorkingEvent(event.id);
    try {
      const nextReminders = {
        email: channel === 'email' ? !event.reminders.email : event.reminders.email,
        push: channel === 'push' ? !event.reminders.push : event.reminders.push,
      };
      await updateEvent(event.id, { reminders: nextReminders });
      setEvents((prev) =>
        prev.map((item) => (item.id === event.id ? { ...item, reminders: nextReminders } : item)),
      );
      setStatus('Préférence de rappel mise à jour.');
    } catch (error) {
      console.error('events.reminders.failed', error);
      setStatus('Le rappel n’a pas pu être mis à jour.');
    } finally {
      setWorkingEvent(null);
    }
  };

  const handleDelete = async (eventId: string) => {
    setWorkingEvent(eventId);
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setStatus('Événement supprimé.');
    } catch (error) {
      console.error('events.delete.failed', error);
      setStatus('Suppression impossible.');
    } finally {
      setWorkingEvent(null);
    }
  };

  const handleRsvp = async (eventId: string, statusValue: 'yes' | 'no' | 'maybe') => {
    setWorkingEvent(eventId);
    try {
      await updateEventRsvp(eventId, statusValue);
      setStatus('Réponse enregistrée.');
    } catch (error) {
      console.error('events.rsvp.failed', error);
      setStatus('La réponse n’a pas pu être enregistrée.');
    } finally {
      setWorkingEvent(null);
    }
  };

  const handleNotify = async (eventId: string, channel: 'email' | 'push') => {
    setWorkingEvent(eventId);
    try {
      await sendEventNotifications(eventId, channel);
      setStatus('Notification envoyée.');
    } catch (error) {
      console.error('events.notify.failed', error);
      setStatus('Notification impossible.');
    } finally {
      setWorkingEvent(null);
    }
  };

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()),
    [events],
  );

  return (
    <section className="flex flex-col gap-8 p-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Événements d’équipe</h2>
        <p className="text-sm text-slate-600">
          Les rappels sont opt-in et aucune donnée personnelle n’est affichée. Les réponses sont stockées par RLS.
        </p>
      </div>

      <form className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="event-title">Titre</Label>
            <Input
              id="event-title"
              required
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Réunion de synchronisation"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="event-location">Lieu ou visioconférence</Label>
            <Input
              id="event-location"
              value={draft.location}
              onChange={(event) => setDraft((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="Salle Horizon / Lien Teams"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="event-start">Début</Label>
            <Input
              id="event-start"
              type="datetime-local"
              required
              value={draft.starts_at}
              onChange={(event) => setDraft((prev) => ({ ...prev, starts_at: event.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="event-end">Fin</Label>
            <Input
              id="event-end"
              type="datetime-local"
              required
              value={draft.ends_at}
              onChange={(event) => setDraft((prev) => ({ ...prev, ends_at: event.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="event-description">Description</Label>
          <Textarea
            id="event-description"
            rows={3}
            value={draft.description}
            onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Ordre du jour, objectifs et contexte (texte uniquement)."
          />
        </div>
        <fieldset className="flex gap-4" aria-labelledby="reminder-legend">
          <legend id="reminder-legend" className="text-sm font-semibold text-slate-700">
            Rappels opt-in
          </legend>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.reminders.email}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, reminders: { ...prev.reminders, email: event.target.checked } }))
              }
            />
            Rappel e-mail
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.reminders.push}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, reminders: { ...prev.reminders, push: event.target.checked } }))
              }
            />
            Rappel push
          </label>
        </fieldset>
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Créer'}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetDraft}>
              Annuler la modification
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Chargement des événements…</p>
        ) : sortedEvents.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            Aucun événement planifié. Créez votre premier temps collectif ci-dessus.
          </p>
        ) : (
          sortedEvents.map((event) => {
            const startLabel = new Date(event.starts_at).toLocaleString('fr-FR', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });
            const endLabel = new Date(event.ends_at).toLocaleString('fr-FR', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <article
                key={event.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-slate-900"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                    <p className="text-sm text-slate-600">
                      {startLabel} → {endLabel}
                    </p>
                    {event.location && <p className="text-sm text-slate-600">{event.location}</p>}
                    {event.description && (
                      <p className="text-sm text-slate-700">
                        {event.description.length > 240
                          ? `${event.description.slice(0, 240)}…`
                          : event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(event)}>
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(event.id)}
                      disabled={workingEvent === event.id}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rappels</span>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(event.reminders?.email)}
                      onChange={() => toggleReminder(event, 'email')}
                      disabled={workingEvent === event.id}
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(event.reminders?.push)}
                      onChange={() => toggleReminder(event, 'push')}
                      disabled={workingEvent === event.id}
                    />
                    Push
                  </label>
                  <div className="ml-auto flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleNotify(event.id, 'email')}
                      disabled={workingEvent === event.id}
                    >
                      Envoyer e-mail
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleNotify(event.id, 'push')}
                      disabled={workingEvent === event.id}
                    >
                      Envoyer push
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Réponse personnelle">
                  {(['yes', 'maybe', 'no'] as const).map((value) => (
                    <Button
                      key={value}
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={workingEvent === event.id}
                      onClick={() => handleRsvp(event.id, value)}
                    >
                      {`RSVP ${RSVP_LABELS[value]}`}
                    </Button>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </div>

      <p aria-live="polite" className="text-sm text-slate-600">
        {status ??
          'Les notifications ne contiennent aucun e-mail en clair. Les exportations ne divulguent aucune information personnelle.'}
      </p>
    </section>
  );
}
