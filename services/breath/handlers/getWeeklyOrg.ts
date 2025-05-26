import { Response } from 'express';
import { listWeeklyOrg } from '../lib/db';
import { RequestWithUser } from '../server';

function parseSince(url: string | undefined): Date {
  const sinceParam = new URL('http://localhost' + (url || '')).searchParams.get('since');
  if (sinceParam) return new Date(sinceParam);
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 56);
  return d;
}

export async function getWeeklyOrg(req: RequestWithUser, res: Response) {
  const since = parseSince(req.url);
  const orgId = req.params.orgId;
  if (req.user.role !== 'admin' || req.user.org !== orgId) {
    return res.status(403).send('forbidden');
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
  res.status(200).json(rows);
}
