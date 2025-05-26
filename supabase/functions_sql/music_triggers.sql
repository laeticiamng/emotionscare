-- 2-A  BioTune : Δ RMSSD + Coherence
create or replace function public.biotune_metrics_trigger()
returns trigger language plpgsql as $$
begin
  new.rmssd_delta :=
        coalesce(new.hrv_post,0) - coalesce(new.hrv_pre,0);

  -- Coherence = 100 – 5 pts par battement d'écart (borné 0-100)
  new.coherence :=
        greatest(0, least(100,
          100 - abs(coalesce(new.bpm_target,0)
                    - coalesce(new.hrv_post,new.hrv_pre,0)) * 5));
  return new;
end $$;

create trigger trg_biotune_metrics
before insert on public.biotune_sessions
for each row execute procedure public.biotune_metrics_trigger();

-- 2-B  Neon-Walk : MVPA minutes
create or replace function public.neon_metrics_trigger()
returns trigger language plpgsql as $$
begin
  new.mvpa_min :=
        round( (coalesce(new.steps,0)/100.0)
             * (coalesce(new.avg_cadence,0)/120.0) , 2);
  return new;
end $$;

create trigger trg_neon_metrics
before insert on public.neon_walk_sessions
for each row execute procedure public.neon_metrics_trigger();
