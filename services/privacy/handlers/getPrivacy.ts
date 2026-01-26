import { IncomingMessage, ServerResponse } from "http";
import { getPrefs, initPrefs } from "../lib/db";
import { hash as hashUser } from '../../journal/lib/hash';
export async function getPrivacy(_req: IncomingMessage, res: ServerResponse, user: any) {
  const userHash = hashUser(user.sub);
  let row = getPrefs(userHash);
  if (!row) {
    row = initPrefs(userHash);
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    const { user_id_hash, updated_at, ...prefs } = row;
    res.end(JSON.stringify(prefs));
    return;
  }
  const { user_id_hash, ...rest } = row;
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify(rest));
}
