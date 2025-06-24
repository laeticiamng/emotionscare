import { createServer, IncomingMessage, ServerResponse } from 'http';
import { getOrganization, updateOrganization } from './handlers/organization';
import { parse } from 'url';

function getUser(req: IncomingMessage) {
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.substring(7);
    return { sub: token, role: token.startsWith('admin:') ? 'admin' : 'user' };
  }
  return null;
}

export function createApp() {
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const user = getUser(req);
    if (!user || user.role !== 'admin') {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    const { pathname } = parse(req.url || '');
    if (req.method === 'GET' && pathname === '/admin/organization') {
      await getOrganization(req, res);
      return;
    }
    if (req.method === 'PUT' && pathname === '/admin/organization') {
      await updateOrganization(req, res);
      return;
    }

    res.statusCode = 404;
    res.end('Not Found');
  });
}
