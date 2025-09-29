import { IncomingMessage, ServerResponse } from 'http';
import { listWeeklyOrg } from '../lib/db';

function parseSince(url: string | undefined): Date {
  const sinceParam = new URL('http://localhost' + (url || '')).searchParams.get('since');
  if (sinceParam) return new Date(sinceParam);
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 56);
  return d;
}

export async function getWeeklyOrg(req: IncomingMessage, res: ServerResponse, orgId: string) {
  const since = parseSince(req.url);
  const rows = listWeeklyOrg(orgId, since);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(rows));
}
