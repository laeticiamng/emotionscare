import { FastifyReply, FastifyRequest } from 'fastify';
import { listWeekly } from '../lib/db';
import { hash } from '../../journal/lib/hash';

function parseSince(url: string | undefined): Date {
  const sinceParam = new URL('http://localhost' + (url || '')).searchParams.get('since');
  if (sinceParam) return new Date(sinceParam);
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 56);
  return d;
}

export async function getWeeklyUser(req: FastifyRequest, reply: FastifyReply) {
  const since = parseSince(req.url);
  const userHash = hash((req as any).user.sub);
  const rows = listWeekly(userHash, since).map(r => ({
    week_start: r.week_start,
    glowScore: r.hrv_stress_idx,
    coherence: r.coherence_avg,
    moveMinutes: r.mvpa_week,
    calmIndex: r.relax_idx,
    mindfulScore: r.mindfulness_avg,
    moodScore: r.mood_score
  }));
  reply.code(200).send(rows);
}
