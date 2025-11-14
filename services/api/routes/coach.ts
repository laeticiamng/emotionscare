/**
 * AI Coach API Routes
 * Endpoints pour gérer les sessions de coaching et les messages
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

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

export function registerCoachRoutes(app: FastifyInstance) {
  // POST /api/v1/coach/sessions - Créer une nouvelle session de coaching
  app.post('/api/v1/coach/sessions', async (req: SessionRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createSessionSchema.parse(req.body);
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: session, error } = await supabase
        .from('coach_sessions')
        .insert({
          user_id: user.sub,
          title: data.title || 'Session de coaching',
          coach_mode: data.coach_mode || 'empathetic',
          topic: data.topic,
          mood_before: data.mood_before,
        })
        .select()
        .single();

      if (error) {
        app.log.error({ error }, 'Failed to create coach session');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to create coach session' },
        });
        return;
      }

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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: sessions, error } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false });

      if (error) {
        app.log.error({ error }, 'Failed to fetch coach sessions');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch coach sessions' },
        });
        return;
      }

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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: session, error } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.sub)
        .single();

      if (error || !session) {
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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: session, error } = await supabase
        .from('coach_sessions')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.sub)
        .select()
        .single();

      if (error || !session) {
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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from('coach_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.sub);

      if (error) {
        app.log.error({ error }, 'Failed to delete coach session');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to delete coach session' },
        });
        return;
      }

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
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Vérifier que la session appartient à l'utilisateur
      const { data: session } = await supabase
        .from('coach_sessions')
        .select('id')
        .eq('id', data.session_id)
        .eq('user_id', user.sub)
        .single();

      if (!session) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      const { data: message, error } = await supabase
        .from('coach_messages')
        .insert({
          session_id: data.session_id,
          user_id: user.sub,
          sender: data.sender,
          content: data.content,
          message_type: data.message_type || 'text',
          emotions_detected: data.emotions_detected || {},
        })
        .select()
        .single();

      if (error) {
        app.log.error({ error }, 'Failed to create coach message');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to create coach message' },
        });
        return;
      }

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
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Vérifier que la session appartient à l'utilisateur
      const { data: session } = await supabase
        .from('coach_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('user_id', user.sub)
        .single();

      if (!session) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Session not found' },
        });
        return;
      }

      const { data: messages, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        app.log.error({ error }, 'Failed to fetch coach messages');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch coach messages' },
        });
        return;
      }

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
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Récupérer les sessions récentes pour générer des insights
      const { data: sessions, error } = await supabase
        .from('coach_sessions')
        .select('*')
        .eq('user_id', user.sub)
        .not('mood_before', 'is', null)
        .not('mood_after', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        app.log.error({ error }, 'Failed to fetch sessions for insights');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch sessions for insights' },
        });
        return;
      }

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
