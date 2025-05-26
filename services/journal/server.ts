import { createServer, IncomingMessage, ServerResponse } from 'http';
import { postVoice } from './handlers/postVoice';
import { postText } from './handlers/postText';
import { getFeed } from './handlers/getFeed';

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

    if (req.method === 'POST' && req.url?.startsWith('/journal_voice')) {
      await postVoice(req, res, user);
      return;
    }

    if (req.method === 'POST' && req.url?.startsWith('/journal_text')) {
      await postText(req, res, user);
      return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/me/journal')) {
      await getFeed(req, res, user);
      return;
    }

    res.statusCode = 404;
    res.end('Not Found');
  });
}
