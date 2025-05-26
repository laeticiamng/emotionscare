import { createServer, IncomingMessage, ServerResponse } from 'http';
import { getPrivacy } from './handlers/getPrivacy';
import { updatePrivacy } from './handlers/updatePrivacy';

function getUser(req: IncomingMessage) {
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.substring(7);
    return { sub: token };
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

    if (req.method === 'GET' && req.url === '/user/privacy') {
      await getPrivacy(req, res, user);
      return;
    }

    if (req.method === 'PUT' && req.url === '/user/privacy') {
      await updatePrivacy(req, res, user);
      return;
    }

    res.statusCode = 404;
    res.end('Not Found');
  });
}
