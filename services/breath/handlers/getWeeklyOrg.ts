import { FastifyReply, FastifyRequest } from 'fastify';
import { listWeeklyOrg } from '../lib/db';

function parseSince(url: string | undefined): Date {
  const sinceParam = new URL('http://localhost' + (url || '')).searchParams.get('since');
  if (sinceParam) return new Date(sinceParam);
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 56);
  return d;
}

export async function getWeeklyOrg(req: FastifyRequest, reply: FastifyReply) {
  const since = parseSince(req.url);
  const orgId = (req.params as any).orgId;
  const user = (req as any).user;
  if (user.role !== 'b2b_admin' || user.aud !== orgId) {
    reply.code(403).send({ ok: false, error: { code: 'forbidden', message: 'Forbidden' } });
    return;
  }
  const rows = listWeeklyOrg(orgId, since).map(r => ({
    week_start: r.week_start,
    members: r.members,
    org_glow: r.org_hrv_idx,
    org_coherence: r.org_coherence,
    org_mvpa: r.org_mvpa,
    org_calm: r.org_relax,
    org_mindful: r.org_mindfulness,
    org_mood: r.org_mood
  }));
  reply.code(200).send(rows);
}
