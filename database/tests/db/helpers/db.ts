import { Kysely, sql } from 'kysely';
import { PostgresDialect } from 'kysely';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  }),
});

const db = new Kysely({ dialect });

export async function clearTables(tables: string[]) {
  for (const t of tables) {
    await db.deleteFrom(t).execute();
  }
}

export default db;
