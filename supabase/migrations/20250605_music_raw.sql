-- 1-A  BioTune ----------------------------------------------------
create table if not exists public.biotune_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id_hash  text      not null,
  ts_start      timestamptz not null default now(),
  duration_s    int       not null,
  bpm_target    int,
  hrv_pre       int,
  hrv_post      int,
  rmssd_delta   int,         -- trigger
  coherence     real,        -- trigger 0-100
  energy_mode   text check (energy_mode in ('calm','energize'))
);

create index if not exists biotune_user_ts
  on public.biotune_sessions (user_id_hash, ts_start desc);

-- 1-B  Neon-Walk ---------------------------------------------------
create table if not exists public.neon_walk_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id_hash  text      not null,
  ts            timestamptz not null default now(),
  steps         int,
  avg_cadence   int,      -- pas/min
  hr_avg        int,
  joy_idx       real,
  mvpa_min      real      -- trigger
);

create index if not exists neon_user_ts
  on public.neon_walk_sessions (user_id_hash, ts desc);

-- 1-C  RLS (lecture / écriture perso)
alter table biotune_sessions   enable row level security;
alter table neon_walk_sessions enable row level security;

create policy biotune_rw on biotune_sessions
  using (user_id_hash = current_setting('request.jwt.claim.user_hash', true));

create policy neon_rw on neon_walk_sessions
  using (user_id_hash = current_setting('request.jwt.claim.user_hash', true));
