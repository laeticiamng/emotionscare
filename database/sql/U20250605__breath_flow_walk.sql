-- Undo: drop flow_walk table, policy, trigger
DROP TRIGGER IF EXISTS trg_flow_metrics ON flow_walk;
DROP FUNCTION IF EXISTS public.calc_flow_walk();
DROP POLICY IF EXISTS p_flow_rw ON flow_walk;
DROP TABLE IF EXISTS public.flow_walk CASCADE;
