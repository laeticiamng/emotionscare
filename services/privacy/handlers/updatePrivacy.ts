import { IncomingMessage, ServerResponse } from 'http';
import { updatePrefs, logChange } from '../lib/db';
import { hash as hashUser } from '../../journal/lib/hash';

export async function updatePrivacy(req: IncomingMessage, res: ServerResponse, user: any) {
  const userHash = hashUser(user.sub);
  let body = '';
  for await (const chunk of req) body += chunk;
  const data = JSON.parse(body || '{}');
  const allowed = ['cam','mic','hr','gps','social','nft'];
  const patch: any = {};
  for (const key of allowed) if (key in data) patch[key] = data[key];

  if (Object.keys(patch).length === 0) {
    res.statusCode = 400;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ error: 'Empty payload' }));
    return;
  }

  updatePrefs(userHash, patch);
  logChange(userHash, patch);
  res.statusCode = 204;
  res.end();
}
