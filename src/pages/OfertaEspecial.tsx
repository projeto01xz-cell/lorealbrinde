import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Gift, Percent, ShoppingBag, CheckCircle } from "lucide-react";
import lorealLogo from "@/assets/loreal-paris-logo.svg";
import serumOleoExtraordinario from "@/assets/serum-oleo-extraordinario.png";
import serumLisoSonhos from "@/assets/serum-liso-sonhos.png";
import leaveInCicatriRenov from "@/assets/leave-in-cicatri-renov.png";

const OfertaEspecial = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [menuOpen, setMenuOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("customer_name")
        .eq("external_id", orderId)
        .single();

      if (data) {
        setCustomerName(data.customer_name?.split(" ")[0] || "");
      }
    };

    fetchOrder();
  }, [orderId]);

  const products = [
    {
      id: "serum-oleo",
      name: "Sérum Óleo Extraordinário 100ml",
      description: "Óleo de flores preciosas. Nutre instantaneamente sem pesar.",
      image: serumOleoExtraordinario,
      originalPrice: 89.90,
      discountPrice: 18.40,
      discount: 79,
    },
    {
      id: "serum-liso",
      name: "Sérum Liso dos Sonhos 100ml",
      description: "Cabelos à prova de umidade & lisos por 1 semana. Sem química.",
      image: serumLisoSonhos,
      originalPrice: 79.90,
      discountPrice: 16.30,
      discount: 80,
    },
    {
      id: "leave-in",
      name: "Leave-In Cicatri Renov 100ml",
      description: "12% complexo reparador com micro queratina. Repara a fibra capilar.",
      image: leaveInCicatriRenov,
      originalPrice: 69.90,
      discountPrice: 12.40,
      discount: 82,
    },
  ];

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-amber-50 to-white pb-32">
      {/* Promo Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-red-600 to-red-500 py-2 px-4">
        <div className="flex items-center justify-center gap-3">
          <Gift className="w-4 h-4 text-white" />
          <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
            Pedido de Desculpas - Desconto Exclusivo
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

      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Apology Message */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-amber-400 animate-fade-in">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-amber-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {customerName ? `${customerName}, pedimos desculpas!` : "Pedimos desculpas!"}
            </h1>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              Devido ao grande volume de pedidos, nosso sistema de logística não conseguiu reservar seu brinde a tempo.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-semibold text-sm">
                  Mas não se preocupe!
                </p>
                <p className="text-green-700 text-xs mt-1">
                  Como forma de compensação, liberamos acesso a descontos exclusivos de até 82% nos nossos produtos mais vendidos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Percent className="w-5 h-5 text-red-500" />
          <span className="text-lg font-bold text-gray-900">
            Descontos de até <span className="text-red-500">82% OFF</span>
          </span>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-xs">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-green-600 font-bold text-lg">
                      R$ {product.discountPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Savings */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
          <p className="text-sm opacity-90 mb-1">Economia total comprando os 3:</p>
          <p className="text-2xl font-black">R$ 192,60</p>
          <p className="text-xs opacity-80 mt-1">Você pagaria R$ 239,70 | Pague apenas R$ 47,10</p>
        </div>
      </div>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-base rounded-xl shadow-lg"
            onClick={() => {
              // Aqui você pode redirecionar para um checkout com os produtos
              console.log("Comprar produtos com desconto");
            }}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            APROVEITAR DESCONTO AGORA
          </Button>
          <p className="text-center text-xs text-gray-500 mt-2">
            Oferta válida apenas nesta página
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfertaEspecial;
