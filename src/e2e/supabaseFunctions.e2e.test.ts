import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

interface FnCheck {
  file: string;
  roles: string[];
}

const functions: FnCheck[] = [
  { file: 'analyze-journal/index.ts', roles: ['b2c', 'b2b_user', 'b2b_admin', 'admin'] },
  { file: 'assistant-api/index.ts', roles: ['b2c', 'b2b_user', 'b2b_admin', 'admin'] },
  { file: 'process-emotion-gamification/index.ts', roles: ['b2c', 'b2b_user', 'b2b_admin', 'admin'] },
  { file: 'enhanced-emotion-analyze/index.ts', roles: ['b2c', 'b2b_user', 'b2b_admin', 'admin'] },
  { file: 'coach-ai/index.ts', roles: ['b2c', 'b2b_user', 'b2b_admin', 'admin'] },
  { file: 'monitor-api-usage/index.ts', roles: ['admin'] },
  { file: 'team-management/index.ts', roles: ['b2b_admin', 'admin'] },
  { file: 'micro-breaks/index.ts', roles: ['b2c', 'b2b_user'] },
  { file: 'bubble-sessions/index.ts', roles: ['b2c', 'b2b_user'] },
  { file: 'silk-wallpaper/index.ts', roles: ['b2c', 'b2b_user'] },
  { file: 'me-metrics/index.ts', roles: ['b2c', 'b2b_user'] },
  { file: 'rh-metrics/index.ts', roles: ['rh_manager'] },
];

for (const fn of functions) {
  test(`function ${fn.file} enforces roles`, () => {
    const filePath = path.join('supabase/functions', fn.file);
    const src = fs.readFileSync(filePath, 'utf8');
    expect(src).toMatch(/authorizeRole\(/);
    for (const role of fn.roles) {
      expect(src.includes(role)).toBe(true);
    }
  });
}
