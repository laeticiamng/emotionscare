import express, { Request, Response, NextFunction } from 'express';
import { getWeeklyUser } from './handlers/getWeeklyUser';
import { getWeeklyOrg } from './handlers/getWeeklyOrg';
import { hash } from '../journal/lib/hash';

export interface RequestWithUser extends Request {
  user: { hash: string; role: 'admin' | 'user'; org?: string };
}

function auth(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    req.user = {
      hash: hash(token),
      role: token.startsWith('admin:') ? 'admin' : 'user',
      org: token.split(':')[1],
    };
    return next();
  }
  res.status(401).send('Unauthorized');
}

export function createApp() {
  const app = express();
  app.get('/me/breath/weekly', auth, getWeeklyUser);
  app.get('/org/:orgId/breath/weekly', auth, getWeeklyOrg);
  return app;
}
