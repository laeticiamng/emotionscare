// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';
import path from 'node:path';

const projectRoot = process.cwd();

describe('lint rules', () => {
  it('forbids node:* imports in client bundles', async () => {
    const eslint = new ESLint({
      overrideConfigFile: path.join(projectRoot, 'eslint.config.js'),
      cwd: projectRoot,
    });

    const [result] = await eslint.lintText("import fs from 'node:fs';\n", {
      filePath: path.join('src', 'components', 'Forbidden.tsx'),
    });

    const nodeImportError = result.messages.find((message) => message.ruleId === 'no-restricted-imports');

    expect(nodeImportError).toBeTruthy();
    expect(nodeImportError?.message).toContain('Interdit dans le bundle client');
  });
});
