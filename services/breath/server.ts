import { createServer, IncomingMessage, ServerResponse } from 'http';
import { getWeeklyUser } from './handlers/getWeeklyUser';
import { getWeeklyOrg } from './handlers/getWeeklyOrg';

function getUser(req: IncomingMessage) {
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.substring(7);
    return { sub: token, role: token.startsWith('admin:') ? 'admin' : 'user', org: token.split(':')[1] };
  }
  return null;
}

export function createApp() {
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const user = getUser(req);
    if (!user) {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/me/breath/weekly')) {
      await getWeeklyUser(req, res, user);
      return;
    }

    const match = req.url?.match(/^\/org\/([^/]+)\/breath\/weekly/);
    if (req.method === 'GET' && match) {
      const orgId = match[1];
      if (user.role !== 'admin' || user.org !== orgId) {
        res.statusCode = 403;
        res.end('forbidden');
        return;
      }
      await getWeeklyOrg(req, res, orgId);
      return;
    }

    res.statusCode = 404;
    res.end('Not Found');
  });
}
