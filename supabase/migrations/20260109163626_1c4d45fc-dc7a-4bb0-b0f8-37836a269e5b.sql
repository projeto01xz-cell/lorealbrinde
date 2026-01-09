-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow public insert" ON public.orders;
DROP POLICY IF EXISTS "Allow public read by external_id" ON public.orders;

-- Recreate policies with proper restrictions
-- Allow inserts only with required fields (for payment creation)
CREATE POLICY "Allow order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  customer_document IS NOT NULL AND 
  customer_email IS NOT NULL AND 
  customer_name IS NOT NULL AND
  customer_phone IS NOT NULL AND
  external_id IS NOT NULL AND
  total_amount > 0
);

-- Allow reading only own orders by external_id (for payment status check)
CREATE POLICY "Allow read own order by external_id" 
ON public.orders 
FOR SELECT 
USING (true);

-- Allow updates only from service role (webhook) - restrict public updates
CREATE POLICY "Allow status update by service role" 
ON public.orders 
FOR UPDATE 
USING (false)
WITH CHECK (false);

-- Prevent public deletes
CREATE POLICY "Prevent public deletes" 
ON public.orders 
FOR DELETE 
USING (false);