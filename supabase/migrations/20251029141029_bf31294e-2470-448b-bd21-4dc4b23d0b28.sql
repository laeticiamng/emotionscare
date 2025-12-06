-- Fix Function Search Path - Simplified approach
-- Set search_path on custom functions to improve security

DO $$
DECLARE
    func_rec RECORD;
    func_signature TEXT;
BEGIN
    FOR func_rec IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args,
            p.proconfig
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname NOT LIKE 'pg_%'
        AND (p.proconfig IS NULL OR NOT 'search_path=public' = ANY(p.proconfig))
    LOOP
        -- Build the full function signature
        func_signature := format('%I.%I(%s)', 
            func_rec.schema_name, 
            func_rec.function_name,
            func_rec.args
        );
        
        BEGIN
            EXECUTE format('ALTER FUNCTION %s SET search_path = public', func_signature);
            RAISE NOTICE '✓ Set search_path for: %', func_signature;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '✗ Failed for %: %', func_signature, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '=== Function search_path update completed ===';
END $$;

-- Create extensions schema for better organization
CREATE SCHEMA IF NOT EXISTS extensions;
COMMENT ON SCHEMA extensions IS 'Dedicated schema for PostgreSQL extensions';

-- Log completion
DO $$
BEGIN
    RAISE NOTICE '=== REMAINING MANUAL ACTIONS ===';
    RAISE NOTICE '1. Security Definer Views: Check Supabase dashboard for views with SECURITY DEFINER';
    RAISE NOTICE '2. Extensions: Move extensions to extensions schema via dashboard';
    RAISE NOTICE '3. Postgres upgrade: Update to latest version via Supabase dashboard';
END $$;