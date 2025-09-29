-- 1) Lister les tables sans RLS (doit renvoyer 0 lignes)
select n.nspname||'.'||c.relname as table_name
from pg_class c
join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r' and c.relname in (
  'consents','assessments','org_assess_rollups','orgs','org_members','org_invites',
  'org_events','org_event_rsvps','org_audit_logs'
) and c.relrowsecurity is false;

-- 2) Interdire lecture cross-org (ex : org_events)
-- (À exécuter dans tests contract côté Edge: JWT org=A ne voit pas org=B)
