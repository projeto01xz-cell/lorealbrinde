import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, Menu, X, Loader2, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import lorealLogo from "@/assets/loreal-paris-logo.svg";

type UpsellStep = "waiting" | "loading" | "error";

const Upsell = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order");
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [step, setStep] = useState<UpsellStep>("waiting");
  const [progress, setProgress] = useState(0);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    // Se não tem orderId, mostrar estado de loading como demo
    if (!orderId || orderId === "null") {
      setStep("loading");
      return;
    }

    // Buscar status inicial do pedido via edge function segura
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-order-status", {
          body: { externalId: orderId }
        });

        if (error || !data) {
          console.error("Order not found:", error);
          return;
        }

        setOrderStatus(data.status);
        setCustomerName(data.customerName || "");
        
        // Se já está pago, iniciar animação de loading
        if (data.status === "paid") {
          setStep("loading");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();

    // Polling para verificar status (já que realtime não funciona sem SELECT policy)
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase.functions.invoke("get-order-status", {
          body: { externalId: orderId }
        });

        if (data && data.status !== orderStatus) {
          setOrderStatus(data.status);
          if (data.status === "paid") {
            setStep("loading");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // Verificar a cada 5 segundos

    return () => {
      clearInterval(pollInterval);
    };
  }, [orderId]);

  // Animação de progresso (6 segundos)
  useEffect(() => {
    if (step !== "loading") return;

    const duration = 6000; // 6 segundos
    const interval = 50; // Atualizar a cada 50ms
    const increment = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          // Mostrar erro após completar
          setTimeout(() => {
            setStep("error");
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [step]);

  // Redirecionar para página de desconto após mostrar erro
  useEffect(() => {
    if (step === "error") {
      const timer = setTimeout(() => {
        navigate(`/oferta-especial?order=${orderId}`);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step, orderId, navigate]);

  return (
    <div className="min-h-[100svh] bg-gray-50">
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

      {/* Spacer */}
      <div className="h-[84px]" />

      <div className="px-4 py-8 max-w-md mx-auto">
        {/* Aguardando pagamento */}
        {orderStatus === "pending" && step === "waiting" && (
          <div className="text-center animate-fade-in">
            <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Aguardando Pagamento...
            </h1>
            <p className="text-gray-600 mb-4">
              Assim que identificarmos seu pagamento, você será redirecionado automaticamente.
            </p>
            <p className="text-sm text-gray-500">
              Esta página atualiza automaticamente.
            </p>
          </div>
        )}

        {/* Barra de carregamento */}
        {step === "loading" && (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reservando seu Brinde...
            </h1>
            <p className="text-gray-600 mb-6">
              {customerName ? `${customerName}, aguarde` : "Aguarde"} enquanto verificamos a disponibilidade do seu kit.
            </p>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="mb-4">
                <Progress value={progress} className="h-3" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Verificando estoque...</span>
                <span className="text-purple-600 font-bold">{Math.round(progress)}%</span>
              </div>
              
              <div className="mt-4 space-y-2 text-left">
                <div className={`flex items-center gap-2 text-sm ${progress > 20 ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${progress > 20 ? "bg-green-500" : "bg-gray-300"}`} />
                  Conectando ao sistema de logística...
                </div>
                <div className={`flex items-center gap-2 text-sm ${progress > 50 ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${progress > 50 ? "bg-green-500" : "bg-gray-300"}`} />
                  Calculando rotas de entrega...
                </div>
                <div className={`flex items-center gap-2 text-sm ${progress > 80 ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-2 h-2 rounded-full ${progress > 80 ? "bg-green-500" : "bg-gray-300"}`} />
                  Reservando seu kit...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem de erro */}
        {step === "error" && (
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Erro no Sistema de Logística
            </h1>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-700 font-medium mb-2">
                Cálculo de logística mal sucedido!
              </p>
              <p className="text-red-600 text-sm">
                Infelizmente, os brindes promocionais esgotaram durante o processamento do seu pedido.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Redirecionando para solução...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upsell;
