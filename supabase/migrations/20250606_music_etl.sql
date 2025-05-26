/* 1. Fonction de refresh ---------------------------------------- */
create or replace function public.refresh_metrics_music()
returns void language plpgsql as $$
begin
  perform refresh materialized view concurrently public.metrics_weekly_music;
  perform refresh materialized view concurrently public.metrics_weekly_music_org;
end;
$$;

/* 2. Cron pg_cron (nécessite l'extension déjà enable) ----------- */
-- enable extension if not yet
create extension if not exists pg_cron;

select cron.schedule(
  job_name  => 'refresh_metrics_music',
  schedule  => '10 3 * * *',
  command   => $$call public.refresh_metrics_music();$$
);
