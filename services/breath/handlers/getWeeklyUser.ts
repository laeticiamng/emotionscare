import { Response } from 'express';
import { listWeekly } from '../lib/db';
import { RequestWithUser } from '../server';

function parseSince(url: string | undefined): Date {
  const sinceParam = new URL('http://localhost' + (url || '')).searchParams.get('since');
  if (sinceParam) return new Date(sinceParam);
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 56);
  return d;
}

export async function getWeeklyUser(req: RequestWithUser, res: Response) {
  const since = parseSince(req.url);
  const rows = listWeekly(req.user.hash, since).map(r => ({
    week_start: r.week_start,
    glowScore: r.hrv_stress_idx,
    coherence: r.coherence_avg,
    moveMinutes: r.mvpa_week,
    calmIndex: r.relax_idx,
    mindfulScore: r.mindfulness_avg,
    moodScore: r.mood_score
  }));
  res.status(200).json(rows);
}
