-- Fix search_path on group meditation functions for security

-- 1. Fix update_group_meditation_timestamp function
CREATE OR REPLACE FUNCTION public.update_group_meditation_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Fix generate_join_code function
CREATE OR REPLACE FUNCTION public.generate_join_code()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.join_code IS NULL THEN
    NEW.join_code := upper(substr(md5(random()::text), 1, 6));
  END IF;
  RETURN NEW;
END;
$$;