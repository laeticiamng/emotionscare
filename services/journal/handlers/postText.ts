import { IncomingMessage, ServerResponse } from 'http';
import { TextSchema } from '../lib/validate';
import { hash } from '../lib/hash';
import { insertText } from '../lib/db';

export async function postText(req: IncomingMessage, res: ServerResponse, user: any) {
  try {
    let body = '';
    for await (const chunk of req) body += chunk;
    const data = TextSchema.parse(JSON.parse(body));
    const userHash = hash(user.sub);
    const row = await insertText({ ...data, user_hash: userHash });
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: row.id, ts: row.ts }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      error: 'Failed to insert text entry', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }));
  }
}
