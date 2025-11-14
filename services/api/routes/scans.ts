/**
 * Emotion Scans API Routes
 * Endpoints pour gérer les scans émotionnels multi-modaux
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const createScanSchema = z.object({
  emotions: z.record(z.number()),
  dominant_emotion: z.string(),
  confidence_score: z.number().min(0).max(1),
  scan_type: z.enum(['facial', 'voice', 'text', 'manual', 'emoji']),
  context: z.record(z.any()).optional(),
  notes: z.string().optional(),
  recommendations: z.record(z.any()).optional(),
});

type ScanRequest = FastifyRequest<{
  Body: z.infer<typeof createScanSchema>;
}>;

type ScanGetRequest = FastifyRequest<{
  Params: { id: string };
}>;

type ScanListRequest = FastifyRequest<{
  Querystring: {
    scan_type?: string;
    from_date?: string;
    to_date?: string;
    limit?: string;
    offset?: string;
  };
}>;

type ScanStatsRequest = FastifyRequest<{
  Querystring: {
    period?: 'daily' | 'weekly' | 'monthly';
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

export function registerScanRoutes(app: FastifyInstance) {
  // POST /api/v1/scans - Créer un nouveau scan émotionnel
  app.post('/api/v1/scans', async (req: ScanRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createScanSchema.parse(req.body);
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: scan, error } = await supabase
        .from('emotion_scans')
        .insert({
          user_id: user.sub,
          emotions: data.emotions,
          dominant_emotion: data.dominant_emotion,
          confidence_score: data.confidence_score,
          scan_type: data.scan_type,
          context: data.context || {},
          notes: data.notes,
          recommendations: data.recommendations || {},
        })
        .select()
        .single();

      if (error) {
        app.log.error({ error }, 'Failed to create scan');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to create scan' },
        });
        return;
      }

      reply.code(201).send({ ok: true, data: scan });
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

      app.log.error({ error }, 'Unexpected error creating scan');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/scans - Liste des scans émotionnels
  app.get('/api/v1/scans', async (req: ScanListRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { scan_type, from_date, to_date, limit = '20', offset = '0' } = req.query;
      const supabase = createClient(supabaseUrl, supabaseKey);

      let query = supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.sub)
        .order('created_at', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      if (scan_type) {
        query = query.eq('scan_type', scan_type);
      }

      if (from_date) {
        query = query.gte('created_at', from_date);
      }

      if (to_date) {
        query = query.lte('created_at', to_date);
      }

      const { data: scans, error } = await query;

      if (error) {
        app.log.error({ error }, 'Failed to fetch scans');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch scans' },
        });
        return;
      }

      reply.send({ ok: true, data: scans });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching scans');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/scans/:id - Détails d'un scan
  app.get('/api/v1/scans/:id', async (req: ScanGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: scan, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.sub)
        .single();

      if (error || !scan) {
        reply.code(404).send({
          ok: false,
          error: { code: 'not_found', message: 'Scan not found' },
        });
        return;
      }

      reply.send({ ok: true, data: scan });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching scan');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // DELETE /api/v1/scans/:id - Supprimer un scan
  app.delete('/api/v1/scans/:id', async (req: ScanGetRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { id } = req.params;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from('emotion_scans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.sub);

      if (error) {
        app.log.error({ error }, 'Failed to delete scan');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to delete scan' },
        });
        return;
      }

      reply.code(204).send();
    } catch (error) {
      app.log.error({ error }, 'Unexpected error deleting scan');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/scans/stats - Statistiques globales
  app.get('/api/v1/scans/stats', async (req: ScanStatsRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const { period = 'weekly' } = req.query;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Calcul de la date de début selon la période
      const now = new Date();
      let startDate: Date;
      switch (period) {
        case 'daily':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'weekly':
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
      }

      const { data: scans, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.sub)
        .gte('created_at', startDate.toISOString());

      if (error) {
        app.log.error({ error }, 'Failed to fetch scan stats');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch scan stats' },
        });
        return;
      }

      // Calculer les statistiques
      const totalScans = scans.length;
      const emotionCounts: Record<string, number> = {};
      const scanTypeCounts: Record<string, number> = {};
      let avgConfidence = 0;

      scans.forEach((scan: any) => {
        // Compter les émotions dominantes
        emotionCounts[scan.dominant_emotion] = (emotionCounts[scan.dominant_emotion] || 0) + 1;

        // Compter les types de scan
        scanTypeCounts[scan.scan_type] = (scanTypeCounts[scan.scan_type] || 0) + 1;

        // Moyenne de confiance
        avgConfidence += scan.confidence_score;
      });

      if (totalScans > 0) {
        avgConfidence /= totalScans;
      }

      reply.send({
        ok: true,
        data: {
          period,
          total_scans: totalScans,
          emotion_distribution: emotionCounts,
          scan_type_distribution: scanTypeCounts,
          average_confidence: avgConfidence,
        },
      });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching scan stats');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/scans/trends - Tendances émotionnelles
  app.get('/api/v1/scans/trends', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Récupérer les scans des 30 derniers jours
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const { data: scans, error } = await supabase
        .from('emotion_scans')
        .select('dominant_emotion, created_at, confidence_score')
        .eq('user_id', user.sub)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        app.log.error({ error }, 'Failed to fetch scan trends');
        reply.code(500).send({
          ok: false,
          error: { code: 'database_error', message: 'Failed to fetch scan trends' },
        });
        return;
      }

      reply.send({ ok: true, data: scans });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching scan trends');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });
}
