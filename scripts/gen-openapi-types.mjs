import { execFile } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const specs = [
  { name: 'Assess', file: '../openapi/assess.yaml' },
  { name: 'B2B', file: '../openapi/b2b.yaml' }
];

function runCli(path) {
  return new Promise((resolveOutput, reject) => {
    execFile(
      'node',
      [resolve(__dirname, '../node_modules/openapi-typescript/bin/cli.js'), resolve(__dirname, path)],
      { encoding: 'utf8' },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }
        resolveOutput(stdout);
      }
    );
  });
}

const sections = [];
for (const spec of specs) {
  const schema = await runCli(spec.file);
  const renamed = schema
    .replace('export interface paths ', `interface ${spec.name}Paths `)
    .replace('export type webhooks =', `type ${spec.name}Webhooks =`)
    .replace('export interface components ', `interface ${spec.name}Components `)
    .replace('export type $defs =', `type ${spec.name}Defs =`)
    .replace('export type operations =', `type ${spec.name}Operations =`);
  sections.push(renamed.trim());
}

const header = `/**
 * Ce fichier est généré via scripts/gen-openapi-types.mjs
 * Ne pas modifier manuellement.
 */\n\n`;

const footer = `\nexport interface paths extends AssessPaths, B2BPaths {}\nexport type webhooks = AssessWebhooks & B2BWebhooks;\nexport interface components extends AssessComponents, B2BComponents {}\nexport type $defs = AssessDefs & B2BDefs;\nexport type operations = AssessOperations & B2BOperations;\n`;

const output = header + sections.join('\n\n') + footer;

await writeFile(resolve(__dirname, '../src/api/types.gen.ts'), output);
