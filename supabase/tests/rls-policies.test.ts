/* @vitest-environment node */

import { afterAll, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const connectionString = process.env.DATABASE_URL;
const shouldRunLiveChecks = Boolean(connectionString);

const pool = shouldRunLiveChecks ? new Pool({ connectionString }) : null;

if (pool) {
  afterAll(async () => {
    await pool.end();
  });
}

type PolicyRow = {
  policyname: string;
  cmd: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  qual: string | null;
  with_check: string | null;
};

interface TablePolicyExpectation {
  table: string;
  operations: Array<'SELECT' | 'INSERT' | 'UPDATE'>;
}

const TABLE_EXPECTATIONS: TablePolicyExpectation[] = [
  { table: 'assessments', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'journal_entries', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'mood_presets', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'emotion_metrics', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'consents', operations: ['SELECT', 'INSERT', 'UPDATE'] },
];

const clauseContainsAuthUid = (clause: string | null): boolean =>
  typeof clause === 'string' && clause.toLowerCase().includes('auth.uid()');

const policiesForOperation = (rows: PolicyRow[], operation: 'SELECT' | 'INSERT' | 'UPDATE'): PolicyRow[] =>
  rows.filter((row) => row.cmd === operation || row.cmd === 'ALL');

const describeLive = shouldRunLiveChecks ? describe : describe.skip;

describeLive('RLS policies enforce auth.uid()', () => {
  TABLE_EXPECTATIONS.forEach(({ table, operations }) => {
    it(`${table} policies require auth.uid() for ${operations.join(', ')}`, async () => {
      const { rows } = await pool!.query<PolicyRow>(
        `
          SELECT policyname, cmd, qual, with_check
          FROM pg_policies
          WHERE schemaname = 'public' AND tablename = $1
        `,
        [table],
      );

      expect(rows.length, `No policies found for ${table}`).toBeGreaterThan(0);

      operations.forEach((operation) => {
        const applicable = policiesForOperation(rows, operation);
        expect(applicable.length, `No ${operation} policy for ${table}`).toBeGreaterThan(0);

        const hasAuthConstraint = applicable.some((policy) => {
          if (operation === 'INSERT') {
            return clauseContainsAuthUid(policy.with_check ?? policy.qual);
          }

          if (operation === 'UPDATE') {
            return clauseContainsAuthUid(policy.qual) || clauseContainsAuthUid(policy.with_check);
          }

          // SELECT
          return clauseContainsAuthUid(policy.qual);
        });

        expect(
          hasAuthConstraint,
          `auth.uid() missing from ${operation} policy clauses on ${table}`,
        ).toBe(true);
      });
    });
  });
});

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const migrationFiles = readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .map((file) => readFileSync(path.join(migrationsDir, file), 'utf8').toLowerCase());

describe('RLS policy definitions (static analysis)', () => {
  TABLE_EXPECTATIONS.forEach(({ table }) => {
    it(`declares auth.uid() guard clauses for ${table}`, () => {
      const needle = `on public.${table}`;
      const hasAuthInSql = migrationFiles.some((content) =>
        content.includes(needle) && content.includes('auth.uid()'),
      );

      expect(hasAuthInSql).toBe(true);
    });
  });
});

describe('consents migration constraints', () => {
  it('creates a partial unique index enforcing one active consent per user', () => {
    const matched = migrationFiles.some((content) =>
      content.includes('create unique index if not exists consents_one_active_per_user'),
    );

    expect(matched).toBe(true);
  });
});

