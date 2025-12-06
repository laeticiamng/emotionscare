import { createServer } from '../lib/server';
import { hash } from '../journal/lib/hash';
import { listWeekly, listWeeklyOrg } from './lib/db';

interface WeeklyUserQuery {
  since?: string;
}

interface WeeklyOrgQuery {
  since?: string;
}

function parseSince(sinceParam: string | undefined): Date {
  if (!sinceParam) return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 30d ago
  
  const sinceInt = parseInt(sinceParam, 10);
  if (!isNaN(sinceInt)) {
    return new Date(Date.now() - sinceInt * 24 * 60 * 60 * 1000);
  }
  
  const sinceDate = new Date(sinceParam);
  return isNaN(sinceDate.getTime()) 
    ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    : sinceDate;
}

export function createApp() {
  return createServer({
    registerRoutes(app) {
      // GET /me/scan/weekly - Scan weekly analytics for user
      app.get<{
        Querystring: WeeklyUserQuery;
      }>('/me/scan/weekly', async (req, reply) => {
        const userHash = hash(req.user.sub);
        const since = parseSince(req.query.since);
        
        try {
          const weeklyData = listWeekly(userHash, since);
          reply.send({ 
            ok: true, 
            data: weeklyData,
            meta: { user_hash: userHash, since: since.toISOString() }
          });
        } catch (error) {
          app.log.error(error);
          reply.code(500).send({ ok: false, error: 'Failed to fetch scan data' });
        }
      });

      // GET /org/:orgId/scan/weekly - Scan weekly analytics for organization
      app.get<{
        Params: { orgId: string };
        Querystring: WeeklyOrgQuery;
      }>('/org/:orgId/scan/weekly', async (req, reply) => {
        const { orgId } = req.params;
        const since = parseSince(req.query.since);
        
        try {
          const orgData = listWeeklyOrg(orgId, since);
          reply.send({ 
            ok: true, 
            data: orgData,
            meta: { org_id: orgId, since: since.toISOString() }
          });
        } catch (error) {
          app.log.error(error);
          reply.code(500).send({ ok: false, error: 'Failed to fetch org scan data' });
        }
      });
    },
  });
}
