
-- Fix permissive RLS policy on analytics_events
-- Currently allows anyone (even unauthenticated) to INSERT
-- Change to allow only authenticated users OR anonymous with basic protection

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;

-- Create a more secure policy: authenticated users can insert their own events
CREATE POLICY "Authenticated users can insert analytics events"
ON public.analytics_events
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);

-- Allow anonymous analytics tracking (for homepage before login) but with anon role only
CREATE POLICY "Anonymous can insert analytics events without user_id"
ON public.analytics_events
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL
);
