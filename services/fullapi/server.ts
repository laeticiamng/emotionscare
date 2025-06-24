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
  const journalEntries: any[] = [];
  const scanHistory: any[] = [];

  function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
    }
    const token = authHeader.slice(7);
    try {
      const payload = verify(token) as any;
      (req as any).user = payload;
      next();
    } catch {
      return res.status(401).json({ success: false, data: null, message: 'Invalid token' });
    }
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
    users.set(email, { email });
    const token = sign(email);
    res.status(201).json({ success: true, data: { token } });
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
  app.get('/api/v1/b2b/admin/dashboard/overview', auth, (_req, res) => {
    res.json({ success: true, data: { users: users.size } });
  });

  app.get('/api/v1/b2b/admin/users', auth, (_req, res) => {
    res.json({ success: true, data: Array.from(users.values()) });
  });

  app.get('/api/v1/b2b/admin/team-emotions', auth, (_req, res) => {
    res.json({ success: true, data: { teams: [{ name: 'team1', valence: 0.3 }] } });
  });

  app.get('/api/v1/b2b/admin/reports', auth, (_req, res) => {
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

  return app;
}
