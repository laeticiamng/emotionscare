/**
 * Breathwork API Routes
 * Endpoints pour gérer les sessions de respiration
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getSupabaseClient } from '../lib/supabase';

const createSessionSchema = z.object({
  technique_type: z.string().min(1),
  duration: z.number().int().min(1).max(3600),
  target_bpm: z.number().optional().nullable(),
  actual_bpm: z.number().optional().nullable(),
  coherence_score: z.number().min(0).max(100).optional().nullable(),
  stress_level_before: z.number().min(1).max(10).optional().nullable(),
  stress_level_after: z.number().min(1).max(10).optional().nullable(),
  session_data: z.object({
    started_at: z.string().optional(),
    ended_at: z.string().optional(),
    cycles_planned: z.number().int().min(0).max(200).optional(),
    cycles_completed: z.number().int().min(0).max(200).optional(),
    density: z.number().min(0.1).max(1).optional(),
    completed: z.boolean().optional(),
    cadence: z.number().min(1).max(20).optional(),
    cues: z.object({
      sound: z.boolean().optional(),
      haptics: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

const updateSessionSchema = z.object({
  duration: z.number().int().min(1).max(3600).optional(),
  actual_bpm: z.number().optional().nullable(),
  coherence_score: z.number().min(0).max(100).optional().nullable(),
  stress_level_after: z.number().min(1).max(10).optional().nullable(),
  session_data: z.record(z.unknown()).optional(),
});

type SessionRequest = FastifyRequest<{
  Body: z.infer<typeof createSessionSchema>;
}>;

type SessionUpdateRequest = FastifyRequest<{
  Params: { id: string };
  Body: z.infer<typeof updateSessionSchema>;
}>;

type SessionGetRequest = FastifyRequest<{
  Params: { id: string };
}>;

type SessionListRequest = FastifyRequest<{
  Querystring: {
    limit?: string;
    offset?: string;
    technique?: string;
  };
}>;

type SessionRecord = Record<string, unknown>;

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

export interface BreathworkRepository {
  createSession: (userId: string, payload: CreateSessionInput) => Promise<SessionRecord>;
  listSessions: (userId: string, limit?: number, offset?: number, technique?: string) => Promise<SessionRecord[]>;
  getSession: (id: string, userId: string) => Promise<SessionRecord | null>;
  updateSession: (id: string, userId: string, payload: UpdateSessionInput) => Promise<SessionRecord | null>;
  deleteSession: (id: string, userId: string) => Promise<void>;
  getWeeklyMetrics: (userId: string) => Promise<SessionRecord | null>;
  getStats: (userId: string) => Promise<SessionRecord>;
}

const createBreathworkRepository = (): BreathworkRepository => {
  const supabase = getSupabaseClient();

  return {
    async createSession(userId, payload) {
      const { data, error } = await supabase
        .from('breathwork_sessions')
        .insert({
          user_id: userId,
          technique_type: payload.technique_type,
          duration: payload.duration,
          target_bpm: payload.target_bpm,
          actual_bpm: payload.actual_bpm,
          coherence_score: payload.coherence_score,
          stress_level_before: payload.stress_level_before,
          stress_level_after: payload.stress_level_after,
          session_data: payload.session_data,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },

    async listSessions(userId, limit = 50, offset = 0, technique) {
      let query = supabase
        .from('breathwork_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (technique) {
        query = query.eq('technique_type', technique);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data ?? [];
    },

    async getSession(id, userId) {
      const { data, error } = await supabase
        .from('breathwork_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data ?? null;
    },

    async updateSession(id, userId, payload) {
      const { data, error } = await supabase
        .from('breathwork_sessions')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data ?? null;
    },

    async deleteSession(id, userId) {
      const { error } = await supabase
        .from('breathwork_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    },

    async getWeeklyMetrics(userId) {
      const { data, error } = await supabase
        .from('breath_weekly_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data ?? null;
    },

    async getStats(userId) {
      const { data, error } = await supabase
        .from('breathwork_sessions')
        .select('id, duration, technique_type, coherence_score, created_at')
        .eq('user_id', userId);

      if (error) throw error;

      const sessions = data ?? [];
      const totalSessions = sessions.length;
      const totalDuration = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
      const avgCoherence = sessions.length > 0
        ? sessions.reduce((acc, s) => acc + (s.coherence_score || 0), 0) / sessions.filter(s => s.coherence_score).length
        : 0;

      const techniqueCount: Record<string, number> = {};
      for (const s of sessions) {
        if (s.technique_type) {
          techniqueCount[s.technique_type] = (techniqueCount[s.technique_type] || 0) + 1;
        }
      }

      return {
        total_sessions: totalSessions,
        total_duration_seconds: totalDuration,
        average_coherence: avgCoherence || null,
        techniques_used: techniqueCount,
      };
    },
  };
};

const ensureUser = (req: FastifyRequest, reply: FastifyReply) => {
  if (!(req as unknown as { user?: { sub: string } }).user) {
    reply.code(401).send({
      ok: false,
      error: { code: 'unauthorized', message: 'Unauthorized' },
    });
    return null;
  }
  return (req as unknown as { user: { sub: string } }).user;
};

export type BreathworkRoutesOptions = {
  repository?: BreathworkRepository;
};

export function registerBreathworkRoutes(app: FastifyInstance, options: BreathworkRoutesOptions = {}) {
  const repository = options.repository ?? createBreathworkRepository();

  // POST /api/v1/breath/sessions - Créer une session
  app.post('/api/v1/breath/sessions', async (req: SessionRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createSessionSchema.parse(req.body);
      const session = await repository.createSession(user.sub, data);
      reply.code(201).send({ ok: true, data: session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(422).send({
          ok: false,
          error: {
            code: 'validation_error',
            message: 'Invalid input',
            details: error.flatten(),
          },
        });
        return;
      }

      app.log.error({ error }, 'Unexpected error creating breathwork session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/breath/sessions - Liste des sessions
  app.get('/api/v1/breath/sessions', async (req: SessionListRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
      const technique = req.query.technique;

      const sessions = await repository.listSessions(user.sub, limit, offset, technique);
      reply.send({ ok: true, data: sessions });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching breathwork sessions');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/breath/sessions/:id - Détails d'une session
  app.get('/api/v1/breath/sessions/:id', async (req: SessionGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const session = await repository.getSession(id, user.sub);

      if (!session) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      reply.send({ ok: true, data: session });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching breathwork session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // PATCH /api/v1/breath/sessions/:id - Mettre à jour une session
  app.patch('/api/v1/breath/sessions/:id', async (req: SessionUpdateRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const data = updateSessionSchema.parse(req.body);
      const session = await repository.updateSession(id, user.sub, data);

      if (!session) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      reply.send({ ok: true, data: session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.code(422).send({
          ok: false,
          error: {
            code: 'validation_error',
            message: 'Invalid input',
            details: error.flatten(),
          },
        });
        return;
      }

      app.log.error({ error }, 'Unexpected error updating breathwork session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // DELETE /api/v1/breath/sessions/:id - Supprimer une session
  app.delete('/api/v1/breath/sessions/:id', async (req: SessionGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      await repository.deleteSession(id, user.sub);
      reply.code(204).send();
    } catch (error) {
      app.log.error({ error }, 'Unexpected error deleting breathwork session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/breath/weekly - Métriques hebdomadaires
  app.get('/api/v1/breath/weekly', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const metrics = await repository.getWeeklyMetrics(user.sub);
      reply.send({ ok: true, data: metrics });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching weekly metrics');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/breath/stats - Statistiques globales
  app.get('/api/v1/breath/stats', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const stats = await repository.getStats(user.sub);
      reply.send({ ok: true, data: stats });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching breathwork stats');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/breath/techniques - Liste des techniques disponibles
  app.get('/api/v1/breath/techniques', async (_req: FastifyRequest, reply: FastifyReply) => {
    const techniques = [
      { id: 'box_breathing', name: 'Respiration carrée', pattern: '4-4-4-4', description: 'Équilibre et calme' },
      { id: 'four_seven_eight', name: 'Respiration 4-7-8', pattern: '4-7-8', description: 'Relaxation profonde' },
      { id: 'coherent', name: 'Cohérence cardiaque', pattern: '5-5', description: 'Équilibre du système nerveux' },
      { id: 'diaphragmatic', name: 'Respiration diaphragmatique', pattern: '4-6', description: 'Activation parasympathique' },
      { id: 'energizing', name: 'Respiration énergisante', pattern: '3-3', description: 'Boost d\'énergie' },
      { id: 'calming', name: 'Respiration calmante', pattern: '4-8', description: 'Réduction du stress' },
    ];

    reply.send({ ok: true, data: techniques });
  });
}
