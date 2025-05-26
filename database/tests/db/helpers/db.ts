export interface JournalVoiceRow {
  user_id_hash: string;
  valence: number;
  text_raw: string;
  ts?: Date;
}

export interface JournalTextRow {
  user_id_hash: string;
  valence: number;
  text_raw: string;
  gratitude_hits: number;
  wpm?: number | null;
  ts?: Date;
}

function startOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day; // week starts on Sunday
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
  start.setUTCHours(0, 0, 0, 0);
  return start.toISOString();
}

class MockDb {
  tables = {
    journal_voice: [] as JournalVoiceRow[],
    journal_text: [] as JournalTextRow[],
    metrics_weekly_journal: [] as any[],
  };

  async clearTables(names: string[]) {
    for (const n of names) {
      // @ts-ignore
      this.tables[n] = [];
    }
  }

  insert(table: 'journal_voice' | 'journal_text') {
    return {
      values: async (row: any) => {
        const r = { ts: new Date(), ...row };
        // @ts-ignore
        this.tables[table].push(r);
      },
    };
  }

  async execute(sql: string) {
    if (sql.includes('REFRESH MATERIALIZED VIEW')) {
      this.refreshMetricsWeeklyJournal();
    }
  }

  refreshMetricsWeeklyJournal() {
    const grouped: Record<string, any> = {};
    const all = [
      ...this.tables.journal_voice.map((r) => ({
        user_id_hash: r.user_id_hash,
        ts: r.ts!,
        valence: r.valence,
        gratitude_hits: 0,
        wpm: 0,
        panas_pa: 0,
        panas_na: 0,
      })),
      ...this.tables.journal_text.map((r) => ({
        user_id_hash: r.user_id_hash,
        ts: r.ts!,
        valence: r.valence,
        gratitude_hits: r.gratitude_hits,
        wpm: r.wpm ?? 0,
        panas_pa: 0,
        panas_na: 0,
      })),
    ];

    for (const row of all) {
      const week = startOfWeek(row.ts);
      const key = row.user_id_hash + '|' + week;
      if (!grouped[key]) {
        grouped[key] = {
          user_id_hash: row.user_id_hash,
          week_start: week,
          valences: [] as number[],
          gratitude: [] as number[],
          wpms: [] as number[],
        };
      }
      grouped[key].valences.push(row.valence);
      grouped[key].gratitude.push(row.gratitude_hits > 0 ? 1 : 0);
      grouped[key].wpms.push(row.wpm);
    }

    this.tables.metrics_weekly_journal = Object.values(grouped).map((g) => {
      const valence_avg = g.valences.reduce((a: number, b: number) => a + b, 0) / g.valences.length;
      const mean = valence_avg;
      const variance =
        g.valences.reduce((sum: number, v: number) => sum + Math.pow(v - mean, 2), 0) /
        (g.valences.length - 1 || 1);
      const sd = Math.sqrt(variance);
      const grat_avg = g.gratitude.reduce((a: number, b: number) => a + b, 0) / g.gratitude.length;
      const sortedWpms = g.wpms.slice().sort((a: number, b: number) => a - b);
      const mid = Math.floor(sortedWpms.length / 2);
      const median =
        sortedWpms.length % 2 !== 0
          ? sortedWpms[mid]
          : (sortedWpms[mid - 1] + sortedWpms[mid]) / 2;
      return {
        user_id_hash: g.user_id_hash,
        week_start: g.week_start,
        valence_avg: mean,
        valence_sd: sd,
        gratitude_ratio: grat_avg,
        wpm_median: median,
        panas_pa_avg: 0,
        panas_na_avg: 0,
      };
    });
  }

  selectFrom(table: 'metrics_weekly_journal') {
    let rows = this.tables.metrics_weekly_journal as any[];
    const query: any = {
      where: (col: string, _op: string, val: any) => {
        rows = rows.filter((r) => r[col] === val);
        return query;
      },
      select: (cols: string[]) => {
        return {
          executeTakeFirstOrThrow: async () => {
            const row = rows[0];
            if (!row) throw new Error('row not found');
            const res: any = {};
            for (const c of cols) res[c] = row[c];
            return res;
          },
        };
      },
    };
    return query;
  }
}

const db = new MockDb();
export default db;
