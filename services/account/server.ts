import { createServer, IncomingMessage, ServerResponse } from 'http';
import { hash } from '../journal/lib/hash';
import {
  createExportJob,
  findRecentJob,
  getJob,
  createDeleteRequest,
  getDeleteRequest
} from './lib/db';

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

    if (req.method === 'POST' && req.url === '/user/export') {
      const userHash = hash(user.sub);
      const existing = findRecentJob(userHash);
      if (existing) {
        res.statusCode = 202;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ jobId: existing.id }));
        return;
      }
      const job = createExportJob(userHash);
      res.statusCode = 202;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ jobId: job.id }));
      return;
    }

    const matchExport = req.url?.match(/^\/user\/export\/([^/]+)$/);
    if (req.method === 'GET' && matchExport) {
      const id = matchExport[1];
      const job = getJob(id);
      if (!job) {
        res.statusCode = 404;
        res.end('not found');
        return;
      }
      const userHash = hash(user.sub);
      if (job.user_id_hash !== userHash) {
        res.statusCode = 403;
        res.end('forbidden');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(job));
      return;
    }

    if (req.method === 'POST' && req.url === '/user/delete') {
      const userHash = hash(user.sub);
      createDeleteRequest(userHash);
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/user/delete/status') {
      const userHash = hash(user.sub);
      const dr = getDeleteRequest(userHash);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(dr || null));
      return;
    }

    res.statusCode = 404;
    res.end('Not Found');
  });
}
