-- Criar tabela de pedidos para rastrear status de pagamento
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_document TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  pix_payload TEXT,
  shipping_option TEXT,
  shipping_price DECIMAL(10,2),
  address_cep TEXT,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  products JSONB,
  utm_params JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (mas permitir leitura pública por external_id para a página de upsell)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy para leitura pública (verificação de status por external_id)
CREATE POLICY "Orders can be read by external_id" 
ON public.orders 
FOR SELECT 
USING (true);

-- Habilitar realtime para atualização de status
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;