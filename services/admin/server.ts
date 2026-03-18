import { createServer } from '../lib/server';
import { z } from 'zod';
import { getSupabaseClient } from '../api/lib/supabase';

const OrganizationUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  settings: z.object({
    analytics_enabled: z.boolean().optional(),
    retention_days: z.number().min(30).max(2555).optional(),
    max_users: z.number().min(1).max(10000).optional()
  }).optional()
});

type OrgUpdate = z.infer<typeof OrganizationUpdateSchema>;

export function createApp() {
  return createServer({
    registerRoutes(app) {
      // Admin role check middleware for this service
      app.addHook('preHandler', async (req, reply) => {
        if (!req.user.role || !req.user.role.includes('admin')) {
          reply.code(403).send({
            ok: false,
            error: { code: 'forbidden', message: 'Admin role required' }
          });
        }
      });

      // GET /admin/organization - Get organization details
      app.get('/admin/organization', async (req, reply) => {
        try {
          const supabase = getSupabaseClient();
          const orgId = (req as any).user.org_id;
          const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', orgId)
            .single();

          if (error) {
            app.log.error(error);
            reply.code(500).send({
              ok: false,
              error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' }
            });
            return;
          }

          reply.send({
            ok: true,
            data
          });
        } catch (error) {
          app.log.error(error);
          reply.code(500).send({
            ok: false,
            error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' }
          });
        }
      });

      // PUT /admin/organization - Update organization
      app.put<{
        Body: OrgUpdate;
      }>('/admin/organization', async (req, reply) => {
        try {
          const updates = OrganizationUpdateSchema.parse(req.body);
          const supabase = getSupabaseClient();
          const orgId = (req as any).user.org_id;

          const patch: Record<string, any> = { updated_at: new Date().toISOString() };
          if (updates.name) patch.name = updates.name;
          if (updates.settings) patch.settings = updates.settings;

          const { data, error } = await supabase
            .from('organizations')
            .update(patch)
            .eq('id', orgId)
            .select('*')
            .single();

          if (error) {
            app.log.error(error);
            reply.code(500).send({
              ok: false,
              error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' }
            });
            return;
          }

          // Log admin action
          app.log.info({
            user: req.user.sub,
            action: 'org_update',
            changes: updates,
            timestamp: patch.updated_at
          });

          reply.send({
            ok: true,
            data
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            reply.code(400).send({
              ok: false,
              error: {
                code: 'validation_error',
                message: 'Invalid organization data',
                details: error.errors
              }
            });
          } else {
            app.log.error(error);
            reply.code(500).send({
              ok: false,
              error: { code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' }
            });
          }
        }
      });
    },
  });
}
