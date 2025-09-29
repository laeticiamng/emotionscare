#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  await client.connect();
  const dir = path.join(__dirname, '..', 'database', 'sql');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    await client.query(sql);
  }
  await client.end();
  console.log('Migrations applied');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
