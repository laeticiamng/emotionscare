import { getWeeklyUser } from './handlers/getWeeklyUser';
import { getWeeklyOrg } from './handlers/getWeeklyOrg';
import { createServer } from '../lib/server';

export function createApp() {
  return createServer({
    registerRoutes(app) {
      app.get('/api/v1/me/breath/weekly', getWeeklyUser);
      app.get('/api/v1/org/:orgId/breath/weekly', getWeeklyOrg);
    },
  });
}
