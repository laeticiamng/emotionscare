/**
 * Goals API Routes
 * Endpoints pour gérer les objectifs personnels et le bien-être
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getSupabaseClient } from '../lib/supabase';

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

type GoalRecord = Record<string, any>;

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type ProgressInput = z.infer<typeof progressUpdateSchema>;

export interface GoalRepository {
  createGoal: (userId: string, payload: CreateGoalInput) => Promise<GoalRecord>;
  listGoals: (userId: string) => Promise<GoalRecord[]>;
  getGoal: (id: string, userId: string) => Promise<GoalRecord | null>;
  updateGoal: (id: string, userId: string, payload: UpdateGoalInput) => Promise<GoalRecord | null>;
  deleteGoal: (id: string, userId: string) => Promise<void>;
  completeGoal: (id: string, userId: string) => Promise<GoalRecord | null>;
  updateProgress: (id: string, userId: string, payload: ProgressInput) => Promise<GoalRecord | null>;
  listActiveGoals: (userId: string) => Promise<GoalRecord[]>;
  listCompletedGoals: (userId: string) => Promise<GoalRecord[]>;
  listAllGoals: (userId: string) => Promise<GoalRecord[]>;
}

const createGoalRepository = (): GoalRepository => {
  const supabase = getSupabaseClient();

  return {
    async createGoal(userId, payload) {
      const { data, error } = await supabase
        .from('personal_goals')
        .insert({
          user_id: userId,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          target_date: payload.target_date,
          target_value: payload.target_value,
          current_value: payload.current_value || 0,
          unit: payload.unit,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    async listGoals(userId) {
      const { data, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    async getGoal(id, userId) {
      const { data, error } = await supabase
        .from('personal_goals')
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
    async updateGoal(id, userId, payload) {
      const { data, error } = await supabase
        .from('personal_goals')
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
    async deleteGoal(id, userId) {
      const { error } = await supabase
        .from('personal_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    async completeGoal(id, userId) {
      const { data, error } = await supabase
        .from('personal_goals')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
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
    async updateProgress(id, userId, payload) {
      const { data, error } = await supabase
        .from('personal_goals')
        .update({
          current_value: payload.current_value,
          updated_at: new Date().toISOString(),
        })
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
    async listActiveGoals(userId) {
      const { data, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    async listCompletedGoals(userId) {
      const { data, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    async listAllGoals(userId) {
      const { data, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', userId);

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

export type GoalRoutesOptions = {
  repository?: GoalRepository;
};

export function registerGoalRoutes(app: FastifyInstance, options: GoalRoutesOptions = {}) {
  const repository = options.repository ?? createGoalRepository();

  // POST /api/v1/goals - Créer un nouvel objectif
  app.post('/api/v1/goals', async (req: GoalRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createGoalSchema.parse(req.body);
      const goal = await repository.createGoal(user.sub, data);
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
      const goals = await repository.listGoals(user.sub);
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
      const goal = await repository.getGoal(id, user.sub);

      if (!goal) {
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
      const goal = await repository.updateGoal(id, user.sub, data);

      if (!goal) {
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
      await repository.deleteGoal(id, user.sub);
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
      const goal = await repository.completeGoal(id, user.sub);

      if (!goal) {
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
      const goal = await repository.updateProgress(id, user.sub, data);

      if (!goal) {
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
      const goals = await repository.listActiveGoals(user.sub);
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
      const goals = await repository.listCompletedGoals(user.sub);
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
      const goals = await repository.listAllGoals(user.sub);

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
