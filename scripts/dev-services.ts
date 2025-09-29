import { spawn } from 'child_process';

const services = [
  'account',
  'journal',
  'breath',
  'gam',
  'scan',
  'vr',
  'admin',
  'privacy'
] as const;

const ports: Record<(typeof services)[number], number> = {
  account: 3009,
  journal: 3001,
  breath: 3003,
  gam: 3005,
  scan: 3002,
  vr: 3004,
  admin: 3010,
  privacy: 3011
};

const children: ReturnType<typeof spawn>[] = [];

function start(service: (typeof services)[number]) {
  const port = ports[service];
  const child = spawn('node', ['--loader', 'ts-node/esm', `services/${service}/index.ts`], {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) }
  });
  children.push(child);
  console.log(`Started ${service} on ${port}`);
}

for (const s of services) start(s);

process.on('SIGINT', () => {
  for (const c of children) c.kill('SIGINT');
  process.exit();
});
