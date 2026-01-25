import { IncomingMessage, ServerResponse } from 'http';
import { hash } from '../lib/hash';
import { listFeed } from '../lib/db';

export async function getFeed(req: IncomingMessage, res: ServerResponse, user: any) {
  const url = new URL(req.url || '', 'http://localhost');
  const _range = url.searchParams.get('range') || '30d';
  const userHash = hash(user.sub);
  const entries = listFeed(userHash); // ignoring range for simplicity
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ entries, weekly: [] }));
}
