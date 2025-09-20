'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { B2BMember, fetchMembers, fetchSessions, rotateKeys, SessionInfo } from '@/services/b2b/suiteClient';

export default function SecurityPage() {
  const [members, setMembers] = useState<B2BMember[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersData, sessionsData] = await Promise.all([fetchMembers(), fetchSessions()]);
      setMembers(membersData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('security.fetch.failed', error);
      setStatus('Impossible de charger les informations de sécurité.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRotate = async () => {
    setRotating(true);
    try {
      await rotateKeys();
      setStatus('Rotation des clés déclenchée. Un audit textuel est archivé.');
    } catch (error) {
      console.error('security.rotate.failed', error);
      setStatus('La rotation n’a pas pu être déclenchée.');
    } finally {
      setRotating(false);
    }
  };

  return (
    <section className="flex flex-col gap-8 p-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Rôles et sécurité</h2>
        <p className="text-sm text-slate-600">
          Les rôles affichés ci-dessous sont issus de la table sécurisée <code className="rounded bg-slate-100 px-1">org_members</code>.
          Les sessions sont exposées sans informations personnelles.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={handleRotate} disabled={rotating}>
          {rotating ? 'Rotation en cours…' : 'Lancer une rotation de clés'}
        </Button>
        <Button type="button" variant="outline" onClick={loadData} disabled={loading}>
          Actualiser
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Membres et rôles</h3>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Chargement des rôles…</p>
        ) : members.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Aucun membre trouvé.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {members.map((member) => (
              <li key={member.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{member.label}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{member.role}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-slate-900">Sessions actives</h3>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Chargement des sessions…</p>
        ) : sessions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Aucune session active disponible.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sessions.map((session, index) => (
              <li key={`${session.label}-${index}`} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{session.label}</p>
                <p className="text-xs text-slate-600">Dernière activité : {session.last_seen}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p aria-live="polite" className="text-sm text-slate-600">
        {status ??
          'Les déclenchements de sécurité produisent un audit « security.keys.rotated » consultable dans l’onglet Audit.'}
      </p>
    </section>
  );
}
