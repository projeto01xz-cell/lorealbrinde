-- Remover a política pública que expõe todos os dados
DROP POLICY IF EXISTS "Orders can be read by external_id" ON public.orders;

-- Criar política que só permite INSERT (para criar pedidos)
CREATE POLICY "Anyone can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Criar política que permite UPDATE apenas via service role (webhook)
-- Não criamos SELECT policy pública - consultas serão feitas via edge function