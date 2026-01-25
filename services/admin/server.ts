import { createServer } from '../lib/server';
import { z } from 'zod';

const OrganizationUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  settings: z.object({
    analytics_enabled: z.boolean().optional(),
    retention_days: z.number().min(30).max(2555).optional(),
    max_users: z.number().min(1).max(10000).optional()
  }).optional()
});

type OrgUpdate = z.infer<typeof OrganizationUpdateSchema>;

// Mock organization data (in real app, this would be from database)
let orgData = {
  id: 'org1',
  name: 'Demo Org',
  settings: {
    analytics_enabled: true,
    retention_days: 365,
    max_users: 100
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: new Date().toISOString()
};

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
      app.get('/admin/organization', async (_req, reply) => {
        reply.send({ 
          ok: true, 
          data: orgData
        });
      });

      // PUT /admin/organization - Update organization
      app.put<{
        Body: OrgUpdate;
      }>('/admin/organization', async (req, reply) => {
        try {
          const updates = OrganizationUpdateSchema.parse(req.body);
          
          // Apply updates
          if (updates.name) {
            orgData.name = updates.name;
          }
          
          if (updates.settings) {
            orgData.settings = { ...orgData.settings, ...updates.settings };
          }
          
          orgData.updated_at = new Date().toISOString();
          
          // Log admin action
          app.log.info({
            user: req.user.sub,
            action: 'org_update',
            changes: updates,
            timestamp: orgData.updated_at
          });

          reply.send({ 
            ok: true, 
            data: orgData
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
            reply.code(500).send({ ok: false, error: 'Failed to update organization' });
          }
        }
      });
    },
  });
}
