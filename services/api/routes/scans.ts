/**
 * Emotion Scans API Routes
 * Endpoints pour gérer les scans émotionnels multi-modaux
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { getSupabaseClient } from '../lib/supabase';

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

type ScanRecord = Record<string, any>;
export type CreateScanInput = z.infer<typeof createScanSchema>;

export interface ScanRepository {
  createScan: (userId: string, payload: CreateScanInput) => Promise<ScanRecord>;
  listScans: (
    userId: string,
    filters: {
      scanType?: string;
      fromDate?: string;
      toDate?: string;
      limit: number;
      offset: number;
    },
  ) => Promise<ScanRecord[]>;
  getScan: (id: string, userId: string) => Promise<ScanRecord | null>;
  deleteScan: (id: string, userId: string) => Promise<void>;
  listScansSince: (userId: string, since: Date) => Promise<ScanRecord[]>;
  listRecentScans: (userId: string, days: number) => Promise<ScanRecord[]>;
}

const createScanRepository = (): ScanRepository => {
  const supabase = getSupabaseClient();

  return {
    async createScan(userId, payload) {
      // Map to existing + new columns for compatibility
      const { data, error } = await supabase
        .from('emotion_scans')
        .insert({
          user_id: userId,
          emotions: payload.emotions,
          dominant_emotion: payload.dominant_emotion,
          mood: payload.dominant_emotion, // existing column
          confidence: payload.confidence_score, // existing column
          confidence_score: payload.confidence_score, // new column
          scan_type: payload.scan_type,
          context: payload.context || {},
          notes: payload.notes,
          recommendations: payload.recommendations || {},
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    async listScans(userId, { scanType, fromDate, toDate, limit, offset }) {
      let query = supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (scanType) {
        query = query.eq('scan_type', scanType);
      }

      if (fromDate) {
        query = query.gte('created_at', fromDate);
      }

      if (toDate) {
        query = query.lte('created_at', toDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    async getScan(id, userId) {
      const { data, error } = await supabase
        .from('emotion_scans')
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
    async deleteScan(id, userId) {
      const { error } = await supabase
        .from('emotion_scans')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    async listScansSince(userId, since) {
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', since.toISOString());

      if (error) throw error;
      return data ?? [];
    },
    async listRecentScans(userId, days) {
      const threshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const { data, error } = await supabase
        .from('emotion_scans')
        .select('dominant_emotion, mood, created_at, confidence_score, confidence')
        .eq('user_id', userId)
        .gte('created_at', threshold.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      // Map to consistent format
      return (data ?? []).map((scan: any) => ({
        dominant_emotion: scan.dominant_emotion || scan.mood,
        created_at: scan.created_at,
        confidence_score: scan.confidence_score ?? scan.confidence,
      }));
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

export type ScanRoutesOptions = {
  repository?: ScanRepository;
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

export function registerScanRoutes(app: FastifyInstance, options: ScanRoutesOptions = {}) {
  const repository = options.repository ?? createScanRepository();

  // POST /api/v1/scans - Créer un nouveau scan émotionnel
  app.post('/api/v1/scans', async (req: ScanRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = createScanSchema.parse(req.body);
      const scan = await repository.createScan(user.sub, data);
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
      const { scan_type, from_date, to_date, limit, offset } = req.query;
      const scans = await repository.listScans(user.sub, {
        scanType: scan_type,
        fromDate: from_date,
        toDate: to_date,
        limit: parseLimit(limit),
        offset: parseOffset(offset),
      });

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
      const scan = await repository.getScan(id, user.sub);

      if (!scan) {
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
      await repository.deleteScan(id, user.sub);
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

      const scans = await repository.listScansSince(user.sub, startDate);

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
      const scans = await repository.listRecentScans(user.sub, 30);
      reply.send({ ok: true, data: scans });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching scan trends');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // =====================================================
  // Emotions Table Endpoints (legacy table support)
  // =====================================================

  const emotionCheckinSchema = z.object({
    emojis: z.string().optional(),
    primary_emotion: z.string().optional(),
    score: z.number().min(1).max(10).optional(),
    intensity: z.number().min(1).max(10).optional(),
    text: z.string().max(500).optional(),
    source: z.string().optional(),
    ai_feedback: z.string().optional(),
  });

  type EmotionCheckinRequest = FastifyRequest<{
    Body: z.infer<typeof emotionCheckinSchema>;
  }>;

  type EmotionListRequest = FastifyRequest<{
    Querystring: {
      limit?: string;
    };
  }>;

  // POST /api/v1/emotions/checkin - Quick emotion check-in
  app.post('/api/v1/emotions/checkin', async (req: EmotionCheckinRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = emotionCheckinSchema.parse(req.body);
      const supabase = getSupabaseClient();

      const { data: result, error } = await supabase
        .from('emotions')
        .insert({
          user_id: user.sub,
          emojis: data.emojis || data.primary_emotion,
          primary_emotion: data.primary_emotion,
          score: data.score || data.intensity,
          intensity: data.intensity || data.score,
          text: data.text,
          source: data.source || 'checkin',
          ai_feedback: data.ai_feedback,
          date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      reply.code(201).send({ ok: true, data: result });
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

      app.log.error({ error }, 'Unexpected error creating emotion checkin');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // GET /api/v1/emotions/recent - Get recent emotion entries
  app.get('/api/v1/emotions/recent', async (req: EmotionListRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const limit = parseLimit(req.query.limit);
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.sub)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      reply.send({ ok: true, data: data ?? [] });
    } catch (error) {
      app.log.error({ error }, 'Unexpected error fetching recent emotions');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });

  // POST /api/v1/emotions - Create full emotion record (for scanners)
  app.post('/api/v1/emotions', async (req: EmotionCheckinRequest, reply: FastifyReply) => {
    const user = ensureUser(req, reply);
    if (!user) return;

    try {
      const data = emotionCheckinSchema.parse(req.body);
      const supabase = getSupabaseClient();

      const { data: result, error } = await supabase
        .from('emotions')
        .insert({
          user_id: user.sub,
          emojis: data.emojis,
          primary_emotion: data.primary_emotion,
          score: data.score,
          intensity: data.intensity,
          text: data.text,
          source: data.source,
          ai_feedback: data.ai_feedback,
          date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      reply.code(201).send({ ok: true, data: result });
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

      app.log.error({ error }, 'Unexpected error creating emotion record');
      reply.code(500).send({
        ok: false,
        error: { code: 'internal_error', message: 'Internal server error' },
      });
    }
  });
}
