import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, Truck, Shield, RotateCcw, Clock, Check,
  ChevronLeft, ChevronRight, Minus, Plus, Flame,
  ShoppingCart, MapPin, Package, CreditCard, ThumbsUp,
} from "lucide-react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { getFeaturedProducts, formatPrice, calculateDiscount } from "@/lib/products";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

const PURCHASE_NOTIFICATIONS = [
  { name: "Maria", city: "São Paulo" },
  { name: "João", city: "Rio de Janeiro" },
  { name: "Ana", city: "Belo Horizonte" },
  { name: "Carlos", city: "Curitiba" },
  { name: "Fernanda", city: "Salvador" },
  { name: "Lucas", city: "Fortaleza" },
  { name: "Juliana", city: "Porto Alegre" },
  { name: "Roberto", city: "Manaus" },
  { name: "Patrícia", city: "Recife" },
  { name: "Diego", city: "Goiânia" },
  { name: "Camila", city: "Belém" },
  { name: "Rafael", city: "Florianópolis" },
  { name: "Larissa", city: "Maceió" },
  { name: "Thiago", city: "Natal" },
  { name: "Bruna", city: "Teresina" },
  { name: "Eduardo", city: "Campo Grande" },
  { name: "Vanessa", city: "João Pessoa" },
  { name: "Marcelo", city: "Aracaju" },
  { name: "Letícia", city: "São Luís" },
  { name: "Felipe", city: "Vitória" },
];

function getCountdownTarget(): number {
  const key = "countdown_target";
  const maxMs = 10 * 60 * 60 * 1000;
  const stored = sessionStorage.getItem(key);
  if (stored) {
    const val = Number(stored);
    if (val - Date.now() <= maxMs) return val;
  }
  const target = Date.now() + maxMs;
  sessionStorage.setItem(key, String(target));
  return target;
}

