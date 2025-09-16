import { createServer } from '../lib/server';
import { hash } from '../journal/lib/hash';
import { getPrefs, initPrefs, updatePrefs, logChange } from './lib/db';
import { z } from 'zod';

const PrivacyUpdateSchema = z.object({
  data_retention: z.enum(['30d', '90d', '1y', '3y']).optional(),
  analytics_opt_out: z.boolean().optional(),
  marketing_emails: z.boolean().optional(),
  data_sharing: z.enum(['none', 'anonymous', 'aggregated']).optional()
});

type PrivacyUpdate = z.infer<typeof PrivacyUpdateSchema>;

export function createApp() {
  return createServer({
    registerRoutes(app) {
      // GET /user/privacy - Get user privacy preferences
      app.get('/user/privacy', async (req, reply) => {
        const userHash = hash(req.user.sub);
        
        try {
          let prefs = getPrefs(userHash);
          if (!prefs) {
            prefs = initPrefs(userHash);
          }

          reply.send({ 
            ok: true, 
            data: {
              preferences: prefs,
              last_updated: new Date().toISOString(),
              gdpr_compliant: true
            }
          });
        } catch (error) {
          app.log.error(error);
          reply.code(500).send({ ok: false, error: 'Failed to fetch privacy preferences' });
        }
      });

      // PUT /user/privacy - Update user privacy preferences
      app.put<{
        Body: PrivacyUpdate;
      }>('/user/privacy', async (req, reply) => {
        const userHash = hash(req.user.sub);
        
        try {
          const updates = PrivacyUpdateSchema.parse(req.body);
          
          // Update preferences
          updatePrefs(userHash, updates);
          
          // Log privacy change for audit
          logChange(userHash, updates);
          
          app.log.info({
            user_hash: userHash,
            action: 'privacy_update',
            changes: updates,
            timestamp: new Date().toISOString()
          });

          const updatedPrefs = getPrefs(userHash);
          reply.send({ 
            ok: true, 
            data: {
              preferences: updatedPrefs,
              updated_at: new Date().toISOString(),
              changes_applied: Object.keys(updates)
            }
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            reply.code(400).send({
              ok: false,
              error: {
                code: 'validation_error',
                message: 'Invalid privacy preferences',
                details: error.errors
              }
            });
          } else {
            app.log.error(error);
            reply.code(500).send({ ok: false, error: 'Failed to update privacy preferences' });
          }
        }
      });
    },
  });
}
