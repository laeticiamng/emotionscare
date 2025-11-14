/**
 * Assessment API Routes
 * Endpoints pour gérer les évaluations psychométriques (WHO-5, PHQ-9, etc.)
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

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

export function registerAssessmentRoutes(app: FastifyInstance) {
  // POST /api/v1/assessments - Créer une nouvelle évaluation
  app.post('/api/v1/assessments', async (req: AssessmentRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createAssessmentSchema.parse(req.body);
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: assessment, error } = await supabase
        .from('assessments')
        .insert({
          user_id: user.sub,
          instrument: data.instrument,
          score_json: data.score_json || {},
          submitted_at: data.submitted_at || null,
        })
        .select()
        .single();

      if (error) {
        app.log.error({ error }, 'Failed to create assessment');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to create assessment' },
        });
        return;
      }

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
      const { instrument, limit = '20', offset = '0' } = req.query;
      const supabase = createClient(supabaseUrl, supabaseKey);

      let query = supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.sub)
        .order('ts', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      if (instrument) {
        query = query.eq('instrument', instrument);
      }

      const { data: assessments, error } = await query;

      if (error) {
        app.log.error({ error }, 'Failed to fetch assessments');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch assessments' },
        });
        return;
      }

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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: assessment, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.sub)
        .single();

      if (error || !assessment) {
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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: assessment, error } = await supabase
        .from('assessments')
        .update({
          score_json: data.score_json || data.responses,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.sub)
        .select()
        .single();

      if (error || !assessment) {
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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: assessment, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.sub)
        .is('submitted_at', null)
        .order('ts', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        app.log.error({ error }, 'Failed to fetch active assessment');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch active assessment' },
        });
        return;
      }

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
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: instruments, error } = await supabase
        .from('clinical_instruments')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        app.log.error({ error }, 'Failed to fetch instruments');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch instruments' },
        });
        return;
      }

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
