-- Block public SELECT on orders table (edge functions use service_role, so they're unaffected)
CREATE POLICY "Block direct select on orders" 
ON public.orders 
FOR SELECT 
USING (false);

-- Add database-level validation constraints with flexible formats
-- Phone: allows digits, spaces, parentheses, hyphens (10-20 chars total)
ALTER TABLE public.orders ADD CONSTRAINT orders_phone_min_length
  CHECK (length(regexp_replace(customer_phone, '[^0-9]', '', 'g')) >= 10);

-- Document: allows digits, dots, hyphens (CPF: 11 digits, CNPJ: 14 digits)  
ALTER TABLE public.orders ADD CONSTRAINT orders_document_min_length
  CHECK (length(regexp_replace(customer_document, '[^0-9]', '', 'g')) >= 11);

-- Amount must be positive
ALTER TABLE public.orders ADD CONSTRAINT orders_positive_amount 
  CHECK (total_amount > 0);

-- Status must be valid
ALTER TABLE public.orders ADD CONSTRAINT orders_valid_status 
  CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded'));

-- Email basic format check
ALTER TABLE public.orders ADD CONSTRAINT orders_email_format 
  CHECK (customer_email ~* '^[^@]+@[^@]+\.[^@]+$');