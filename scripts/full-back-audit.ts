#!/usr/bin/env ts-node
// Node 18+ provides fetch globally
import { performance } from 'perf_hooks';
import { promises as fs, existsSync } from 'fs';

interface EndpointResult {
  name: string;
  url: string;
  status?: number;
  ok?: boolean;
  timeMs: number;
  error?: string;
}

async function checkEndpoint(name: string, url: string, options?: RequestInit): Promise<EndpointResult> {
  const start = performance.now();
  try {
    const res = await fetch(url, options);
    const timeMs = performance.now() - start;
    return { name, url, status: res.status, ok: res.ok, timeMs };
  } catch (e: any) {
    const timeMs = performance.now() - start;
    return { name, url, timeMs, error: e.message };
  }
}

async function gatherLogs(): Promise<string> {
  const possible = ['logs/server.log', 'logs/backend.log', 'logs/error.log'];
  const now = Date.now();
  let collected = '';
  for (const file of possible) {
    if (existsSync(file)) {
      const content = await fs.readFile(file, 'utf8');
      const lines = content.split('\n').filter(line => {
        const m = line.match(/(\d{4}-\d{2}-\d{2}[^ ]*)/);
        if (!m) return false;
        const date = new Date(m[1]).getTime();
        return now - date <= 24 * 3600 * 1000 && /(4\d\d|5\d\d)/.test(line);
      });
      if (lines.length) {
        collected += `\n## ${file}\n` + lines.join('\n') + '\n';
      }
    }
  }
  return collected || 'No logs found or no errors in last 24h.';
}

async function gatherMigrations(): Promise<string> {
  const migDir = 'supabase/migrations';
  if (!existsSync(migDir)) return 'No migrations directory found.';
  const items = await fs.readdir(migDir, { withFileTypes: true });
  if (!items.length) return 'No migrations found.';
  const applied = items.filter(i => i.isDirectory()).map(i => i.name).join('\n');
  return `Applied migrations:\n${applied}`;
}

async function main() {
  const baseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:3000';
  const endpoints = [
    { name: 'health', url: `${baseUrl}/health` },
    { name: 'version', url: `${baseUrl}/version` },
    { name: 'metrics', url: `${baseUrl}/metrics` },
    { name: 'signup', url: `${baseUrl}/auth/signup`, options: { method: 'POST' } },
    { name: 'login', url: `${baseUrl}/auth/login`, options: { method: 'POST' } },
    { name: 'refresh', url: `${baseUrl}/auth/refresh-token`, options: { method: 'POST' } },
    { name: 'protected', url: `${baseUrl}/auth/protected` },
    { name: 'users', url: `${baseUrl}/api/users` },
    { name: 'sessions', url: `${baseUrl}/api/sessions` },
    { name: 'analytics', url: `${baseUrl}/api/analytics` },
    { name: 'music', url: `${baseUrl}/api/music-recommendations` },
    { name: 'secureFetch', url: `${baseUrl}/api/secureFetch` },
  ];

  const results: EndpointResult[] = [];
  for (const ep of endpoints) {
    results.push(await checkEndpoint(ep.name, ep.url, ep.options));
  }

  await fs.mkdir('reports/back-audit', { recursive: true });
  await fs.writeFile('reports/back-audit/ENDPOINT_REPORT.json', JSON.stringify(results, null, 2));

  const statusLines = results.map(r => `${r.name}: ${r.ok ? '✓ OK' : '❌ ko'} (${r.status ?? r.error})`).join('\n');
  await fs.writeFile('reports/back-audit/BACK_STATUS.md', `# Backend Status\n\n${statusLines}\n`);

  const logs = await gatherLogs();
  await fs.writeFile('reports/back-audit/ERROR_LOGS_last24h.txt', logs + '\n');

  const migrations = await gatherMigrations();
  await fs.writeFile('reports/back-audit/DB_MIGRATIONS_STATUS.md', migrations + '\n');

  const suggestions = results.filter(r => !r.ok).map(r => `- [${r.name}] ${r.status ?? r.error}`).join('\n');
  const suggestionContent = suggestions ? `## Correctifs suggérés\n${suggestions}\n` : 'No issues detected.';
  await fs.writeFile('reports/back-audit/SUGGESTED_FIXES.md', suggestionContent);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
