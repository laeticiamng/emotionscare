import { IncomingMessage, ServerResponse } from 'http';
import { hash } from '../../journal/lib/hash';
import { listWeekly } from '../lib/db';

function parseSince(url: string | undefined): Date {
  const sinceParam = new URL('http://localhost' + (url || '')).searchParams.get('since');
  if (sinceParam) return new Date(sinceParam);
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 56); // 8 weeks
  return d;
}

export async function getWeeklyUser(req: IncomingMessage, res: ServerResponse, user: any) {
  const since = parseSince(req.url);
  const userHash = hash(user.sub);
  const rows = listWeekly(userHash, since);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(rows));
}
