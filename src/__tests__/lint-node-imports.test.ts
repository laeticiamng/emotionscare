import { ESLint } from 'eslint';
import { afterAll, describe, expect, it } from 'vitest';

const projectRoot = process.cwd();

const eslint = new ESLint({
  overrideConfigFile: `${projectRoot}/eslint.config.js`,
  cwd: projectRoot,
});

afterAll(async () => {
  if (typeof eslint.close === 'function') {
    await eslint.close();
  }
});

describe('client bundle import restrictions', () => {
  it('flags node: protocol imports within the src tree', async () => {
    const sample = "import fs from 'node:fs';\nexport const touch = () => fs.promises;\n";
    const [result] = await eslint.lintText(sample, {
      filePath: `${projectRoot}/src/components/fixtures/node-import.ts`,
      warnIgnored: false,
    });

    expect(result.errorCount).toBeGreaterThan(0);
    const messages = result.messages.map(message => message.message);
    expect(messages.some(message => message.includes('Interdit dans le bundle client'))).toBe(true);
  });
});
