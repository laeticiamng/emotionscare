-- Fix all remaining functions with mutable search_path

DO $$
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT p.proname, pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND (p.proconfig IS NULL OR NOT EXISTS (
      SELECT 1 FROM unnest(p.proconfig) AS cfg WHERE cfg LIKE 'search_path=%'
    ))
  LOOP
    EXECUTE format('ALTER FUNCTION public.%I(%s) SET search_path = public', 
      func_record.proname, func_record.args);
  END LOOP;
END $$;