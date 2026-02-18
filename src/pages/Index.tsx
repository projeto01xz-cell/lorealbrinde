import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Truck, Shield, RotateCcw, Clock, Check, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { getFeaturedProducts, formatPrice, calculateDiscount } from "@/lib/products";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();
  // Use the first featured product as the hero product
  const allFeatured = getFeaturedProducts();
  const product = allFeatured[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.originalPrice);
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleBuyNow = () => {
    navigate(`/checkout?produto=${product.id}&quantidade=${quantity}`);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => prev === 0 ? productImages.length - 1 : prev - 1);
  };
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => prev === productImages.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Product Section - Two Column on Desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:grid lg:grid-cols-2 lg:gap-8 lg:p-8"
          >
            {/* Image Gallery */}
            <div className="relative bg-card lg:rounded-xl overflow-hidden">
              {/* Badge */}
              {discount > 0 && (
                <span className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded">
                  Promoção
                </span>
              )}

              {/* Main Image */}
              <div className="relative aspect-square">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImageIndex === index ? 'border-primary' : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="px-4 lg:px-0 py-6 space-y-5">
              {/* Category */}
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                {product.category === 'ventiladores' ? 'Ventiladores' : product.category}
              </span>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviews} avaliações)</span>
              </div>

              {/* Price Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Pagamento via Pix
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    Aprovação Instantânea
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {product.originalPrice && (
                  <div className="flex items-center gap-1 text-sm text-primary font-medium">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Economia de {formatPrice(product.originalPrice - product.price)}
                  </div>
                )}

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  Pagamento instantâneo • Aprovação em segundos
                </p>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuyNow}
                className="btn-cart text-lg py-4 rounded-xl font-bold"
              >
                Comprar Agora
              </button>

              {/* Trust Features */}
              <div className="space-y-3">
                {[
                  { icon: Truck, title: "Frete Grátis", desc: "Para todo o Brasil", color: "text-primary" },
                  { icon: Clock, title: "Entrega em até 12 dias úteis", desc: "Envio imediato após confirmação", color: "text-foreground" },
                  { icon: Shield, title: "Garantia de 90 dias", desc: "Suporte direto com a loja", color: "text-foreground" },
                  { icon: RotateCcw, title: "Compra 100% Segura", desc: "Proteção ao consumidor garantida", color: "text-foreground" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-card border border-border rounded-lg">
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${item.color}`} />
                    <div>
                      <p className={`text-sm font-semibold ${item.color}`}>{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <span className="text-sm font-medium text-foreground">Quantidade</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-foreground font-semibold bg-card border-x border-border">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Mini Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Compra\nSegura" },
                  { icon: Truck, label: "Frete\nGrátis" },
                  { icon: RotateCcw, label: "7 dias\np/ troca" },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-secondary/50 rounded-lg text-center">
                    <badge.icon className="h-5 w-5 text-primary" />
                    <span className="text-[11px] font-medium text-foreground leading-tight whitespace-pre-line">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <div className="px-4 lg:px-8 py-8 bg-card mt-2 lg:mt-0 lg:rounded-xl lg:mx-8 lg:mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Descrição do Produto</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
              {product.description}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="px-4 lg:px-8 py-8 bg-card mt-2 lg:mt-0 lg:rounded-xl lg:mx-8 lg:mb-8">
            <h2 className="text-lg font-bold text-foreground mb-6">Avaliações dos Clientes</h2>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{product.rating}</p>
                <p className="text-sm text-muted-foreground">{product.reviews} avaliações</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-3">{rating}</span>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${rating === 5 ? 68 : rating === 4 ? 22 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{rating === 5 ? 68 : rating === 4 ? 22 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-4">
              {[
              { name: 'João S.', rating: 5, date: '10/01/2025', comment: 'Ventilador incrível! Muito silencioso e faz um vento enorme. Vale muito a pena!', verified: true },
                { name: 'Maria L.', rating: 5, date: '08/01/2025', comment: 'Chegou rápido, montagem super fácil. Está fresquinho aqui em casa o dia todo!', verified: true },
                { name: 'Carlos M.', rating: 4, date: '05/01/2025', comment: 'Ótimo custo-benefício, bem potente. Recomendo muito para quem quer economizar!', verified: true },
              ].map((review, index) => (
                <div key={index} className="p-4 border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{review.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    {review.verified && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="h-3 w-3" /> Verificado
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Section */}
          <div className="px-4 lg:px-8 py-8 bg-card mt-2 lg:mt-0 lg:rounded-xl lg:mx-8 lg:mb-8">
            <h2 className="text-lg font-bold text-foreground mb-6 text-center">Compre com Confiança</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Shield, title: "Compra Segura", desc: "Site protegido com criptografia SSL" },
                { icon: Clock, title: "Pagamento Seguro", desc: "Pix com aprovação instantânea" },
                { icon: Check, title: "Garantia de Qualidade", desc: "Produto original com garantia" },
                { icon: ShoppingCart, title: "Atendimento", desc: "Suporte via chat e e-mail" },
                { icon: RotateCcw, title: "Devoluções", desc: "Até 7 dias para devolver" },
                { icon: Shield, title: "Dados Protegidos", desc: "Privacidade e segurança total" },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="px-4 lg:px-8 py-8 bg-card mt-2 lg:mt-0 lg:rounded-xl lg:mx-8 lg:mb-8">
            <h2 className="text-lg font-bold text-foreground mb-2 text-center">Perguntas Frequentes</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Tudo o que você precisa saber sobre o produto, entrega, pagamento e garantia.
            </p>
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
              {[
                { q: "Quanto tempo demora para a entrega chegar?", a: "O prazo de entrega é de até 12 dias úteis após a confirmação do pagamento. O envio é feito imediatamente após a aprovação." },
                { q: "Qual a forma de pagamento aceita?", a: "Aceitamos pagamento via PIX (aprovação instantânea) e cartão de crédito em até 12x." },
                { q: "Posso devolver se o produto não atender minhas expectativas?", a: "Sim! Você tem até 7 dias corridos após o recebimento para solicitar a devolução, conforme o Código de Defesa do Consumidor." },
                { q: "O produto possui garantia?", a: "Sim, todos os nossos produtos possuem garantia de 90 dias diretamente com a loja, além da garantia legal." },
                { q: "O frete é realmente grátis?", a: "Sim! O frete é 100% gratuito para todo o Brasil, sem valor mínimo de compra." },
                { q: "Como funciona o rastreamento do pedido?", a: "Após o envio, você receberá o código de rastreamento por e-mail para acompanhar a entrega em tempo real." },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm font-medium text-foreground text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}