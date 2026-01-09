import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Copy, Check, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import lorealLogo from "@/assets/loreal-paris-logo.svg";

interface PixPaymentPageProps {
  pixData: {
    payload: string;
    expiresAt?: string;
    orderId?: string;
  };
  total: number;
  customerName: string;
}

const PixPaymentPage = ({ pixData, total, customerName }: PixPaymentPageProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");

  const handleCopy = async () => {
    if (pixData.payload) {
      await navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Escutar atualizações em tempo real do pagamento
  useEffect(() => {
    if (!pixData.orderId) return;

    console.log("Listening for payment updates on order:", pixData.orderId);

    const channel = supabase
      .channel("pix-payment-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `external_id=eq.${pixData.orderId}`,
        },
        (payload) => {
          console.log("Payment status updated:", payload);
          const newStatus = (payload.new as { status: string }).status;
          setPaymentStatus(newStatus);
          
          // Se pagou, redirecionar para upsell
          if (newStatus === "paid") {
            setTimeout(() => {
              navigate(`/upsell?order=${pixData.orderId}`);
            }, 1500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pixData.orderId, navigate]);

  return (
    <div className="min-h-[100svh] bg-gray-50 pb-8">
      {/* Promo Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-black py-2 px-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
            Oferta Exclusiva Válida
          </span>
          <span className="bg-white text-black text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded uppercase">
            Por Tempo Limitado
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-[36px] left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 h-12 flex items-center justify-between max-w-screen-sm mx-auto">
          <button
            aria-label="Buscar"
            className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-purple-600 transition-colors -ml-1"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <img src={lorealLogo} alt="L'Oréal Paris" className="h-4 w-auto" />
          </div>

          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-purple-600 transition-colors -mr-1"
          >
            {menuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </header>

      {/* Spacer for fixed header + banner */}
      <div className="h-[84px]" />

      <div className="px-4 py-6 max-w-sm mx-auto space-y-4">
        {/* Payment Confirmed Message */}
        {paymentStatus === "paid" && (
          <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-bold">Pagamento Confirmado! Redirecionando...</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-1">
            Pedido Gerado com Sucesso!
          </h1>
          <p className="text-sm text-gray-600">
            Olá, <span className="font-medium">{customerName}</span>! Seu pedido foi criado.
          </p>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-gray-900">Pagamento via Pix</h2>
            <div className="flex items-center gap-1 text-orange-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Expira em 30 min</span>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">Valor a pagar</p>
            <p className="text-3xl font-black text-green-600">
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">Pix Copia e Cola</p>
            <div className="bg-white border border-gray-200 rounded-lg p-3 break-all">
              <p className="text-xs text-gray-700 font-mono leading-relaxed">
                {pixData.payload}
              </p>
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className={`w-full h-12 font-bold rounded-lg transition-all ${
              copied
                ? "bg-green-500 hover:bg-green-600"
                : "bg-purple-600 hover:bg-purple-700"
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
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900 mb-3">Como pagar:</h3>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Abra o aplicativo do seu banco</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Escolha a opção Pix e depois "Pix Copia e Cola"</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Cole o código copiado e confirme o pagamento</span>
            </li>
          </ol>
        </div>

        {/* Awaiting Payment Indicator */}
        {paymentStatus === "pending" && (
          <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Aguardando confirmação do pagamento...</span>
          </div>
        )}

        {/* Security Note */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800">
            Pagamento 100% seguro. Após a confirmação, você receberá um e-mail com os detalhes do seu pedido.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PixPaymentPage;
