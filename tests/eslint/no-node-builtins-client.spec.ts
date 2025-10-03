/* @vitest-environment node */

import { describe, expect, it, vi } from 'vitest';
import rule from '../../tools/eslint-plugin-ec/lib/rules/no-node-builtins-client.js';

describe('ec/no-node-builtins-client', () => {
  it('flags node builtins imports in client files', () => {
    const reports: unknown[] = [];
    const context = {
      getFilename: () => 'src/app/page.tsx',
      report: (descriptor: unknown) => {
        reports.push(descriptor);
      },
    } as any;

    const listeners = rule.create(context);
    listeners.ImportDeclaration?.({
      source: { value: 'node:crypto' },
    } as any);

    expect(reports).toHaveLength(1);
  });

  it('ignores server-side files', () => {
    const report = vi.fn();
    const context = {
      getFilename: () => 'supabase/functions/example.ts',
      report,
    } as any;

    const listeners = rule.create(context);
    listeners.ImportDeclaration?.({
      source: { value: 'node:crypto' },
    } as any);

    expect(report).not.toHaveBeenCalled();
  });

  it('detects require usage', () => {
    const reports: unknown[] = [];
    const context = {
      getFilename: () => 'src/components/button.tsx',
      report: (descriptor: unknown) => reports.push(descriptor),
    } as any;

    const listeners = rule.create(context);
    listeners.CallExpression?.({
      callee: { type: 'Identifier', name: 'require' },
      arguments: [{ type: 'Literal', value: 'node:stream' }],
    } as any);

    expect(reports).toHaveLength(1);
  });
});
