import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Gift, ShoppingBag } from "lucide-react";
import lorealLogo from "@/assets/loreal-paris-logo.svg";

const Upsell = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order");
  
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    // Buscar status inicial do pedido
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("status, customer_name")
        .eq("external_id", orderId)
        .single();

      if (error || !data) {
        console.error("Order not found:", error);
        return;
      }

      setOrderStatus(data.status);
      setCustomerName(data.customer_name?.split(" ")[0] || "");
      setLoading(false);
    };

    fetchOrder();

    // Escutar atualizações em tempo real
    const channel = supabase
      .channel("order-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `external_id=eq.${orderId}`,
        },
        (payload) => {
          console.log("Order updated:", payload);
          const newStatus = (payload.new as { status: string }).status;
          setOrderStatus(newStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se ainda não pagou, mostrar mensagem de aguardo
  if (orderStatus === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Header */}
        <header className="bg-black py-3">
          <div className="container mx-auto px-4 flex justify-center">
            <img src={lorealLogo} alt="L'Oréal Paris" className="h-8" />
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="w-16 h-16 animate-spin text-amber-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Aguardando Pagamento...
            </h1>
            <p className="text-gray-600 mb-4">
              Assim que identificarmos seu pagamento, você receberá uma oferta especial!
            </p>
            <p className="text-sm text-gray-500">
              Esta página atualiza automaticamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pagamento confirmado - mostrar upsell
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-black py-3">
        <div className="container mx-auto px-4 flex justify-center">
          <img src={lorealLogo} alt="L'Oréal Paris" className="h-8" />
        </div>
      </header>

      {/* Banner de Sucesso */}
      <div className="bg-green-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Pagamento Confirmado!</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Mensagem de Parabéns */}
          <div className="text-center mb-8">
            <Gift className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Parabéns{customerName ? `, ${customerName}` : ""}! 🎉
            </h1>
            <p className="text-gray-600">
              Seu Kit Elseve Collagen Lifter está garantido e será enviado em breve!
            </p>
          </div>

          {/* Área de Upsell - Customize aqui */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-400">
            <div className="text-center mb-6">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                OFERTA EXCLUSIVA - APENAS AGORA
              </span>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-4">
              Aproveite e Complete Seu Tratamento!
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Adicione mais produtos ao seu pedido com <strong>até 60% de desconto</strong> exclusivo para quem acabou de garantir o kit.
            </p>

            {/* Placeholder para produtos de upsell */}
            <div className="bg-amber-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-amber-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Produto de Upsell</h3>
                  <p className="text-sm text-gray-500">Descrição do produto aqui</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 line-through text-sm">R$ 99,90</span>
                    <span className="text-green-600 font-bold text-lg">R$ 39,90</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg rounded-xl"
              onClick={() => {
                // Aqui você pode adicionar a lógica para adicionar o upsell
                console.log("Upsell clicked");
              }}
            >
              SIM! QUERO ADICIONAR AO MEU PEDIDO
            </Button>

            <button 
              className="w-full text-gray-500 text-sm mt-4 underline"
              onClick={() => navigate("/")}
            >
              Não, obrigado. Quero apenas meu kit.
            </button>
          </div>

          {/* Informações do Pedido */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Pedido #{orderId}</p>
            <p>Você receberá um e-mail com os detalhes do envio.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upsell;
