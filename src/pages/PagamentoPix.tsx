import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Check, Clock, ShieldCheck, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import gtsm1Logo from "@/assets/gtsm1-logo.png";

interface PixData {
  id: string;
  payload: string;
  qrCodeUrl?: string;
  expiresAt?: string;
  amount: number;
}

interface OrderData {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  total: number;
}

export default function PagamentoPix() {
  const navigate = useNavigate();
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");

  useEffect(() => {
    const storedPixData = sessionStorage.getItem("pixPayment");
    const storedOrderData = sessionStorage.getItem("checkoutOrder");

    if (!storedPixData || !storedOrderData) {
      navigate("/produtos");
      return;
    }

    setPixData(JSON.parse(storedPixData));
    setOrderData(JSON.parse(storedOrderData));
  }, [navigate]);

  const handleCopy = async () => {
    if (pixData?.payload) {
      await navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Polling to check payment status
  useEffect(() => {
    if (!pixData?.id) return;

    console.log("Starting payment status polling for transaction:", pixData.id);

    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke("get-order-status", {
          body: { externalId: pixData.id }
        });

        if (data && data.status !== paymentStatus) {
          console.log("Payment status updated:", data.status);
          setPaymentStatus(data.status);
          
          if (data.status === "paid") {
            clearInterval(pollInterval);
            // Clear session storage
            sessionStorage.removeItem("pixPayment");
            sessionStorage.removeItem("checkoutOrder");
            setTimeout(() => {
              navigate(`/upsell?order=${pixData.id}`);
            }, 1500);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [pixData?.id, navigate, paymentStatus]);

  if (!pixData || !orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border w-full">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src={gtsm1Logo} alt="GTSM1" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Ambiente Seguro</span>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-8">
        {/* Success Banner */}
        <div className="bg-primary py-3 text-center">
          <p className="text-primary-foreground text-sm font-bold px-4">
            ✓ Pedido gerado com sucesso!
          </p>
        </div>

        <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
          {/* Payment Confirmed Message */}
          {paymentStatus === "paid" && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center animate-pulse">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-bold">Pagamento Confirmado! Redirecionando...</span>
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">
                  Pedido Gerado!
                </h1>
                <p className="text-xs text-muted-foreground">
                  Olá, {orderData.customer.name.split(" ")[0]}!
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-foreground">Pagamento via PIX</h2>
              <div className="flex items-center gap-1 text-amber-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Expira em 30 min</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
              <p className="text-3xl font-black text-primary">
                {formatPrice(orderData.total)}
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                PIX Copia e Cola
              </p>
              <div className="bg-card border border-border rounded-lg p-3 break-all max-h-24 overflow-y-auto">
                <p className="text-xs text-foreground font-mono leading-relaxed">
                  {pixData.payload}
                </p>
              </div>
            </div>

            <Button
              onClick={handleCopy}
              className={`w-full h-12 font-bold rounded-lg transition-all ${
                copied
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-[#22c55e] hover:bg-[#16a34a]"
              } text-white`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  CÓDIGO COPIADO!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  COPIAR CÓDIGO PIX
                </>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-bold text-sm text-foreground mb-3">Como pagar:</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Abra o aplicativo do seu banco</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Escolha a opção PIX e depois "PIX Copia e Cola"</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>Cole o código copiado e confirme o pagamento</span>
              </li>
            </ol>
          </div>

          {/* Awaiting Payment Indicator */}
          {paymentStatus === "pending" && (
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 rounded-lg text-amber-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-medium">Aguardando confirmação do pagamento...</span>
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Pagamento 100% seguro. Após a confirmação, você receberá um e-mail com os detalhes do seu pedido.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-4 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            GTSM1 Comércio de Bicicletas Ltda
          </p>
          <p className="text-xs text-muted-foreground">
            CNPJ: 45.678.901/0001-23
          </p>
        </div>
      </footer>
    </div>
  );
}
