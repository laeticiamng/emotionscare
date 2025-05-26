import { serve } from 'std/server';
import db from '../_shared/db.ts';
import { assertJwt } from '../_shared/auth.ts';

serve(async req => {
  const { user_hash } = await assertJwt(req);
  const since = new URL(req.url).searchParams.get('since') ??
               "NOW() - INTERVAL '8 weeks'";

  const rows = await db
    .selectFrom('metrics_weekly_journal')
    .selectAll()
    .where('user_id_hash', '=', user_hash)
    .where('week_start', '>=', db.raw(since))
    .orderBy('week_start', 'desc')
    .execute();

  return Response.json(rows);
});
