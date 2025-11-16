import { FastifyPluginAsync } from 'fastify';
import {
  musicGenerationSessionSchema,
  createMusicGenerationSchema,
  listMusicSessionsSchema,
} from '@emotionscare/contracts';
import type { MusicGenerationSession } from '@emotionscare/contracts';
import * as musicDb from '../../../lib/db/music';

/**
 * Music Generation API Routes
 *
 * Endpoints:
 * - GET    /v1/music              - List music generation sessions
 * - POST   /v1/music              - Create a new music generation request
 * - GET    /v1/music/:id          - Get a specific session with status
 * - POST   /v1/music/:id/cancel   - Cancel a pending generation
 * - DELETE /v1/music/:id          - Delete a session
 */

export const musicRoutes: FastifyPluginAsync = async app => {
  // List music generation sessions
  app.get('/', async (req, reply) => {
    try {
      const filters = listMusicSessionsSchema.parse(req.query);
      const userId = (req as any).user.id;

      const result = await musicDb.listMusicSessions(userId, filters);

      return {
        ok: true,
        data: result.sessions,
        meta: {
          total: result.total,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: result.hasMore,
        },
      };
    } catch (err) {
      app.log.error({ err }, 'Failed to list music sessions');
      throw err;
    }
  });

  // Create a new music generation request
  app.post('/', async (req, reply) => {
    try {
      const input = createMusicGenerationSchema.parse(req.body);
      const userId = (req as any).user.id;

      // 1. Create session in database
      const session = await musicDb.createMusicSession(userId, input);

      // TODO: 2. Call Suno API (to be implemented when Suno API is available)
      // await sunoService.generateMusic(session.task_id, input.config);

      // For now, session is created with 'pending' status
      // The Suno webhook will update it when generation is complete

      reply.code(201);
      return {
        ok: true,
        data: session,
      };
    } catch (err) {
      app.log.error({ err }, 'Failed to create music generation');
      throw err;
    }
  });

  // Get a specific music generation session
  app.get('/:id', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).user.id;

      const session = await musicDb.getMusicSession(id, userId);

      if (!session) {
        reply.code(404);
        return {
          ok: false,
          error: {
            code: 'not_found',
            message: 'Music session not found',
          },
        };
      }

      // TODO: If status is pending/processing, check Suno API for updates
      // if (session.status === 'pending' || session.status === 'processing') {
      //   const sunoStatus = await sunoService.checkStatus(session.task_id);
      //   if (sunoStatus.status !== session.status) {
      //     session = await musicDb.updateMusicSession(id, userId, {
      //       status: sunoStatus.status,
      //       result: sunoStatus.result,
      //     });
      //   }
      // }

      return {
        ok: true,
        data: session,
      };
    } catch (err) {
      app.log.error({ err, id: (req.params as any).id }, 'Failed to get music session');
      throw err;
    }
  });

  // Cancel a pending music generation
  app.post('/:id/cancel', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).user.id;

      // 1. Check session exists and belongs to user
      const session = await musicDb.getMusicSession(id, userId);

      if (!session) {
        reply.code(404);
        return {
          ok: false,
          error: {
            code: 'not_found',
            message: 'Music session not found',
          },
        };
      }

      // 2. Check status is pending or processing
      if (session.status !== 'pending' && session.status !== 'processing') {
        reply.code(400);
        return {
          ok: false,
          error: {
            code: 'invalid_status',
            message: `Cannot cancel session with status: ${session.status}`,
          },
        };
      }

      // 3. TODO: Cancel on Suno API if needed
      // await sunoService.cancel(session.task_id);

      // 4. Update status to 'cancelled'
      await musicDb.updateMusicSession(id, userId, {
        status: 'failed', // Using 'failed' as 'cancelled' is not in the schema
        result: {
          taskId: session.task_id,
          status: 'failed',
        },
      });

      return {
        ok: true,
        message: 'Music generation cancelled',
      };
    } catch (err) {
      app.log.error({ err, id: (req.params as any).id }, 'Failed to cancel music generation');
      throw err;
    }
  });

  // Delete a music generation session
  app.delete('/:id', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).user.id;

      await musicDb.deleteMusicSession(id, userId);

      reply.code(204);
      return;
    } catch (err) {
      app.log.error({ err, id: (req.params as any).id }, 'Failed to delete music session');
      throw err;
    }
  });

  // Webhook endpoint for Suno callbacks (optional)
  app.post('/webhook/suno', async (req, reply) => {
    try {
      // TODO: Implement webhook handler
      // 1. Validate webhook signature
      // 2. Parse callback data
      // 3. Update session status in database
      // 4. Notify user if needed (WebSocket, push notification, etc.)

      app.log.info({ body: req.body }, 'Received Suno webhook');

      return { ok: true };
    } catch (err) {
      app.log.error({ err }, 'Failed to process Suno webhook');
      throw err;
    }
  });
};

export default musicRoutes;
