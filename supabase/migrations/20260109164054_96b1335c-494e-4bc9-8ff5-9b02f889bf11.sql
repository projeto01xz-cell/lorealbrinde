-- Remove the overly permissive SELECT policy
DROP POLICY IF EXISTS "Allow read order by external_id" ON public.orders;

-- No public SELECT policy - all reads must go through edge functions with service_role
-- The edge functions already use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS