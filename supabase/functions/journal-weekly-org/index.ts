import { serve } from 'std/server';
import db from '../_shared/db.ts';
import { assertJwt } from '../_shared/auth.ts';

serve(async req => {
  const urlParts = new URL(req.url).pathname.split('/');
  const orgParam = urlParts[2];
  const { role, org_id } = await assertJwt(req);

  if (role !== 'admin' || org_id !== orgParam) {
    return new Response('forbidden', { status: 403 });
  }

  const since = new URL(req.url).searchParams.get('since') ??
               "NOW() - INTERVAL '8 weeks'";

  const rows = await db
    .selectFrom('metrics_weekly_org')
    .selectAll()
    .where('org_id', '=', org_id)
    .where('week_start', '>=', db.raw(since))
    .orderBy('week_start', 'desc')
    .execute();

  return Response.json(rows);
});
