import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Truck, 
  Gift, 
  Star, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ShoppingCart,
  Users,
  Package,
  Search,
  Menu,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import elseveProducts from "@/assets/elseve-products.png";
import lorealLogo from "@/assets/loreal-paris-logo.svg";

interface ProductPageProps {
  userData: { name: string; whatsapp: string; answers: string[] };
}

const faqs = [
  {
    question: "O produto é realmente grátis?",
    answer: "Sim! O produto é 100% gratuito, você paga apenas o valor do frete para recebê-lo na sua casa."
  },
  {
    question: "É confiável? Receberei meu produto mesmo?",
    answer: "Com certeza! Todos os pedidos são processados e enviados normalmente. Temos diversos feedbacks de clientes satisfeitos."
  },
  {
    question: "Por que o produto está sendo oferecido de graça?",
    answer: "Essa é uma ação promocional de divulgação. Queremos que mais pessoas testem e conheçam a qualidade do nosso produto."
  },
  {
    question: "Quantas vezes posso participar da promoção?",
    answer: "Cada CPF pode participar apenas uma vez para garantir que mais pessoas tenham acesso ao brinde."
  }
];

const reviews = [
  {
    name: "Maria S.",
    initial: "M",
    rating: 5,
    text: "Recebi meu kit e estou amando! Meus fios nunca estiveram tão fortes!"
  },
  {
    name: "Renata P.",
    initial: "R",
    rating: 5,
    text: "💜 Não acreditei que estava levando pagando só o frete!"
  },
  {
    name: "Ana C.",
    initial: "A",
    rating: 4,
    text: "Recebi meu kit e estou amando! Meus fios nunca estiveram tão fortes!"
  }
];

const benefits = [
  "Tecnologia Avançada para Cabelos Mais Fortes e Saudáveis",
  "Fórmulas Desenvolvidas por Especialistas em Tratamento Capilar",
  "Tratamento Completo: Limpeza, Nutrição e Reparação Profunda",
  "Resultados Visíveis Desde a Primeira Aplicação",
  "Cuidado Profissional para Todos os Tipos de Cabelo"
];

const ProductPage = ({ userData }: ProductPageProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleResgate = () => {
    window.open("https://wa.me/5511999999999?text=Olá! Quero resgatar meu kit Elseve Collagen Lifter!", "_blank");
  };

  return (
    <div className="min-h-[100svh] bg-white">
      {/* Header - Same as main page */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 h-12 flex items-center justify-between max-w-screen-sm mx-auto">
          <button 
            aria-label="Buscar"
            className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-purple-600 transition-colors -ml-1"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <img 
              src={lorealLogo}
              alt="L'Oréal Paris"
              className="h-4 w-auto"
            />
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

      {/* Spacer for fixed header */}
      <div className="h-12" />

      {/* Hero Section - Similar to reference */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-6 px-4">
        <div className="max-w-sm mx-auto text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">LANÇAMENTO ELSEVE</h1>
          <p className="text-base font-semibold text-gray-600">COLLAGEN LIFTER</p>
          
          {/* Badges */}
          <div className="flex justify-center gap-2 mt-4">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
              🏆 MAIS VENDIDO
            </span>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 border border-blue-200">
              📦 PAGUE APENAS O FRETE
            </span>
          </div>

          {/* Product Image Card */}
          <div className="relative mt-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            {/* -100% OFF Badge */}
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md">
              -100% OFF
            </div>
            
            <motion.img 
              src={elseveProducts} 
              alt="Kit Elseve Collagen Lifter" 
              className="w-full max-w-[260px] mx-auto"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Trust Icons */}
          <div className="flex justify-center gap-8 mt-5 text-xs text-gray-600">
            <div className="flex flex-col items-center gap-1.5">
              <Shield className="w-5 h-5 text-gray-500" />
              <span>Compra Segura</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-gray-500" />
              <span>Entrega Rápida</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Gift className="w-5 h-5 text-gray-500" />
              <span>Grátis</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-1">(312 avaliações)</span>
          </div>

          {/* Period */}
          <p className="text-xs mt-4 text-gray-500 italic leading-relaxed">
            Período de participação: De 15 de Dezembro de 2025 às 00h00 até 08 de Janeiro de 2026 às 23:59 (horário de Brasília).
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-6 px-4 -mt-2">
        <div className="max-w-sm mx-auto">
          <Button 
            onClick={handleResgate}
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            RESGATAR AGORA
          </Button>

          {/* Payment Methods */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 mb-2">Formas de pagamento:</p>
            <div className="flex justify-center gap-2">
              {["💳", "📱", "🏦", "💰"].map((icon, i) => (
                <span key={i} className="text-lg">{icon}</span>
              ))}
            </div>
            <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <Truck className="w-3 h-3" />
              🚚 Entrega rápida para todo Brasil
            </p>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="bg-gray-50 py-4 px-4 border-y border-gray-200">
        <div className="max-w-sm mx-auto flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">Garantia de 30 Dias</h3>
            <p className="text-xs text-gray-500 mt-0.5">Não ficou satisfeito? Devolvemos seu dinheiro!</p>
            <p className="text-xs text-gray-600 mt-1">
              Oferecemos 30 dias de garantia para você testar o produto com total segurança. Se não estiver 100% satisfeito, basta entrar em contato e devolveremos seu dinheiro, sem burocracia.
            </p>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="bg-white py-4 px-4 border-b border-gray-200">
        <div className="max-w-sm mx-auto text-center space-y-2">
          <p className="text-sm flex items-center justify-center gap-2">
            <Package className="w-4 h-4 text-orange-500" />
            Apenas <span className="font-bold text-orange-500">7 unidades</span> em estoque
          </p>
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Users className="w-3 h-3" />
            👥 32 pessoas compraram nas últimas 24h
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-6 px-4">
        <div className="max-w-sm mx-auto">
          <h2 className="text-center font-bold text-gray-900 mb-4">
            Por que escolher L'Oréal Paris Elseve?
          </h2>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gray-50 py-6 px-4 border-t border-gray-200">
        <div className="max-w-sm mx-auto">
          <h2 className="text-center font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-6 px-4 border-t border-gray-200">
        <div className="max-w-sm mx-auto">
          <h2 className="text-center font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="p-3 bg-white border-t border-gray-200">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-sm mx-auto">
          <Button 
            onClick={handleResgate}
            className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            RESGATAR AGORA
          </Button>
        </div>
      </div>

      {/* Bottom padding for sticky button */}
      <div className="h-20" />
    </div>
  );
};

export default ProductPage;
