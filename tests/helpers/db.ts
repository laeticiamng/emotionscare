import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = new Kysely({ dialect: new PostgresDialect({ pool }) });

export async function resetTables() {
  await pool.query(`TRUNCATE TABLE
    bubble_sessions,
    micro_breaks,
    silk_wallpaper,
    biotune_sessions,
    neon_walk_sessions,
    echo_crystal,
    flow_walk,
    scan_face,
    scan_voice,
    vr_nebula_sessions,
    metrics_weekly_music,
    metrics_weekly_music_org,
    metrics_weekly_gam,
    metrics_weekly_breath,
    metrics_weekly_scan,
    metrics_weekly_vr
    CASCADE`);
}
