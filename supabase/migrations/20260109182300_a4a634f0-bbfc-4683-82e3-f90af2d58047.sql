-- Add leadId column to orders table for Utmify tracking
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS utmify_lead_id TEXT;

-- Add client_ip column for better tracking
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS client_ip TEXT;