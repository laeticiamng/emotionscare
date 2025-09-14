-- Undo: drop glow_mug table, policy, trigger
DROP TRIGGER IF EXISTS trg_mug_metrics ON glow_mug;
DROP FUNCTION IF EXISTS public.calc_glow_mug();
DROP POLICY IF EXISTS p_mug_rw ON glow_mug;
DROP TABLE IF EXISTS public.glow_mug CASCADE;
