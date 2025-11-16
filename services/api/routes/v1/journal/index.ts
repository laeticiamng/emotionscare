import { FastifyPluginAsync } from 'fastify';
import {
  journalEntrySchema,
  createJournalEntrySchema,
  updateJournalEntrySchema,
  listJournalEntriesSchema,
  journalStatsSchema,
} from '@emotionscare/contracts';
import type { JournalEntry } from '@emotionscare/contracts';
import * as journalDb from '../../../lib/db/journal';

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

      const result = await journalDb.listJournalEntries(userId, filters);

      return {
        ok: true,
        data: result.entries,
        meta: {
          total: result.total,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: result.hasMore,
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

      const entry = await journalDb.createJournalEntry(userId, input);

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

      const entry = await journalDb.getJournalEntry(id, userId);

      if (!entry) {
        reply.code(404);
        return {
          ok: false,
          error: {
            code: 'not_found',
            message: 'Journal entry not found',
          },
        };
      }

      return {
        ok: true,
        data: entry,
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

      const entry = await journalDb.updateJournalEntry(id, userId, input);

      return {
        ok: true,
        data: entry,
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

      await journalDb.deleteJournalEntry(id, userId);

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

      const stats = await journalDb.getJournalStats(userId);

      return {
        ok: true,
        data: stats,
      };
    } catch (err) {
      app.log.error({ err }, 'Failed to get journal stats');
      throw err;
    }
  });
};

export default journalRoutes;
