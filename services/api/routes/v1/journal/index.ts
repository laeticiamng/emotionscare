import { FastifyPluginAsync } from 'fastify';
import {
  journalEntrySchema,
  createJournalEntrySchema,
  updateJournalEntrySchema,
  listJournalEntriesSchema,
  journalStatsSchema,
} from '@emotionscare/contracts';
import type { JournalEntry } from '@emotionscare/contracts';

/**
 * Journal API Routes
 *
 * Endpoints:
 * - GET    /v1/journal          - List journal entries with filters
 * - POST   /v1/journal          - Create a new journal entry
 * - GET    /v1/journal/:id      - Get a specific journal entry
 * - PATCH  /v1/journal/:id      - Update a journal entry
 * - DELETE /v1/journal/:id      - Delete a journal entry
 * - GET    /v1/journal/stats    - Get journal statistics
 */

export const journalRoutes: FastifyPluginAsync = async app => {
  // List journal entries
  app.get('/', async (req, reply) => {
    try {
      // Validate query params
      const filters = listJournalEntriesSchema.parse(req.query);
      const userId = (req as any).user.id;

      // TODO: Implement database query
      // const entries = await db.journal.list(userId, filters);

      // Placeholder response
      const entries: JournalEntry[] = [];

      return {
        ok: true,
        data: entries,
        meta: {
          total: entries.length,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: false,
        },
      };
    } catch (err) {
      app.log.error({ err }, 'Failed to list journal entries');
      throw err;
    }
  });

  // Create a new journal entry
  app.post('/', async (req, reply) => {
    try {
      // Validate request body
      const input = createJournalEntrySchema.parse(req.body);
      const userId = (req as any).user.id;

      // TODO: Implement database insert
      // const entry = await db.journal.create(userId, input);

      // Placeholder response
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        ...input,
        date: new Date().toISOString(),
        user_id: userId,
      };

      reply.code(201);
      return {
        ok: true,
        data: entry,
      };
    } catch (err) {
      app.log.error({ err }, 'Failed to create journal entry');
      throw err;
    }
  });

  // Get a specific journal entry
  app.get('/:id', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).user.id;

      // TODO: Implement database query
      // const entry = await db.journal.get(id, userId);

      // Placeholder
      return {
        ok: false,
        error: {
          code: 'not_found',
          message: 'Journal entry not found',
        },
      };
    } catch (err) {
      app.log.error({ err, id: (req.params as any).id }, 'Failed to get journal entry');
      throw err;
    }
  });

  // Update a journal entry
  app.patch('/:id', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const input = updateJournalEntrySchema.parse(req.body);
      const userId = (req as any).user.id;

      // TODO: Implement database update
      // const entry = await db.journal.update(id, userId, input);

      return {
        ok: false,
        error: {
          code: 'not_found',
          message: 'Journal entry not found',
        },
      };
    } catch (err) {
      app.log.error({ err, id: (req.params as any).id }, 'Failed to update journal entry');
      throw err;
    }
  });

  // Delete a journal entry
  app.delete('/:id', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).user.id;

      // TODO: Implement database delete
      // await db.journal.delete(id, userId);

      reply.code(204);
      return;
    } catch (err) {
      app.log.error({ err, id: (req.params as any).id }, 'Failed to delete journal entry');
      throw err;
    }
  });

  // Get journal statistics
  app.get('/stats', async (req, reply) => {
    try {
      const userId = (req as any).user.id;

      // TODO: Implement database query
      // const stats = await db.journal.stats(userId);

      // Placeholder
      const stats = {
        totalEntries: 0,
        averageMoodScore: 0,
        mostCommonMood: undefined,
        mostUsedTags: [],
        entriesThisWeek: 0,
        entriesThisMonth: 0,
      };

      return {
        ok: true,
        data: journalStatsSchema.parse(stats),
      };
    } catch (err) {
      app.log.error({ err }, 'Failed to get journal stats');
      throw err;
    }
  });
};

export default journalRoutes;
