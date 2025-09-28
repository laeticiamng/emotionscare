import { execSync } from 'node:child_process';
import { readdirSync } from 'fs';
import path from 'path';

// Drop & recreate test database
execSync('dropdb --if-exists emotions_test && createdb emotions_test');

// Apply all SQL migrations from supabase/migrations
const dir = path.join(__dirname, '..', 'supabase', 'migrations');
const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
for (const file of files) {
  execSync(`psql emotions_test < "${path.join(dir, file)}"`);
}