export default function Index() {
  const navigate = useNavigate();
  const allFeatured = getFeaturedProducts();
  const product = allFeatured[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ h: 10, m: 0, s: 0 });
  const [activeNotif, setActiveNotif] = useState<{ name: string; city: string } | null>(null);

  useEffect(() => {
    const target = getCountdownTarget();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let usedIndexes: number[] = [];
    const showNotif = () => {
      let idx = Math.floor(Math.random() * PURCHASE_NOTIFICATIONS.length);
      if (usedIndexes.includes(idx)) idx = (idx + 1) % PURCHASE_NOTIFICATIONS.length;
      usedIndexes = [...usedIndexes.slice(-5), idx];
      setActiveNotif(PURCHASE_NOTIFICATIONS[idx]);
      setTimeout(() => setActiveNotif(null), 3500);
    };
    const first = setTimeout(showNotif, 3000);
    let repeat: ReturnType<typeof setTimeout>;
    const schedule = () => { repeat = setTimeout(() => { showNotif(); schedule(); }, 5000); };
    const scheduleStart = setTimeout(schedule, 3000);
    return () => { clearTimeout(first); clearTimeout(repeat!); clearTimeout(scheduleStart); };
  }, []);

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.originalPrice);
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleBuyNow = () => navigate(`/checkout?produto=${product.id}&quantidade=${quantity}`);
  const handlePrevImage = () => setSelectedImageIndex((p) => (p === 0 ? productImages.length - 1 : p - 1));
  const handleNextImage = () => setSelectedImageIndex((p) => (p === productImages.length - 1 ? 0 : p + 1));

  const mlBlue = "hsl(210 100% 40%)";

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-0">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-2 hidden lg:block">
          <p className="text-xs text-muted-foreground">
            <span className="ml-link cursor-pointer">Início</span> &gt;{" "}
            <span className="ml-link cursor-pointer">Ventiladores</span> &gt;{" "}
            <span className="text-foreground">{product.name}</span>
          </p>
        </div>

        {/* Main Product Layout */}
        <div className="max-w-7xl mx-auto lg:px-4 lg:pb-8">
          <div className="lg:flex lg:gap-4 lg:items-start">

            {/* LEFT: Gallery + Description */}
            <div className="lg:flex-1 min-w-0">
              {/* Gallery Card */}
              <div className="bg-card lg:rounded-xl lg:border lg:border-border overflow-hidden">
                {/* Badges */}
                <div className="flex items-center gap-2 px-4 pt-4">
                  {discount > 0 && (
                    <span className="text-xs font-bold px-2 py-1 rounded text-destructive-foreground bg-destructive">
                      🔥 QUEIMÃO
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: 'hsl(145 63% 36%)', backgroundColor: 'hsl(145 63% 36% / 0.1)' }}>
                    Frete Grátis
                  </span>
                </div>

                {/* Main Image */}
                <div className="relative aspect-square max-h-[70vw] md:max-h-[500px] mx-auto flex items-center justify-center px-6 py-4">
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:bg-secondary transition-colors shadow-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide justify-center">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedImageIndex === index
                          ? "border-foreground"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info (mobile only - shown below gallery) */}
              <div className="lg:hidden px-4 py-5 bg-card mt-2 space-y-4">
                <MobileProductInfo product={product} discount={discount} timeLeft={timeLeft} quantity={quantity} setQuantity={setQuantity} handleBuyNow={handleBuyNow} mlBlue={mlBlue} />
              </div>

              {/* Description */}
              <div className="bg-card mt-2 lg:mt-4 lg:rounded-xl lg:border lg:border-border px-4 lg:px-6 py-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-3 border-b border-border">
                  Descrição do produto
                </h2>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {product.description}
                </div>
              </div>

              {/* Specs */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="bg-card mt-2 lg:mt-4 lg:rounded-xl lg:border lg:border-border px-4 lg:px-6 py-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 pb-3 border-b border-border">
                    Especificações
                  </h2>
                  <div className="grid grid-cols-1 divide-y divide-border">
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <div key={i} className="flex py-3 gap-4">
                        <span className="text-sm text-muted-foreground w-36 flex-shrink-0">{key}</span>
                        <span className="text-sm text-foreground font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-card mt-2 lg:mt-4 lg:rounded-xl lg:border lg:border-border px-4 lg:px-6 py-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-3 border-b border-border">
                  Opiniões do produto
                </h2>

                {/* Rating summary */}
                <div className="flex items-center gap-6 mb-6 p-4 bg-secondary/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-foreground">{product.rating}</p>
                    <div className="flex justify-center mt-1 gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{product.reviews?.toLocaleString("pt-BR")} opiniões</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map((rating) => {
                      const pct = rating === 5 ? 68 : rating === 4 ? 22 : rating === 3 ? 7 : rating === 2 ? 2 : 1;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`h-2.5 w-2.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                            ))}
                          </div>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-6">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review cards */}
                <div className="space-y-4">
                  {[
                    { name: "Fernanda R.", rating: 5, date: "29/04/2025", comment: "Maravilhoso, ótima qualidade e silencioso. O melhor ventilador que já tive em casa!", verified: true, helpful: 47 },
                    { name: "Carlos M.", rating: 5, date: "17/01/2026", comment: "Motor mais potente, hélice bem travada e montagem facilíssima. Tem mais volume de ar do que ventiladores de 40cm. É o melhor do mercado!", verified: true, helpful: 31 },
                    { name: "Roberto S.", rating: 4, date: "26/09/2025", comment: "Ventilador muito potente, ventila bastante. Um técnico me recomendou pela durabilidade e qualidade. Recomendo!", verified: true, helpful: 18 },
                  ].map((review, index) => (
                    <div key={index} className="border-t border-border pt-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-foreground">{review.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{review.name}</p>
                            <div className="flex gap-0.5 mt-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{review.date}</span>
                      </div>
                      <p className="text-sm text-foreground mt-2 leading-relaxed">{review.comment}</p>
                      {review.verified && (
                        <p className="text-xs mt-2 flex items-center gap-1" style={{ color: mlBlue }}>
                          <Check className="h-3 w-3" /> Compra verificada
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">Útil?</span>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5 transition-colors">
                          <ThumbsUp className="h-3 w-3" /> {review.helpful}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-card mt-2 lg:mt-4 lg:rounded-xl lg:border lg:border-border px-4 lg:px-6 py-6 lg:mb-0">
                <h2 className="text-xl font-semibold text-foreground mb-4 pb-3 border-b border-border">
                  Perguntas frequentes
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    { q: "Quanto tempo demora para a entrega chegar?", a: "O prazo de entrega é de até 12 dias úteis após a confirmação do pagamento. O envio é feito imediatamente após a aprovação." },
                    { q: "Qual a forma de pagamento aceita?", a: "Aceitamos pagamento via PIX com aprovação instantânea." },
                    { q: "Posso devolver se o produto não atender minhas expectativas?", a: "Sim! Você tem até 7 dias corridos após o recebimento para solicitar a devolução, conforme o Código de Defesa do Consumidor." },
                    { q: "O produto possui garantia?", a: "Sim, todos os nossos produtos possuem garantia de 90 dias diretamente com a loja." },
                    { q: "O frete é realmente grátis?", a: "Sim! O frete é 100% gratuito para todo o Brasil, sem valor mínimo de compra." },
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

            {/* RIGHT: Purchase panel (desktop only) */}
            <div className="hidden lg:block w-[320px] xl:w-[360px] flex-shrink-0 space-y-3">
              <DesktopBuyPanel product={product} discount={discount} timeLeft={timeLeft} quantity={quantity} setQuantity={setQuantity} handleBuyNow={handleBuyNow} mlBlue={mlBlue} />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Sticky Buy Button - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t border-border p-3 flex items-center gap-3 shadow-2xl">
        <div className="flex flex-col min-w-0">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through leading-none">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="text-xl font-extrabold text-foreground leading-tight">{formatPrice(product.price)}</span>
        </div>
        <button onClick={handleBuyNow} className="btn-buy flex-1 rounded-lg font-bold text-base">
          Comprar agora
        </button>
      </div>

      {/* Purchase Notification Toast */}
      <AnimatePresence>
        {activeNotif && (
          <motion.div
            key={activeNotif.name + activeNotif.city}
            initial={{ opacity: 0, x: -100, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-20 left-3 z-[60] lg:bottom-6 max-w-[300px] w-[calc(100vw-24px)] lg:w-[300px]"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-1 w-full" style={{ backgroundColor: 'hsl(45 100% 51%)' }} />
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-base font-extrabold text-foreground">{activeNotif.name[0]}</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(145 63% 36%)' }}>
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {activeNotif.name} <span className="font-normal text-muted-foreground text-xs">de {activeNotif.city}</span>
                  </p>
                  <p className="text-xs text-foreground leading-tight mt-0.5">acabou de comprar! 🔥</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 pb-3 -mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'hsl(145 63% 36%)' }} />
                  <span className="text-[11px] text-muted-foreground">há poucos instantes</span>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ── */

function CountdownBanner({ timeLeft }: { timeLeft: { h: number; m: number; s: number } }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'hsl(0 84% 50% / 0.08)', border: '1px solid hsl(0 84% 50% / 0.2)' }}>
      <Flame className="h-4 w-4 flex-shrink-0 animate-pulse text-destructive" />
      <span className="text-xs font-bold text-destructive flex-shrink-0">Oferta termina em:</span>
      <div className="flex items-center gap-0.5 font-mono ml-auto">
        {[
          { v: timeLeft.h, label: "h" },
          { v: timeLeft.m, label: "m" },
          { v: timeLeft.s, label: "s" },
        ].map(({ v, label }, i) => (
          <span key={i} className="flex items-center gap-0.5">
            <span className="bg-destructive text-destructive-foreground font-extrabold text-sm px-1.5 py-0.5 rounded min-w-[1.6rem] text-center tabular-nums">
              {String(v).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-destructive font-semibold">{label}</span>
            {i < 2 && <span className="font-bold text-destructive mx-0.5">:</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
      ))}
    </div>
  );
}

function PriceBlock({ product, discount, mlBlue }: { product: any; discount: number; mlBlue: string }) {
  return (
    <div className="space-y-1">
      {product.originalPrice && (
        <p className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
      )}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-foreground">{formatPrice(product.price)}</span>
        {discount > 0 && (
          <span className="text-sm font-semibold text-destructive">{discount}% OFF</span>
        )}
      </div>
      <p className="text-xs" style={{ color: mlBlue }}>Pagamento via PIX • Aprovação instantânea</p>
    </div>
  );
}

function ShippingBox({ mlBlue }: { mlBlue: string }) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <p className="text-sm font-semibold text-foreground">Frete e envio</p>
      <div className="flex items-start gap-3">
        <Truck className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(145 63% 36%)' }} />
        <div>
          <p className="text-sm font-bold" style={{ color: 'hsl(145 63% 36%)' }}>Frete grátis</p>
          <p className="text-xs text-muted-foreground">Envio para todo o Brasil</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Package className="h-5 w-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
        <div>
          <p className="text-sm text-foreground">Chega em até <span className="font-semibold">12 dias úteis</span></p>
          <p className="text-xs text-muted-foreground">Após confirmação do pagamento</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Calcule o prazo exato pelo seu CEP no checkout</p>
      </div>
    </div>
  );
}

function QuantitySelector({ quantity, setQuantity }: { quantity: number; setQuantity: (q: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Quantidade:</span>
      <div className="flex items-center border border-border rounded-lg overflow-hidden">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold bg-card border-x border-border">{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="space-y-2">
      {[
        { icon: Shield, label: "Compra protegida", sub: "Garantia de reembolso" },
        { icon: RotateCcw, label: "Devolução grátis", sub: "Até 7 dias após recebimento" },
        { icon: CreditCard, label: "Pagamento seguro", sub: "Seus dados protegidos" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <item.icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Desktop panel */
function DesktopBuyPanel({ product, discount, timeLeft, quantity, setQuantity, handleBuyNow, mlBlue }: any) {
  return (
    <>
      {/* Main buy card */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-sm">
        {/* Condition */}
        <p className="text-xs text-muted-foreground">
          <span className="ml-link" style={{ color: mlBlue }}>Novo</span> | +2.800 vendidos
        </p>

        {/* Title */}
        <h1 className="text-lg font-semibold text-foreground leading-snug">{product.name}</h1>

        {/* Stars */}
        <div className="flex items-center gap-2">
          <StarRow rating={product.rating} />
          <span className="text-sm font-semibold text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews?.toLocaleString("pt-BR")})</span>
        </div>

        {/* Countdown */}
        <CountdownBanner timeLeft={timeLeft} />

        {/* Price */}
        <PriceBlock product={product} discount={discount} mlBlue={mlBlue} />

        {/* Quantity */}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

        {/* CTAs */}
        <div className="space-y-2 pt-1">
          <button onClick={handleBuyNow} className="btn-buy rounded-lg font-semibold text-[15px]">
            Comprar agora
          </button>
          <button onClick={handleBuyNow} className="btn-secondary-ml rounded-lg text-[15px]">
            Adicionar ao carrinho
          </button>
        </div>
      </div>

      {/* Shipping card */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <ShippingBox mlBlue={mlBlue} />
      </div>

      {/* Trust */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <TrustBadges />
      </div>
    </>
  );
}

/* Mobile info block */
function MobileProductInfo({ product, discount, timeLeft, quantity, setQuantity, handleBuyNow, mlBlue }: any) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Novo | +2.800 vendidos</p>
      <h1 className="text-xl font-semibold text-foreground leading-snug">{product.name}</h1>
      <div className="flex items-center gap-2">
        <StarRow rating={product.rating} />
        <span className="text-sm font-semibold">{product.rating}</span>
        <span className="text-xs text-muted-foreground">({product.reviews?.toLocaleString("pt-BR")})</span>
      </div>
      <CountdownBanner timeLeft={timeLeft} />
      <PriceBlock product={product} discount={discount} mlBlue={mlBlue} />
      <ShippingBox mlBlue={mlBlue} />
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      <TrustBadges />
    </div>
  );
}
