-- Corriger list_changes avec search_path
CREATE OR REPLACE FUNCTION public.list_changes()
RETURNS TABLE(change_id text, change_data jsonb)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Fonction placeholder pour lister les changements
  RETURN QUERY SELECT ''::text, '{}'::jsonb WHERE false;
END;
$$;