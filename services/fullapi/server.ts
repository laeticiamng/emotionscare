import express from 'express';

const SECRET = 'demo-secret';

function sign(sub: string) {
  return Buffer.from(`${sub}:${SECRET}`).toString('base64');
}

function verify(token: string) {
  const txt = Buffer.from(token, 'base64').toString();
  const [sub, sec] = txt.split(':');
  if (sec !== SECRET) throw new Error('invalid');
  return { sub };
}

export function createApp() {
  const app = express();
  app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  app.use(express.json());
  const hits = new Map<string, number[]>();
  app.use((req, res, next) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const arr = hits.get(ip) || [];
    hits.set(ip, arr.filter(t => now - t < 60000).concat(now));
    if (hits.get(ip)!.length > 30) {
      return res.status(429).json({ success: false, data: null, message: 'Too many requests' });
    }
    next();
  });

  const users = new Map<string, any>();
  const preferences = new Map<string, any>();
  const journalEntries: any[] = [];
  const scanHistory: any[] = [];
  const feedbacks: any[] = [];

  function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }
    const token = authHeader.slice(7);
    try {
      const payload = verify(token) as any;
      const user = users.get(payload.sub) || { email: payload.sub, role: 'b2c' };
      (req as any).user = { sub: payload.sub, role: user.role };
      next();
    } catch {
      return res.status(401).json({ success: false, data: null, message: 'Invalid token' });
    }
  }

  function authorizeRole(roles: string[]) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user = (req as any).user;
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ success: false, data: null, message: 'Forbidden' });
      }
      next();
    };
  }

  // Auth
  app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, data: null, message: 'Invalid credentials' });
    users.set(email, { email });
    const token = sign(email);
    res.json({ success: true, data: { token } });
  });

  app.post('/api/v1/auth/register', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, data: null, message: 'Invalid data' });
    users.set(email, { email, role: 'b2c', profile: {} });
    const token = sign(email);
    res.status(201).json({ success: true, data: { token } });
  });

  app.get('/api/v1/auth/user/profile', auth, (req, res) => {
    const email = (req as any).user.sub;
    const u = users.get(email) || { profile: {} };
    res.json({ success: true, data: u.profile || {} });
  });

  app.put('/api/v1/auth/user/profile', auth, (req, res) => {
    const email = (req as any).user.sub;
    const u = users.get(email);
    if (!u) return res.status(404).json({ success: false, data: null, message: 'Not found' });
    u.profile = { ...(u.profile || {}), ...(req.body || {}) };
    users.set(email, u);
    res.json({ success: true, data: u.profile });
  });

  app.post('/api/v1/auth/b2b/user/register', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, data: null, message: 'Invalid data' });
    users.set(email, { email, role: 'b2b_user', profile: {} });
    const token = sign(email);
    res.status(201).json({ success: true, data: { token } });
  });

  app.post('/api/v1/auth/b2b/user/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, data: null, message: 'Invalid credentials' });
    const u = users.get(email);
    if (!u) users.set(email, { email, role: 'b2b_user', profile: {} });
    const token = sign(email);
    res.json({ success: true, data: { token } });
  });

  app.get('/api/v1/auth/b2b/user/profile', auth, authorizeRole(['b2b_user']), (req, res) => {
    const email = (req as any).user.sub;
    const u = users.get(email) || { profile: {} };
    res.json({ success: true, data: u.profile || {} });
  });

  app.put('/api/v1/auth/b2b/user/profile', auth, authorizeRole(['b2b_user']), (req, res) => {
    const email = (req as any).user.sub;
    const u = users.get(email);
    if (!u) return res.status(404).json({ success: false, data: null, message: 'Not found' });
    u.profile = { ...(u.profile || {}), ...(req.body || {}) };
    users.set(email, u);
    res.json({ success: true, data: u.profile });
  });

  app.post('/api/v1/auth/b2b/admin/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, data: null, message: 'Invalid credentials' });
    const u = users.get(email) || { email, role: 'b2b_admin', profile: {} };
    u.role = 'b2b_admin';
    users.set(email, u);
    const token = sign(email);
    res.json({ success: true, data: { token } });
  });

  app.get('/api/v1/auth/b2b/admin/profile', auth, authorizeRole(['b2b_admin']), (req, res) => {
    const email = (req as any).user.sub;
    const u = users.get(email) || { profile: {} };
    res.json({ success: true, data: u.profile || {} });
  });

  app.put('/api/v1/auth/b2b/admin/profile', auth, authorizeRole(['b2b_admin']), (req, res) => {
    const email = (req as any).user.sub;
    const u = users.get(email);
    if (!u) return res.status(404).json({ success: false, data: null, message: 'Not found' });
    u.profile = { ...(u.profile || {}), ...(req.body || {}) };
    users.set(email, u);
    res.json({ success: true, data: u.profile });
  });

  app.post('/api/v1/auth/logout', auth, (req, res) => {
    res.json({ success: true, data: null, message: 'Logged out' });
  });

  app.get('/api/v1/auth/me', auth, (req, res) => {
    res.json({ success: true, data: { email: (req as any).user.sub } });
  });

  app.post('/api/v1/auth/reset-password', (req, res) => {
    res.json({ success: true, data: null, message: 'Reset link sent' });
  });

  // B2C Dashboard
  app.get('/api/v1/b2c/dashboard/stats', auth, (req, res) => {
    res.json({ success: true, data: { scans: scanHistory.length, journalEntries: journalEntries.length } });
  });

  app.get('/api/v1/b2c/dashboard/recent-activities', auth, (req, res) => {
    const email = (req as any).user.sub;
    const activities = [
      ...scanHistory.filter(s => s.user === email),
      ...journalEntries.filter(j => j.user === email),
    ].sort((a, b) => b.ts.localeCompare(a.ts));
    res.json({ success: true, data: activities.slice(0, 5) });
  });

  app.get('/api/v1/b2c/dashboard/mood-trends', auth, (_req, res) => {
    res.json({ success: true, data: { weekly: [{ week: '2025-06-02', mood: 'happy', score: 0.7 }] } });
  });

  // B2B Admin Dashboard
  app.get('/api/v1/b2b/admin/dashboard/overview', auth, authorizeRole(['b2b_admin']), (_req, res) => {
    res.json({ success: true, data: { users: users.size } });
  });

  app.get('/api/v1/b2b/admin/users', auth, authorizeRole(['b2b_admin']), (_req, res) => {
    res.json({ success: true, data: Array.from(users.values()) });
  });

  app.get('/api/v1/b2b/admin/team-emotions', auth, authorizeRole(['b2b_admin']), (_req, res) => {
    res.json({ success: true, data: { teams: [{ name: 'team1', valence: 0.3 }] } });
  });

  app.get('/api/v1/b2b/admin/reports', auth, authorizeRole(['b2b_admin']), (_req, res) => {
    res.json({ success: true, data: { reports: [{ id: 'r1', title: 'Monthly Report' }] } });
  });

  // Emotion Modules
  app.post('/api/v1/scan/emotion', auth, (req, res) => {
    const result = { valence: Math.random() * 2 - 1, text: req.body?.text || '' };
    scanHistory.push({ user: (req as any).user.sub, result, ts: new Date().toISOString() });
    res.status(201).json({ success: true, data: result });
  });

  app.get('/api/v1/scan/history', auth, (req, res) => {
    const email = (req as any).user.sub;
    res.json({ success: true, data: scanHistory.filter(s => s.user === email) });
  });

  app.post('/api/v1/journal/entry', auth, (req, res) => {
    const entry = { id: String(journalEntries.length + 1), user: (req as any).user.sub, content: req.body?.content || '', ts: new Date().toISOString() };
    journalEntries.push(entry);
    res.status(201).json({ success: true, data: entry });
  });

  app.post('/api/v1/journal/entries', auth, (req, res) => {
    const entry = { id: String(journalEntries.length + 1), user: (req as any).user.sub, content: req.body?.content || '', ts: new Date().toISOString() };
    journalEntries.push(entry);
    res.status(201).json({ success: true, data: entry });
  });

  app.get('/api/v1/journal/entries', auth, (req, res) => {
    const email = (req as any).user.sub;
    res.json({ success: true, data: journalEntries.filter(j => j.user === email) });
  });

  app.get('/api/v1/music/recommendations', auth, (_req, res) => {
    res.json({ success: true, data: { tracks: ['Peaceful Mind', 'Calm Waves'] } });
  });

  app.get('/api/v1/vr/sessions', auth, (_req, res) => {
    res.json({ success: true, data: [{ id: 's1', scene: 'Calm beach' }] });
  });

  app.get('/api/v1/user/activity-summary', auth, (req, res) => {
    const email = (req as any).user.sub;
    const scans = scanHistory.filter(s => s.user === email).length;
    const entries = journalEntries.filter(j => j.user === email).length;
    res.json({ success: true, data: { scans, journalEntries: entries } });
  });

  app.get('/api/v1/user/dashboard-stats', auth, (req, res) => {
    const email = (req as any).user.sub;
    const moodTrend = Math.random() > 0.5 ? 'up' : 'down';
    const unlocked = 3;
    const totalPoints = 120;
    const stats = {
      emotional_score: {
        current: 7.2,
        trend: moodTrend,
        change_percent: 5.4,
      },
      journal_entries: {
        this_week: journalEntries.filter(j => j.user === email).length,
        total: journalEntries.filter(j => j.user === email).length,
        streak_days: 1,
      },
      achievements: {
        unlocked_count: unlocked,
        total_points: totalPoints,
        recent: [],
      },
      social: {
        cocon_members: 0,
        shared_moments: 0,
      },
      quick_actions: [],
    };
    res.json({ success: true, data: stats });
  });

  app.post('/api/v1/user/feedback', auth, (req, res) => {
    const email = (req as any).user.sub;
    const fb = { id: String(feedbacks.length + 1), user: email, message: req.body?.message || '' };
    feedbacks.push(fb);
    res.status(201).json({ success: true, data: fb });
  });

  app.get('/api/v1/user/preferences', auth, (req, res) => {
    const email = (req as any).user.sub;
    res.json({ success: true, data: preferences.get(email) || {} });
  });

  app.put('/api/v1/user/preferences', auth, (req, res) => {
    const email = (req as any).user.sub;
    const current = preferences.get(email) || {};
    preferences.set(email, { ...current, ...(req.body || {}) });
    res.json({ success: true, data: preferences.get(email) });
  });

  app.delete('/api/v1/user/preferences', auth, (req, res) => {
    const email = (req as any).user.sub;
    preferences.delete(email);
    res.status(204).send();
  });

  return app;
}
