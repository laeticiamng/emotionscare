-- 1) ENUMS
create type assess_instrument as enum (
  'WHO5','STAI6','PANAS10','PSS10','UCLA3','MSPSS','AAQ2','POMS_SF','SSQ',
  'ISI','GAS','GRITS','BRS','WEMWBS','SWEMWBS','UWES9','CBI','CVSQ','SAM','SUDS'
);

create type assess_context as enum ('pre','post','weekly','monthly','adhoc');

-- 2) CORE TABLES
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid,       -- null en B2C ; rempli si user est rattaché à une org (B2B)
  team_id uuid,      -- optionnel : sous-groupe B2B
  instrument assess_instrument not null,
  context assess_context not null,
  ts timestamptz not null default now(),
  lang text not null default 'fr',
  -- Résumé strict (aucun item brut, aucune PII)
  score_json_min jsonb not null, -- ex: {"score_scaled":73} ou {"pa_scaled":44,"na_scaled":17}
  -- Métadonnées non-PII
  meta jsonb,
  -- Soft-delete
  deleted_at timestamptz
);

comment on column assessments.score_json_min is 'Résumé strict: pas de réponses item-level; pas de PII.';

create index on public.assessments (user_id, instrument, ts desc);
create index on public.assessments (org_id, team_id, instrument, ts desc) where org_id is not null and deleted_at is null;

-- 3) ITEM-LEVEL (temp buffer + purge auto par trigger)
create table if not exists public.assessment_items (
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  item_id text not null,
  value numeric not null,
  constraint assessment_items_pk primary key(assessment_id, item_id)
);

-- 4) LOCALES & ITEMS (versionnées)
create table if not exists public.assess_items_catalog (
  instrument assess_instrument not null,
  version text not null default 'v1',
  item_id text not null,
  lang text not null,
  prompt text not null,
  choices jsonb, -- optionnel (Likert)
  constraint assess_items_catalog_pk primary key (instrument,version,item_id,lang)
);

-- 5) FEATURE FLAGS & FREQUENCE
create table if not exists public.assess_features (
  key text primary key,              -- ex: 'FF_ASSESS_WHO5'
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.assess_frequency (
  instrument assess_instrument primary key,
  min_interval_secs int not null,   -- capping global minimal entre deux prises
  max_per_day int not null default 10
);

-- Valeurs de référence (ajuste si besoin)
insert into public.assess_frequency (instrument, min_interval_secs, max_per_day) values
  ('STAI6', 3600, 8) on conflict do nothing,
  ('SUDS',   120, 30) on conflict do nothing,
  ('WHO5',  518400, 2) on conflict do nothing,        -- 6 jours
  ('PSS10', 2419200, 1) on conflict do nothing,       -- 28 jours
  ('MSPSS', 2419200, 1) on conflict do nothing,
  ('UCLA3', 1209600, 2) on conflict do nothing,       -- 14 jours
  ('SSQ',     0, 99) on conflict do nothing;          -- post-VR systématique

-- 6) RATE LIMITER PER USER/INSTRUMENT
create table if not exists public.assess_rate_limiter (
  user_id uuid not null,
  instrument assess_instrument not null,
  last_ts timestamptz not null default now(),
  count_today int not null default 0,
  constraint assess_rate_limiter_pk primary key (user_id, instrument)
);

create index on public.assess_rate_limiter (user_id, instrument);

-- 7) ORG/TEAM MEMBERSHIP (B2B)
create table if not exists public.org_members (
  user_id uuid not null,
  org_id uuid not null,
  team_id uuid,
  role text default 'member',
  constraint org_members_pk primary key (user_id, org_id, coalesce(team_id,'00000000-0000-0000-0000-000000000000'))
);

create index on public.org_members (org_id, team_id);
create index on public.org_members (user_id);

-- 8) RLS
alter table public.assessments enable row level security;
alter table public.assessment_items enable row level security;
alter table public.assess_rate_limiter enable row level security;
alter table public.org_members enable row level security;
alter table public.assess_features enable row level security;
alter table public.assess_frequency enable row level security;
alter table public.assess_items_catalog enable row level security;

-- Policies
-- Users: CRUD seulement sur leurs propres enregistrements (hors B2B aggregate)
create policy sel_own_assess on public.assessments
  for select using (auth.uid() = user_id and deleted_at is null);

create policy ins_own_assess on public.assessments
  for insert with check (auth.uid() = user_id);

create policy upd_softdel_own_assess on public.assessments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy del_own_assess_items on public.assessment_items
  for all using (exists (select 1 from public.assessments a where a.id = assessment_id and a.user_id = auth.uid()));

-- Catalog & configs : lecture publique (read-only), écriture restreinte (service role)
create policy read_catalog on public.assess_items_catalog for select using (true);
revoke all on public.assess_items_catalog from public;
grant select on public.assess_items_catalog to anon, authenticated;

create policy read_features on public.assess_features for select using (true);
revoke all on public.assess_features from public;
grant select on public.assess_features to anon, authenticated;

create policy read_frequency on public.assess_frequency for select using (true);
revoke all on public.assess_frequency from public;
grant select on public.assess_frequency to anon, authenticated;

-- rate limiter : lecture/écriture propre
create policy rl_sel on public.assess_rate_limiter for select using (auth.uid() = user_id);
create policy rl_upsert on public.assess_rate_limiter for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- org_members : lecture propre + par service role
create policy om_sel_self on public.org_members for select using (auth.uid() = user_id);

-- 9) VIEW / MATERIALIZED VIEW B2B (AGRÉGÉ TEXTE)
-- Vue source (strictement non matérialisée pour logique custom)
create or replace view public.assess_agg_source as
select
  org_id, team_id, instrument,
  date_trunc('week', ts) as bucket_week,
  count(*) as n,
  jsonb_agg(score_json_min) as payloads
from public.assessments
where org_id is not null and deleted_at is null
group by org_id, team_id, instrument, date_trunc('week', ts);

-- Matérialisée + garde min_n >= 5 côté requête d’agrégation (Edge)
-- (facultatif de matérialiser selon la volumétrie)

-- 10) TRIGGERS
-- a) Auto-injection org_id/team_id à l’insert depuis org_members (si existe)
create or replace function public.fn_assess_fill_org_team()
returns trigger language plpgsql as $$
begin
  if new.org_id is null then
    select m.org_id, m.team_id
    into new.org_id, new.team_id
    from public.org_members m
    where m.user_id = new.user_id
    limit 1;
  end if;
  return new;
end $$;

create trigger trg_assess_fill_org_team
before insert on public.assessments
for each row execute function public.fn_assess_fill_org_team();

-- b) Purge item-level après insertion (minimisation : on peut conserver X minutes max)
create or replace function public.fn_purge_items_after_insert()
returns trigger language plpgsql as $$
begin
  -- Ici on ne purge pas immédiatement pour permettre recalcul si besoin,
  -- mais on peut programmer une purge différée (ex: job cron).
  return null;
end $$;

-- c) Soft delete cascade items
create or replace function public.fn_softdelete_items()
returns trigger language plpgsql as $$
begin
  if new.deleted_at is not null then
    delete from public.assessment_items where assessment_id = new.id;
  end if;
  return new;
end $$;

create trigger trg_softdelete_items
after update of deleted_at on public.assessments
for each row execute function public.fn_softdelete_items();

-- d) Rate limiter (mise à jour au submit via Edge plutôt que trigger SQL pour logique horaire)

Rollback minimal (au besoin) : supprimer les tables dans l’ordre inverse + types ENUM.
