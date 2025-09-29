import { createServer } from '../lib/server';
import { hash } from '../journal/lib/hash';
import { createExportJob, findRecentJob, getJob, createDeleteRequest, getDeleteRequest } from './lib/db';
import { z } from 'zod';

const ExportRequestSchema = z.object({
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  data_types: z.array(z.enum(['journal', 'analytics', 'preferences'])).default(['journal']),
  date_range: z.object({
    start: z.string().optional(),
    end: z.string().optional()
  }).optional()
});

type ExportRequest = z.infer<typeof ExportRequestSchema>;

export function createApp() {
  return createServer({
    registerRoutes(app) {
      // POST /user/export - Request data export
      app.post<{
        Body: ExportRequest;
      }>('/user/export', async (req, reply) => {
        const userHash = hash(req.user.sub);
        
        try {
          const exportRequest = req.body ? ExportRequestSchema.parse(req.body) : ExportRequestSchema.parse({});
          
          // Check for existing recent job
          const existing = findRecentJob(userHash);
          if (existing) {
            reply.code(202).send({ 
              ok: true,
              data: { jobId: existing.id, status: 'existing' }
            });
            return;
          }
          
          // Create new export job
          const job = createExportJob(userHash);
          
          app.log.info({
            user_hash: userHash,
            action: 'export_requested',
            job_id: job.id,
            request: exportRequest
          });

          reply.code(202).send({ 
            ok: true,
            data: { jobId: job.id, status: 'created' }
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            reply.code(400).send({
              ok: false,
              error: {
                code: 'validation_error',
                message: 'Invalid export request',
                details: error.errors
              }
            });
          } else {
            app.log.error(error);
            reply.code(500).send({ ok: false, error: 'Failed to create export job' });
          }
        }
      });

      // GET /user/export/:id - Get export job status
      app.get<{
        Params: { id: string };
      }>('/user/export/:id', async (req, reply) => {
        const userHash = hash(req.user.sub);
        const job = getJob(req.params.id);
        
        if (!job) {
          reply.code(404).send({
            ok: false,
            error: { code: 'not_found', message: 'Export job not found' }
          });
          return;
        }
        
        if (job.user_id_hash !== userHash) {
          reply.code(403).send({
            ok: false,
            error: { code: 'forbidden', message: 'Access denied' }
          });
          return;
        }

        reply.send({ 
          ok: true, 
          data: job
        });
      });

      // POST /user/delete - Request account deletion
      app.post('/user/delete', async (req, reply) => {
        const userHash = hash(req.user.sub);
        
        try {
          createDeleteRequest(userHash);
          
          app.log.info({
            user_hash: userHash,
            action: 'delete_requested',
            timestamp: new Date().toISOString()
          });

          reply.code(204).send();
        } catch (error) {
          app.log.error(error);
          reply.code(500).send({ ok: false, error: 'Failed to create delete request' });
        }
      });

      // GET /user/delete/status - Get account deletion status
      app.get('/user/delete/status', async (req, reply) => {
        const userHash = hash(req.user.sub);
        
        try {
          const deleteRequest = getDeleteRequest(userHash);
          
          reply.send({ 
            ok: true, 
            data: deleteRequest || null
          });
        } catch (error) {
          app.log.error(error);
          reply.code(500).send({ ok: false, error: 'Failed to fetch delete status' });
        }
      });
    },
  });
}
