import { IncomingMessage, ServerResponse } from 'http';

let org = {
  id: 'org1',
  name: 'Demo Org',
  subscription_plan: 'basic',
  max_users: 50,
  updated_at: new Date().toISOString()
};

export async function getOrganization(_req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(org));
}

export async function updateOrganization(req: IncomingMessage, res: ServerResponse) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const data = JSON.parse(body || '{}');
  org = { ...org, ...data, updated_at: new Date().toISOString() };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(org));
}
