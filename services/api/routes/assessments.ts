/**
 * Assessment API Routes
 * Endpoints pour gérer les évaluations psychométriques (WHO-5, PHQ-9, etc.)
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getSupabaseClient } from '../lib/supabase';

const createAssessmentSchema = z.object({
  instrument: z.string(),
  score_json: z.record(z.any()).optional(),
  submitted_at: z.string().optional(),
});

const submitAssessmentSchema = z.object({
  responses: z.record(z.any()),
  score_json: z.record(z.any()).optional(),
});

type AssessmentRequest = FastifyRequest<{
  Body: z.infer<typeof createAssessmentSchema>;
}>;

type AssessmentSubmitRequest = FastifyRequest<{
  Params: { id: string };
  Body: z.infer<typeof submitAssessmentSchema>;
}>;

type AssessmentGetRequest = FastifyRequest<{
  Params: { id: string };
}>;

type AssessmentListRequest = FastifyRequest<{
  Querystring: {
    instrument?: string;
    limit?: string;
    offset?: string;
  };
}>;

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;

type AssessmentRecord = Record<string, any>;

export interface AssessmentRepository {
  createAssessment: (userId: string, payload: CreateAssessmentInput) => Promise<AssessmentRecord>;
  listAssessments: (
    userId: string,
    filters: { instrument?: string; limit: number; offset: number },
  ) => Promise<AssessmentRecord[]>;
  getAssessment: (id: string, userId: string) => Promise<AssessmentRecord | null>;
  submitAssessment: (
    id: string,
    userId: string,
    payload: SubmitAssessmentInput,
  ) => Promise<AssessmentRecord | null>;
  getActiveAssessment: (userId: string) => Promise<AssessmentRecord | null>;
  listInstruments: () => Promise<AssessmentRecord[]>;
}

const createAssessmentRepository = (): AssessmentRepository => {
  const supabase = getSupabaseClient();

  return {
    async createAssessment(userId, payload) {
      const { data, error } = await supabase
        .from('assessments')
        .insert({
          user_id: userId,
          instrument: payload.instrument,
          score_json: payload.score_json || {},
          submitted_at: payload.submitted_at || null,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    async listAssessments(userId, { instrument, limit, offset }) {
      let query = supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('ts', { ascending: false })
        .range(offset, offset + limit - 1);

      if (instrument) {
        query = query.eq('instrument', instrument);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    async getAssessment(id, userId) {
      const { data, error } = await supabase
        .from('assessments')
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
    async submitAssessment(id, userId, payload) {
      const { data, error } = await supabase
        .from('assessments')
        .update({
          score_json: payload.score_json || payload.responses,
          submitted_at: new Date().toISOString(),
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
    async getActiveAssessment(userId) {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .is('submitted_at', null)
        .order('ts', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
    async listInstruments() {
      const { data, error } = await supabase.from('clinical_instruments').select('*').order('name', { ascending: true });
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

export type AssessmentRoutesOptions = {
  repository?: AssessmentRepository;
};

const parseLimit = (value?: string) => {
  const parsed = Number.parseInt(value ?? '20', 10);
  if (Number.isNaN(parsed)) return 20;
  return Math.min(Math.max(parsed, 1), 100);
};

const parseOffset = (value?: string) => {
  const parsed = Number.parseInt(value ?? '0', 10);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
};

export function registerAssessmentRoutes(app: FastifyInstance, options: AssessmentRoutesOptions = {}) {
  const repository = options.repository ?? createAssessmentRepository();

  // POST /api/v1/assessments - Créer une nouvelle évaluation
  app.post('/api/v1/assessments', async (req: AssessmentRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createAssessmentSchema.parse(req.body);
      const assessment = await repository.createAssessment(user.sub, data);
      reply.code(201).send({ ok: true, data: assessment });
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

      app.log.error({ error }, 'Unexpected error creating assessment');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/assessments - Liste des évaluations
  app.get('/api/v1/assessments', async (req: AssessmentListRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { instrument, limit, offset } = req.query;
      const limitNum = parseLimit(limit);
      const offsetNum = parseOffset(offset);
      const assessments = await repository.listAssessments(user.sub, {
        instrument,
        limit: limitNum,
        offset: offsetNum,
      });

      reply.send({ ok: true, data: assessments });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching assessments');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/assessments/:id - Détails d'une évaluation
  app.get('/api/v1/assessments/:id', async (req: AssessmentGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const assessment = await repository.getAssessment(id, user.sub);

      if (!assessment) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Assessment not found' },
        });
        return;
      }

      reply.send({ ok: true, data: assessment });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching assessment');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // POST /api/v1/assessments/:id/submit - Soumettre les réponses d'une évaluation
  app.post('/api/v1/assessments/:id/submit', async (req: AssessmentSubmitRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const data = submitAssessmentSchema.parse(req.body);
      const assessment = await repository.submitAssessment(id, user.sub, data);

      if (!assessment) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Assessment not found' },
        });
        return;
      }

      reply.send({ ok: true, data: assessment });
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

      app.log.error({ error }, 'Unexpected error submitting assessment');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/assessments/active - Évaluation en cours
  app.get('/api/v1/assessments/active', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const assessment = await repository.getActiveAssessment(user.sub);
      reply.send({ ok: true, data: assessment });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching active assessment');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/assessments/instruments - Instruments disponibles
  app.get('/api/v1/assessments/instruments', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const instruments = await repository.listInstruments();
      reply.send({ ok: true, data: instruments });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching instruments');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });
}
