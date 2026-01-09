import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Percent, ShoppingBag, CheckCircle, Frown, Loader2, Copy, Check, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import lorealLogo from "@/assets/loreal-paris-logo.svg";
import serumOleoExtraordinario from "@/assets/serum-oleo-extraordinario.png";
import serumLisoSonhos from "@/assets/serum-liso-sonhos.png";
import leaveInCicatriRenov from "@/assets/leave-in-cicatri-renov.png";

interface PixData {
  payload: string;
  expiresAt?: string;
}

const OfertaEspecial = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const [menuOpen, setMenuOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDocument, setCustomerDocument] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);

  const totalPrice = 47.10;

  useEffect(() => {
    if (!orderId || orderId === "null") return;

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("customer_name, customer_email, customer_phone, customer_document")
        .eq("external_id", orderId)
        .single();

      if (data) {
        setCustomerName(data.customer_name?.split(" ")[0] || "");
        setCustomerEmail(data.customer_email || "");
        setCustomerPhone(data.customer_phone || "");
        setCustomerDocument(data.customer_document || "");
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

  const handleGeneratePix = async () => {
    setLoadingPayment(true);
    
    try {
      const items = products.map(p => ({
        title: p.name,
        quantity: 1,
        unitPrice: Math.round(p.discountPrice * 100)
      }));

      const totalCents = Math.round(totalPrice * 100);

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: totalCents,
          customer: {
            name: customerName || "Cliente Upsell",
            email: customerEmail || "cliente@email.com",
            document: customerDocument || "00000000000",
            phone: customerPhone || "00000000000"
          },
          items,
          expiresInMinutes: 30
        }
      });

      if (error) {
        console.error("Payment error:", error);
        toast.error("Erro ao gerar pagamento Pix");
        return;
      }

      setPixData({
        payload: data.pix?.payload || "",
        expiresAt: data.pix?.expiresAt
      });

      // Facebook Pixel - Purchase Upsell
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          content_name: 'Upsell - Kit Completo Elseve',
          content_category: 'Hair Care Upsell',
          content_ids: products.map(p => p.id),
          num_items: 3,
          currency: 'BRL',
          value: totalPrice
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Erro ao processar pagamento");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleCopy = async () => {
    if (pixData?.payload) {
      await navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Se já gerou o PIX, mostrar tela de pagamento
  if (pixData) {
    return (
      <div className="min-h-[100svh] bg-white pb-8">
        {/* Promo Banner */}
        <div className="fixed top-0 left-0 right-0 z-[60] bg-black py-2 px-4">
          <div className="flex items-center justify-center">
            <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
              Finalize seu Pagamento
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

        <div className="px-4 py-6 max-w-sm mx-auto space-y-4">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-1">
              Pedido Gerado com Sucesso!
            </h1>
            <p className="text-sm text-gray-600">
              Pague agora para garantir seus produtos com desconto.
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
                R$ {totalPrice.toFixed(2).replace(".", ",")}
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

          {/* Products Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Seus produtos:</h3>
            <div className="space-y-2">
              {products.map(product => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{product.name}</span>
                  <span className="font-medium text-gray-900">R$ {product.discountPrice.toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
            </div>
          </div>

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
  }

  return (
    <div className="min-h-[100svh] bg-white pb-32">
      {/* Promo Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-black py-2 px-4">
        <div className="flex items-center justify-center">
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
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200 animate-fade-in">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Frown className="w-10 h-10 text-gray-500" />
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
        <div className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs opacity-80">Você pagaria</p>
              <p className="text-lg line-through opacity-70">R$ 239,70</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80">Pague apenas</p>
              <p className="text-3xl font-black">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
            </div>
          </div>
          <div className="border-t border-white/30 pt-3 text-center">
            <p className="text-sm font-semibold">Economia total: <span className="font-black">R$ 192,60</span></p>
          </div>
        </div>
      </div>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-base rounded-xl shadow-lg disabled:opacity-70"
            onClick={handleGeneratePix}
            disabled={loadingPayment}
          >
            {loadingPayment ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                GERANDO PIX...
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 mr-2" />
                APROVEITAR DESCONTO AGORA
              </>
            )}
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
