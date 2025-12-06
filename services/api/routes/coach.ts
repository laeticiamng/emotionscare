/**
 * AI Coach API Routes
 * Endpoints pour gérer les sessions de coaching et les messages
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getSupabaseClient } from '../lib/supabase';

const createSessionSchema = z.object({
  title: z.string().optional(),
  coach_mode: z.enum(['empathetic', 'motivational', 'analytical']).optional(),
  topic: z.string().optional(),
  mood_before: z.number().min(1).max(10).optional(),
});

const updateSessionSchema = z.object({
  title: z.string().optional(),
  mood_after: z.number().min(1).max(10).optional(),
  satisfaction_rating: z.number().min(1).max(5).optional(),
  duration_minutes: z.number().optional(),
});

const createMessageSchema = z.object({
  session_id: z.string(),
  content: z.string(),
  sender: z.enum(['user', 'coach']),
  message_type: z.string().optional(),
  emotions_detected: z.record(z.any()).optional(),
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

type MessageRequest = FastifyRequest<{
  Body: z.infer<typeof createMessageSchema>;
}>;

type MessageListRequest = FastifyRequest<{
  Params: { sessionId: string };
}>;

type SessionRecord = Record<string, any>;
type MessageRecord = Record<string, any>;

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export interface CoachRepository {
  createSession: (userId: string, payload: CreateSessionInput) => Promise<SessionRecord>;
  listSessions: (userId: string) => Promise<SessionRecord[]>;
  getSession: (id: string, userId: string) => Promise<SessionRecord | null>;
  updateSession: (id: string, userId: string, payload: UpdateSessionInput) => Promise<SessionRecord | null>;
  deleteSession: (id: string, userId: string) => Promise<void>;
  verifySessionOwnership: (sessionId: string, userId: string) => Promise<boolean>;
  createMessage: (userId: string, payload: CreateMessageInput) => Promise<MessageRecord>;
  listMessages: (sessionId: string, userId: string) => Promise<MessageRecord[]>;
  listSessionsWithMood: (userId: string, limit: number) => Promise<SessionRecord[]>;
}

const createCoachRepository = (): CoachRepository => {
  const supabase = getSupabaseClient();

  return {
    async createSession(userId, payload) {
      const { data, error } = await supabase
        .from('coach_sessions')
        .insert({
          user_id: userId,
          title: payload.title || 'Session de coaching',
          coach_mode: payload.coach_mode || 'empathetic',
          topic: payload.topic,
          mood_before: payload.mood_before,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    async listSessions(userId) {
      const { data, error } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    async getSession(id, userId) {
      const { data, error } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data ?? null;
    },
    async updateSession(id, userId, payload) {
      const { data, error } = await supabase
        .from('coach_sessions')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data ?? null;
    },
    async deleteSession(id, userId) {
      const { error } = await supabase
        .from('coach_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    async verifySessionOwnership(sessionId, userId) {
      const { data } = await supabase
        .from('coach_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      return Boolean(data);
    },
    async createMessage(userId, payload) {
      const { data, error } = await supabase
        .from('coach_messages')
        .insert({
          session_id: payload.session_id,
          user_id: userId,
          sender: payload.sender,
          content: payload.content,
          message_type: payload.message_type || 'text',
          emotions_detected: payload.emotions_detected || {},
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    async listMessages(sessionId, userId) {
      const { data: session } = await supabase
        .from('coach_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (!session) {
        return [];
      }

      const { data, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    async listSessionsWithMood(userId, limit) {
      const { data, error } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('user_id', userId)
        .not('mood_before', 'is', null)
        .not('mood_after', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data ?? [];
    },
  };
};

const ensureUser = (req: any, reply: FastifyReply) => {
  if (!req.user) {
    reply.code(401).send({
      ok: false,
      error: { code: 'unauthorized', message: 'Unauthorized' },
    });
    return null;
  }
  return req.user;
};

export type CoachRoutesOptions = {
  repository?: CoachRepository;
};

export function registerCoachRoutes(app: FastifyInstance, options: CoachRoutesOptions = {}) {
  const repository = options.repository ?? createCoachRepository();

  // POST /api/v1/coach/sessions - Créer une nouvelle session de coaching
  app.post('/api/v1/coach/sessions', async (req: SessionRequest, reply: FastifyReply) => {
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

      app.log.error({ error }, 'Unexpected error creating coach session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/coach/sessions - Liste des sessions
  app.get('/api/v1/coach/sessions', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const sessions = await repository.listSessions(user.sub);
      reply.send({ ok: true, data: sessions });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching coach sessions');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/coach/sessions/:id - Détails d'une session
  app.get('/api/v1/coach/sessions/:id', async (req: SessionGetRequest, reply: FastifyReply) => {
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
      app.log.error({ error }, 'Unexpected error fetching coach session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // PATCH /api/v1/coach/sessions/:id - Mettre à jour une session
  app.patch('/api/v1/coach/sessions/:id', async (req: SessionUpdateRequest, reply: FastifyReply) => {
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

      app.log.error({ error }, 'Unexpected error updating coach session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // DELETE /api/v1/coach/sessions/:id - Supprimer une session
  app.delete('/api/v1/coach/sessions/:id', async (req: SessionGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      await repository.deleteSession(id, user.sub);
      reply.code(204).send();
    } catch (error) {
      app.log.error({ error }, 'Unexpected error deleting coach session');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // POST /api/v1/coach/messages - Envoyer un message
  app.post('/api/v1/coach/messages', async (req: MessageRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createMessageSchema.parse(req.body);
      const ownsSession = await repository.verifySessionOwnership(data.session_id, user.sub);

      if (!ownsSession) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      const message = await repository.createMessage(user.sub, data);
      reply.code(201).send({ ok: true, data: message });
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

      app.log.error({ error }, 'Unexpected error creating coach message');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/coach/sessions/:sessionId/messages - Messages d'une session
  app.get('/api/v1/coach/sessions/:sessionId/messages', async (req: MessageListRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { sessionId } = req.params;
      const ownsSession = await repository.verifySessionOwnership(sessionId, user.sub);

      if (!ownsSession) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      const messages = await repository.listMessages(sessionId, user.sub);
      reply.send({ ok: true, data: messages });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching coach messages');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/coach/programs - Programmes disponibles
  app.get('/api/v1/coach/programs', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    // Pour l'instant, retourner des programmes hardcodés
    // À terme, ils seront stockés en base de données
    reply.send({
      ok: true,
      data: [
        {
          id: 'stress-management',
          name: 'Gestion du stress',
          description: 'Apprenez à gérer votre stress au quotidien',
          duration_weeks: 4,
          sessions_count: 8,
        },
        {
          id: 'emotional-intelligence',
          name: 'Intelligence émotionnelle',
          description: 'Développez votre intelligence émotionnelle',
          duration_weeks: 6,
          sessions_count: 12,
        },
        {
          id: 'resilience',
          name: 'Résilience',
          description: 'Renforcez votre résilience face aux défis',
          duration_weeks: 8,
          sessions_count: 16,
        },
      ],
    });
  });

  // GET /api/v1/coach/insights - Insights générés
  app.get('/api/v1/coach/insights', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const sessions = await repository.listSessionsWithMood(user.sub, 10);
      // Calculer des insights basiques
      const insights = [];
      if (sessions && sessions.length > 0) {
        const avgMoodBefore = sessions.reduce((acc: number, s: any) => acc + (s.mood_before || 0), 0) / sessions.length;
        const avgMoodAfter = sessions.reduce((acc: number, s: any) => acc + (s.mood_after || 0), 0) / sessions.length;
        const improvement = avgMoodAfter - avgMoodBefore;

        insights.push({
          type: 'mood_improvement',
          title: 'Amélioration de l\'humeur',
          description: `Vos sessions de coaching améliorent votre humeur de ${improvement.toFixed(1)} points en moyenne`,
          value: improvement,
        });

        const totalSessions = sessions.length;
        insights.push({
          type: 'session_count',
          title: 'Sessions complétées',
          description: `Vous avez complété ${totalSessions} sessions de coaching`,
          value: totalSessions,
        });
      }

      reply.send({ ok: true, data: insights });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching coach insights');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });
}
