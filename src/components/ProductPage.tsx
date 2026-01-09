import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Truck, Gift, Star, Check, ChevronDown, ChevronUp, ShoppingCart, Users, Search, Menu, X, CreditCard, Smartphone, Landmark, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import productKitFull from "@/assets/product-kit-full.png";
import lorealLogo from "@/assets/loreal-paris-logo.svg";
interface ProductPageProps {
  userData: {
    name: string;
    whatsapp: string;
    answers: string[];
  };
}
const faqs = [{
  question: "O produto é realmente grátis?",
  answer: "Sim! O produto é 100% gratuito, você paga apenas o valor do frete para recebê-lo na sua casa."
}, {
  question: "É confiável? Receberei meu produto mesmo?",
  answer: "Com certeza! Todos os pedidos são processados e enviados normalmente. Temos diversos feedbacks de clientes satisfeitos."
}, {
  question: "Por que o produto está sendo oferecido de graça?",
  answer: "Essa é uma ação promocional de divulgação. Queremos que mais pessoas testem e conheçam a qualidade do nosso produto."
}, {
  question: "Quantas vezes posso participar da promoção?",
  answer: "Cada CPF pode participar apenas uma vez para garantir que mais pessoas tenham acesso ao brinde."
}];
const reviews = [{
  name: "Maria S.",
  initial: "M",
  rating: 5,
  text: "Recebi meu kit e estou amando! Meus fios nunca estiveram tão fortes!"
}, {
  name: "Renata P.",
  initial: "R",
  rating: 5,
  text: "💜 Não acreditei que estava levando pagando só o frete!"
}, {
  name: "Ana C.",
  initial: "A",
  rating: 4,
  text: "Recebi meu kit e estou amando! Meus fios nunca estiveram tão fortes!"
}];
const benefits = ["Tecnologia Avançada para Cabelos Mais Fortes e Saudáveis", "Fórmulas Desenvolvidas por Especialistas em Tratamento Capilar", "Tratamento Completo: Limpeza, Nutrição e Reparação Profunda", "Resultados Visíveis Desde a Primeira Aplicação", "Cuidado Profissional para Todos os Tipos de Cabelo"];
const ProductPage = ({
  userData
}: ProductPageProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleResgate = () => {
    window.open("https://wa.me/5511999999999?text=Olá! Quero resgatar meu kit Elseve Collagen Lifter!", "_blank");
  };
  return <div className="min-h-[100svh] bg-white">
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

      {/* Header - Same as main page */}
      <header className="fixed top-[36px] left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 h-12 flex items-center justify-between max-w-screen-sm mx-auto">
          <button aria-label="Buscar" className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-purple-600 transition-colors -ml-1">
            <Search className="w-[18px] h-[18px]" />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <img src={lorealLogo} alt="L'Oréal Paris" className="h-4 w-auto" />
          </div>

          <button aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-purple-600 transition-colors -mr-1">
            {menuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </header>

      {/* Spacer for fixed header + banner */}
      <div className="h-[84px]" />

      {/* Product Card - Modern E-commerce Vertical */}
      <section className="px-4 py-6">
        <div className="max-w-sm mx-auto">
          {/* Main Product Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header Badges */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 flex items-center justify-between">
              
              
            </div>

            {/* Product Image */}
            <div className="relative bg-gradient-to-b from-purple-50 to-white p-4">
              {/* Discount Badge */}
              
              
              <img src={productKitFull} alt="Kit Elseve Collagen Lifter" className="w-full" />
            </div>

            {/* Product Info */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <div className="text-center">
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  Lançamento Elseve
                </h1>
                <p className="text-sm font-semibold text-purple-600 mt-0.5">Collagen Lifter</p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />)}
                <span className="text-xs text-gray-500 ml-1.5">(312 avaliações)</span>
              </div>

              {/* Price */}
              

              {/* Trust Icons */}
              


              {/* Urgency */}
              <div className="text-center space-y-1">
                <p className="text-xs text-orange-600 font-semibold flex items-center justify-center gap-1">
                  
                  Apenas 7 unidades em estoque
                </p>
                <p className="text-[10px] text-gray-400">
                  👥 32 pessoas compraram nas últimas 24h
                </p>
              </div>

              {/* Period */}
              <p className="text-[10px] text-gray-400 text-center leading-relaxed pt-2 border-t border-gray-100">Período: 09/01/2026 até 11/01/2026 (horário de Brasília)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-white py-4 px-4">
        <div className="max-w-sm mx-auto text-center">
          <p className="text-xs text-gray-500 mb-2">Formas de pagamento:</p>
          <div className="flex justify-center gap-3">
            <span className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200">
              <CreditCard className="w-5 h-5 text-gray-700" />
            </span>
            <span className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200">
              <Smartphone className="w-5 h-5 text-gray-700" />
            </span>
            <span className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200">
              <Landmark className="w-5 h-5 text-gray-700" />
            </span>
            <span className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200">
              <Banknote className="w-5 h-5 text-gray-700" />
            </span>
          </div>
          <p className="text-xs text-green-600 mt-3 flex items-center justify-center gap-1 font-medium">
            <Truck className="w-3.5 h-3.5" />
            Entrega rápida para todo Brasil
          </p>
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
              Oferecemos 30 dias de garantia para você testar o produto com total segurança.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-6 px-4">
        <div className="max-w-sm mx-auto">
          <h2 className="text-center font-bold text-gray-900 mb-4">
            Por que escolher L'Oréal Paris Elseve?
          </h2>
          <div className="space-y-3">
            {benefits.map((benefit, index) => <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>)}
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
            {reviews.map((review, index) => <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {review.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'}`} />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">"{review.text}"</p>
              </div>)}
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
            {faqs.map((faq, index) => <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {openFaq === index && <div className="p-3 bg-white border-t border-gray-200">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>}
              </div>)}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-sm mx-auto">
          <Button onClick={handleResgate} className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            RESGATAR AGORA
          </Button>
        </div>
      </div>

      {/* Bottom padding for sticky button */}
      <div className="h-20" />
    </div>;
};
export default ProductPage;