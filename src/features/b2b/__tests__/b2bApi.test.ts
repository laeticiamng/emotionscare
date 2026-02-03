/**
 * Tests unitaires pour l'API B2B
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [
              { id: 'team-1', name: 'Équipe Alpha', description: 'Description', created_at: '2026-01-01', updated_at: '2026-01-15' }
            ],
            error: null
          })),
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: 'new-team', name: 'Nouvelle Équipe', created_at: '2026-02-01' },
            error: null
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      })),
      upsert: vi.fn(() => Promise.resolve({ error: null }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1', email: 'admin@test.com' } } }))
    },
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { invitation: { id: 'inv-1' } }, error: null }))
    },
    rpc: vi.fn(() => Promise.resolve({ data: null, error: null }))
  }
}));

import {
  fetchTeams,
  createTeam,
  deleteTeam,
  fetchEvents,
  createEvent,
  rsvpEvent,
  deleteEvent,
  sendInvitation,
  revokeInvitation,
  fetchReports,
  exportReport,
  fetchAuditLogs
} from '../api';

describe('B2B API - Teams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchTeams retourne une liste de teams formatées', async () => {
    const result = await fetchTeams('org-1');
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data![0]).toHaveProperty('id', 'team-1');
    expect(result.data![0]).toHaveProperty('name', 'Équipe Alpha');
    expect(result.data![0]).toHaveProperty('status', 'active');
  });

  it('createTeam crée une équipe et retourne les données', async () => {
    const result = await createTeam('org-1', {
      name: 'Nouvelle Équipe',
      description: 'Description test'
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data!.name).toBe('Nouvelle Équipe');
  });

  it('deleteTeam supprime une équipe', async () => {
    const result = await deleteTeam('team-1');
    expect(result.success).toBe(true);
  });
});

describe('B2B API - Events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchEvents retourne les événements formatés', async () => {
    const result = await fetchEvents('org-1');
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('createEvent crée un événement avec tous les champs', async () => {
    const result = await createEvent('org-1', 'user-1', {
      title: 'Atelier Wellness',
      description: 'Session de méditation',
      date: '2026-03-15',
      time: '14:00',
      location: 'Salle Zen',
      locationType: 'onsite',
      maxParticipants: 20,
      category: 'wellness'
    });

    expect(result.success).toBe(true);
  });

  it('rsvpEvent met à jour la participation', async () => {
    const result = await rsvpEvent('event-1', 'user-1', 'confirmed');
    expect(result.success).toBe(true);
  });

  it('deleteEvent supprime un événement', async () => {
    const result = await deleteEvent('event-1');
    expect(result.success).toBe(true);
  });
});

describe('B2B API - Invitations', () => {
  it('sendInvitation envoie une invitation via Edge Function', async () => {
    const result = await sendInvitation('org-1', {
      email: 'new.member@test.com',
      teamId: 'team-1',
      role: 'member',
      message: 'Bienvenue!'
    });

    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('id', 'inv-1');
  });

  it('revokeInvitation annule une invitation', async () => {
    const result = await revokeInvitation('inv-1');
    expect(result.success).toBe(true);
  });
});

describe('B2B API - Reports', () => {
  it('fetchReports retourne les rapports mensuels', async () => {
    const result = await fetchReports('org-1');
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('exportReport génère un lien de téléchargement', async () => {
    const result = await exportReport('report-1', 'pdf');
    expect(result.success).toBe(true);
  });
});

describe('B2B API - Audit Logs', () => {
  it('fetchAuditLogs retourne les logs formatés', async () => {
    const result = await fetchAuditLogs('org-1', 50);
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  });
});
