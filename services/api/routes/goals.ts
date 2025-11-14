/**
 * Goals API Routes
 * Endpoints pour gérer les objectifs personnels et le bien-être
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const createGoalSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  target_date: z.string().optional(),
  target_value: z.number().optional(),
  current_value: z.number().optional(),
  unit: z.string().optional(),
});

const updateGoalSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  current_value: z.number().optional(),
  completed: z.boolean().optional(),
  completed_at: z.string().optional(),
});

const progressUpdateSchema = z.object({
  current_value: z.number(),
  notes: z.string().optional(),
});

type GoalRequest = FastifyRequest<{
  Body: z.infer<typeof createGoalSchema>;
}>;

type GoalUpdateRequest = FastifyRequest<{
  Params: { id: string };
  Body: z.infer<typeof updateGoalSchema>;
}>;

type GoalGetRequest = FastifyRequest<{
  Params: { id: string };
}>;

type ProgressRequest = FastifyRequest<{
  Params: { id: string };
  Body: z.infer<typeof progressUpdateSchema>;
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

export function registerGoalRoutes(app: FastifyInstance) {
  // POST /api/v1/goals - Créer un nouvel objectif
  app.post('/api/v1/goals', async (req: GoalRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createGoalSchema.parse(req.body);
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goal, error } = await supabase
        .from('personal_goals')
        .insert({
          user_id: user.sub,
          title: data.title,
          description: data.description,
          category: data.category,
          target_date: data.target_date,
          target_value: data.target_value,
          current_value: data.current_value || 0,
          unit: data.unit,
        })
        .select()
        .single();

      if (error) {
        app.log.error({ error }, 'Failed to create goal');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to create goal' },
        });
        return;
      }

      reply.code(201).send({ ok: true, data: goal });
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

      app.log.error({ error }, 'Unexpected error creating goal');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/goals - Liste des objectifs
  app.get('/api/v1/goals', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goals, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false });

      if (error) {
        app.log.error({ error }, 'Failed to fetch goals');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch goals' },
        });
        return;
      }

      reply.send({ ok: true, data: goals });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching goals');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/goals/:id - Détails d'un objectif
  app.get('/api/v1/goals/:id', async (req: GoalGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goal, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.sub)
        .single();

      if (error || !goal) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Goal not found' },
        });
        return;
      }

      reply.send({ ok: true, data: goal });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching goal');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // PATCH /api/v1/goals/:id - Mettre à jour un objectif
  app.patch('/api/v1/goals/:id', async (req: GoalUpdateRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const data = updateGoalSchema.parse(req.body);
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goal, error } = await supabase
        .from('personal_goals')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.sub)
        .select()
        .single();

      if (error || !goal) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Goal not found' },
        });
        return;
      }

      reply.send({ ok: true, data: goal });
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

      app.log.error({ error }, 'Unexpected error updating goal');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // DELETE /api/v1/goals/:id - Supprimer un objectif
  app.delete('/api/v1/goals/:id', async (req: GoalGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from('personal_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.sub);

      if (error) {
        app.log.error({ error }, 'Failed to delete goal');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to delete goal' },
        });
        return;
      }

      reply.code(204).send();
    } catch (error) {
      app.log.error({ error }, 'Unexpected error deleting goal');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // POST /api/v1/goals/:id/complete - Marquer comme terminé
  app.post('/api/v1/goals/:id/complete', async (req: GoalGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goal, error } = await supabase
        .from('personal_goals')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.sub)
        .select()
        .single();

      if (error || !goal) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Goal not found' },
        });
        return;
      }

      reply.send({ ok: true, data: goal });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error completing goal');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // POST /api/v1/goals/:id/progress - Mettre à jour la progression
  app.post('/api/v1/goals/:id/progress', async (req: ProgressRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const data = progressUpdateSchema.parse(req.body);
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Mettre à jour la valeur actuelle
      const { data: goal, error } = await supabase
        .from('personal_goals')
        .update({
          current_value: data.current_value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.sub)
        .select()
        .single();

      if (error || !goal) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Goal not found' },
        });
        return;
      }

      reply.send({ ok: true, data: goal });
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

      app.log.error({ error }, 'Unexpected error updating goal progress');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/goals/active - Objectifs actifs
  app.get('/api/v1/goals/active', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goals, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', user.sub)
        .eq('completed', false)
        .order('created_at', { ascending: false });

      if (error) {
        app.log.error({ error }, 'Failed to fetch active goals');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch active goals' },
        });
        return;
      }

      reply.send({ ok: true, data: goals });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching active goals');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/goals/completed - Objectifs terminés
  app.get('/api/v1/goals/completed', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goals, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', user.sub)
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      if (error) {
        app.log.error({ error }, 'Failed to fetch completed goals');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch completed goals' },
        });
        return;
      }

      reply.send({ ok: true, data: goals });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching completed goals');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/goals/stats - Statistiques des objectifs
  app.get('/api/v1/goals/stats', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: goals, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', user.sub);

      if (error) {
        app.log.error({ error }, 'Failed to fetch goals stats');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch goals stats' },
        });
        return;
      }

      const total = goals.length;
      const completed = goals.filter((g: any) => g.completed).length;
      const active = total - completed;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      reply.send({
        ok: true,
        data: {
          total,
          active,
          completed,
          completion_rate: completionRate,
        },
      });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching goals stats');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });
}
