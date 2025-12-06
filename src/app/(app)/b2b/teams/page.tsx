'use client';

import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  B2BMember,
  fetchMembers,
  inviteMember,
  updateMemberRole,
} from '@/services/b2b/suiteClient';

const ROLE_LABELS: Record<B2BMember['role'], string> = {
  admin: 'Administrateur',
  manager: 'Manager',
  member: 'Membre',
};

export default function TeamsPage() {
  const [members, setMembers] = useState<B2BMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'member'>('member');
  const [status, setStatus] = useState<string | null>(null);
  const [busyMember, setBusyMember] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchMembers();
      setMembers(data);
    } catch (error) {
      console.error('teams.list.failed', error);
      setStatus("Impossible de charger les membres. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await inviteMember(inviteEmail, inviteRole);
      setInviteEmail('');
      setInviteRole('member');
      setStatus('Invitation envoyée. Un e-mail sécurisé a été transmis.');
    } catch (error) {
      console.error('teams.invite.failed', error);
      setStatus("L’invitation n’a pas pu être envoyée.");
    } finally {
      setSubmitting(false);
      loadMembers();
    }
  };

  const handleRoleChange = async (userId: string, role: B2BMember['role']) => {
    setBusyMember(userId);
    try {
      await updateMemberRole(userId, role);
      setStatus('Rôle mis à jour.');
      setMembers((prev) => prev.map((member) => (member.id === userId ? { ...member, role } : member)));
    } catch (error) {
      console.error('teams.role.failed', error);
      setStatus('Le rôle n’a pas pu être mis à jour.');
    } finally {
      setBusyMember(null);
    }
  };

  return (
    <section className="flex flex-col gap-8 p-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Membres de l’organisation</h2>
        <p className="text-sm text-slate-600">
          Tous les rôles sont appliqués via RLS Supabase. Les identifiants sont pseudonymisés côté client.
        </p>
      </div>

      <form
        className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[2fr_1fr_auto]"
        onSubmit={handleInvite}
      >
        <div className="space-y-1">
          <Label htmlFor="invite-email">Adresse e-mail professionnelle</Label>
          <Input
            id="invite-email"
            type="email"
            autoComplete="off"
            required
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="prenom.nom@entreprise.com"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="invite-role">Rôle</Label>
          <select
            id="invite-role"
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as 'manager' | 'member')}
          >
            <option value="member">Membre</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Envoi…' : 'Inviter'}
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200" role="table">
          <thead className="bg-slate-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Identifiant pseudonymisé
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Rôle
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                  Chargement des membres…
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                  Aucun membre pour le moment. Envoyez une invitation pour commencer.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{member.label}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{ROLE_LABELS[member.role]}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="flex gap-2">
                      {(['admin', 'manager', 'member'] as B2BMember['role'][]).map((role) => (
                        <Button
                          key={role}
                          type="button"
                          size="sm"
                          variant={member.role === role ? 'default' : 'outline'}
                          disabled={busyMember === member.id || member.role === role}
                          onClick={() => handleRoleChange(member.id, role)}
                          aria-pressed={member.role === role}
                        >
                          {ROLE_LABELS[role]}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p aria-live="polite" className="text-sm text-slate-600">
        {status ?? 'Toutes les invitations sont hashées avant stockage. Les e-mails ne quittent pas le service Resend sécurisé.'}
      </p>
    </section>
  );
}
