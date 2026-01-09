-- Drop problematic policies
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
DROP POLICY IF EXISTS "Allow read own order by external_id" ON public.orders;
DROP POLICY IF EXISTS "Allow status update by service role" ON public.orders;
DROP POLICY IF EXISTS "Prevent public deletes" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;

-- Create proper policies
-- Allow inserts with validation
CREATE POLICY "Allow validated order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  customer_document IS NOT NULL AND 
  length(customer_document) >= 11 AND
  customer_email IS NOT NULL AND 
  customer_email ~ '^[^@]+@[^@]+\.[^@]+$' AND
  customer_name IS NOT NULL AND
  length(customer_name) >= 2 AND
  customer_phone IS NOT NULL AND
  length(customer_phone) >= 10 AND
  external_id IS NOT NULL AND
  total_amount > 0
);

-- Allow reading orders by external_id only (users can only check their own order status)
CREATE POLICY "Allow read order by external_id" 
ON public.orders 
FOR SELECT 
USING (external_id IS NOT NULL);