import { FastifyPluginAsync } from 'fastify';
import {
  musicGenerationSessionSchema,
  createMusicGenerationSchema,
  listMusicSessionsSchema,
} from '@emotionscare/contracts';
import type { MusicGenerationSession } from '@emotionscare/contracts';

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

      // TODO: Implement database query
      // const sessions = await db.music.listSessions(userId, filters);

      // Placeholder response
      const sessions: MusicGenerationSession[] = [];

      return {
        ok: true,
        data: sessions,
        meta: {
          total: sessions.length,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: false,
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

      // TODO: Implement music generation flow
      // 1. Create session in database
      // 2. Call Suno API
      // 3. Return session with taskId for polling
      // const session = await musicService.createGeneration(userId, input);

      // Placeholder response
      const session: MusicGenerationSession = {
        id: crypto.randomUUID(),
        userId,
        taskId: `task_${Date.now()}`,
        emotionState: input.emotionState,
        emotionBadge: input.emotionBadge,
        sunoConfig: input.config,
        result: {
          taskId: `task_${Date.now()}`,
          status: 'pending',
        },
        createdAt: new Date(),
      };

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

      // TODO: Implement database query and status check
      // const session = await db.music.getSession(id, userId);
      // If status is pending/processing, check Suno API for updates

      return {
        ok: false,
        error: {
          code: 'not_found',
          message: 'Music session not found',
        },
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

      // TODO: Implement cancellation
      // 1. Check session exists and belongs to user
      // 2. Check status is pending or processing
      // 3. Cancel on Suno API if needed
      // 4. Update status to 'cancelled'
      // await musicService.cancelGeneration(id, userId);

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

      // TODO: Implement deletion
      // await db.music.deleteSession(id, userId);

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
