import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, MapPin, User, Lock, QrCode, CheckCircle2, ChevronRight, ShieldCheck, Truck, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getProductById, formatPrice, Product } from "@/lib/products";
import { Link } from "react-router-dom";

// ── Máscaras ─────────────────────────────────────────────────────────────────
const maskCPF = (v: string) =>
  v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2")
   .replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");

const maskCEP = (v: string) =>
  v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1");

const maskPhone = (v: string) =>
  v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
   .replace(/(-\d{4})\d+?$/, "$1");

// ── Validações ────────────────────────────────────────────────────────────────
const validateCPF = (cpf: string): boolean => {
  const c = cpf.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(c[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 || r === 11 ? 0 : r;
  };
  return calc(9) === parseInt(c[9]) && calc(10) === parseInt(c[10]);
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── Discount tiers (igual à página do produto) ────────────────────────────────
const DISCOUNT_TIERS = [
  { min: 1,  max: 5,  unitPrice: 37.82, label: "1 a 5 unid." },
  { min: 6,  max: 11, unitPrice: 34.15, label: "6 a 11 unid." },
  { min: 12, max: 39, unitPrice: 28.49, label: "12 a 39 unid." },
  { min: 40, max: Infinity, unitPrice: 24.68, label: "40+ unid." },
];

const getTierPrice = (qty: number) =>
  (DISCOUNT_TIERS.find(t => qty >= t.min && qty <= t.max) || DISCOUNT_TIERS[0]).unitPrice;

// ─────────────────────────────────────────────────────────────────────────────

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("produto");
  const quantityParam = searchParams.get("quantidade");

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cpf: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (productId) {
      const found = getProductById(productId);
      if (found) {
        setProduct(found);
      } else {
        toast.error("Produto não encontrado");
        navigate("/produtos");
      }
    } else {
      toast.error("Nenhum produto selecionado");
      navigate("/produtos");
    }
    if (quantityParam) {
      const qty = parseInt(quantityParam);
      if (!isNaN(qty) && qty > 0) setQuantity(qty);
    }
  }, [productId, quantityParam, navigate]);

  const fetchAddress = async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setLoadingCep(true);
    setErrors(prev => ({ ...prev, cep: "" }));
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data.erro) { setErrors(prev => ({ ...prev, cep: "CEP não encontrado" })); return; }
      setFormData(prev => ({
        ...prev,
        cep: maskCEP(clean),
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));
    } catch {
      setErrors(prev => ({ ...prev, cep: "Erro ao buscar CEP" }));
    } finally {
      setLoadingCep(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "cpf") {
      v = maskCPF(value);
      if (v.replace(/\D/g, "").length === 11)
        setErrors(prev => ({ ...prev, cpf: validateCPF(v) ? "" : "CPF inválido" }));
      else setErrors(prev => ({ ...prev, cpf: "" }));
    } else if (name === "cep") {
      v = maskCEP(value);
      if (v.replace(/\D/g, "").length === 8) fetchAddress(v);
    } else if (name === "phone") {
      v = maskPhone(value);
    } else if (name === "email") {
      setErrors(prev => ({ ...prev, email: value && !validateEmail(value) ? "E-mail inválido" : "" }));
    }
    setFormData(prev => ({ ...prev, [name]: v }));
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) e.fullName = "Nome completo é obrigatório";
    if (!formData.email.trim() || !validateEmail(formData.email)) e.email = "E-mail válido é obrigatório";
    if (!formData.cpf.trim() || !validateCPF(formData.cpf)) e.cpf = "CPF válido é obrigatório";
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) e.phone = "Telefone válido é obrigatório";
    if (!formData.cep.trim() || formData.cep.replace(/\D/g, "").length !== 8) e.cep = "CEP válido é obrigatório";
    if (!formData.street.trim()) e.street = "Rua é obrigatória";
    if (!formData.number.trim()) e.number = "Número é obrigatório";
    if (!formData.neighborhood.trim()) e.neighborhood = "Bairro é obrigatório";
    if (!formData.city.trim()) e.city = "Cidade é obrigatória";
    if (!formData.state.trim()) e.state = "Estado é obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!product) return;
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }
    setLoadingPayment(true);
    try {
      const unitPrice = getTierPrice(quantity);
      const totalAmount = unitPrice * quantity;
      const amountInCents = Math.round(totalAmount * 100);

      const paymentData = {
        amount: amountInCents,
        paymentMethod: "pix",
        customer: {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          document: formData.cpf.replace(/\D/g, ""),
          phone: formData.phone.replace(/\D/g, ""),
          streetName: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.cep.replace(/\D/g, ""),
        },
        items: [{
          title: product.name,
          quantity,
          unitPrice: Math.round(unitPrice * 100),
          operationType: 1,
        }],
      };

      sessionStorage.setItem("checkoutOrder", JSON.stringify({
        product: { id: product.id, name: product.name, image: product.image, price: unitPrice },
        quantity,
        customer: { name: formData.fullName, email: formData.email, phone: formData.phone, cpf: formData.cpf },
        address: { cep: formData.cep, street: formData.street, number: formData.number, complement: formData.complement, neighborhood: formData.neighborhood, city: formData.city, state: formData.state },
        shipping: { option: "pac", price: 0 },
        paymentMethod: "pix",
        total: totalAmount,
      }));

      const { data, error } = await supabase.functions.invoke("create-pix-payment", { body: paymentData });

      if (error || data?.error) {
        console.error("Payment error:", error || data);
        toast.error("Erro ao processar pagamento. Tente novamente.");
        return;
      }

      if (!data?.pix?.payload) {
        toast.error("Resposta inválida do gateway de pagamento.");
        return;
      }

      sessionStorage.setItem("pixPayment", JSON.stringify({
        id: data.id,
        payload: data.pix.payload,
        qrCodeUrl: data.pix.qrCodeUrl,
        expiresAt: data.pix.expiresAt,
        amount: data.amount,
      }));

      navigate("/pagamento-pix");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const unitPrice = getTierPrice(quantity);
  const originalPrice = product.originalPrice || 189.90;
  const discountPct = Math.round((1 - unitPrice / originalPrice) * 100);
  const total = unitPrice * quantity;

  const successColor = "hsl(142 70% 35%)";

  const Field = ({ label, name, placeholder, type = "text", error, half = false }: {
    label: string; name: string; placeholder: string; type?: string; error?: string; half?: boolean;
  }) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <Label className="text-xs font-semibold text-foreground/80 mb-1 block">{label}</Label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        value={(formData as Record<string, string>)[name]}
        onChange={handleInputChange}
        className={`h-10 text-sm ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header simplificado do checkout */}
      <header className="sticky top-0 z-30 border-b border-white/20" style={{ backgroundColor: 'hsl(270 55% 38%)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-7 h-7 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-yellow-300/30 animate-pulse" />
              <div className="absolute inset-0.5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(45 100% 65%), hsl(45 100% 45%))' }}>
                <Moon className="h-3.5 w-3.5 drop-shadow-sm" style={{ color: 'hsl(270 55% 20%)', fill: 'hsl(270 55% 20%)' }} />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-semibold text-yellow-300 tracking-widest uppercase">Feira da</span>
              <span className="text-sm font-black text-white tracking-tight">Madrugada SP</span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
            <Lock className="h-3.5 w-3.5 text-yellow-300" />
            <span>Compra 100% segura</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ── Left: Form ─────────────────────────────────────────── */}
        <div className="space-y-4 order-2 lg:order-1">

          {/* Dados pessoais */}
          <section className="bg-card rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: 'hsl(270 55% 35%)' }}>1</div>
              <h2 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-muted-foreground" /> Dados pessoais
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome completo *" name="fullName" placeholder="Seu nome completo" error={errors.fullName} />
              <Field label="E-mail *" name="email" placeholder="seu@email.com" type="email" error={errors.email} />
              <Field label="CPF *" name="cpf" placeholder="000.000.000-00" error={errors.cpf} half />
              <Field label="Telefone / WhatsApp *" name="phone" placeholder="(00) 00000-0000" error={errors.phone} half />
            </div>
          </section>

          {/* Endereço */}
          <section className="bg-card rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: 'hsl(270 55% 35%)' }}>2</div>
              <h2 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" /> Endereço de entrega
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* CEP */}
              <div className="col-span-1">
                <Label className="text-xs font-semibold text-foreground/80 mb-1 block">CEP *</Label>
                <div className="relative">
                  <Input
                    name="cep"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className={`h-10 text-sm pr-8 ${errors.cep ? "border-destructive" : ""}`}
                  />
                  {loadingCep && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
                {errors.cep && <p className="text-xs text-destructive mt-0.5">{errors.cep}</p>}
              </div>
              <Field label="Rua *" name="street" placeholder="Nome da rua" error={errors.street} />
              <Field label="Número *" name="number" placeholder="Nº" error={errors.number} half />
              <Field label="Complemento" name="complement" placeholder="Apto, bloco..." half />
              <Field label="Bairro *" name="neighborhood" placeholder="Bairro" error={errors.neighborhood} />
              <Field label="Cidade *" name="city" placeholder="Cidade" error={errors.city} half />
              <Field label="Estado *" name="state" placeholder="UF" error={errors.state} half />
            </div>
          </section>

          {/* Frete */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: 'hsl(270 55% 35%)' }}>3</div>
              <h2 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-muted-foreground" /> Envio
              </h2>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: successColor }} />
              <div>
                <p className="text-sm font-bold" style={{ color: successColor }}>🚚 Frete Grátis — PAC (8-12 dias úteis)</p>
                <p className="text-xs text-muted-foreground">Promoção exclusiva para pagamento via PIX</p>
              </div>
              <span className="ml-auto text-sm font-black" style={{ color: successColor }}>R$ 0,00</span>
            </div>
          </section>

          {/* Pagamento — só PIX */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ background: 'hsl(270 55% 35%)' }}>4</div>
              <h2 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <QrCode className="h-4 w-4 text-muted-foreground" /> Pagamento
              </h2>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
              {/* PIX SVG */}
              <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.385 14.765-5.373 20.137 0l76.993 76.992c14.192 14.192 33.064 22 53.12 22h15.098l-97.138 97.126c-29.548 29.56-77.478 29.56-107.026 0L106.42 391.19h6.15z" fill="hsl(152 80% 30%)"/>
                <path d="M112.57 120.81h-6.15L203.568 23.685c29.548-29.56 77.478-29.56 107.026 0L407.733 120.81H392.62c-20.056 0-38.928 7.808-53.12 22l-76.992 76.992c-5.551 5.55-14.587 5.55-20.137 0l-76.693-76.693c-14.193-14.191-33.065-21.999-53.109-21.999z" fill="hsl(152 80% 30%)"/>
                <path d="M23.685 204.567L75.898 152.354h36.672c13.417 0 26.027 5.22 35.52 14.713l76.693 76.693c14.624 14.624 40.065 14.636 54.701 0l76.98-76.992c9.493-9.493 22.104-14.713 35.52-14.713h42.709l52.526 52.512c29.56 29.548 29.56 77.478 0 107.026l-52.526 52.525h-42.709c-13.416 0-26.027-5.22-35.52-14.712l-76.98-76.993c-14.648-14.648-40.065-14.636-54.701 0l-76.693 76.693c-9.493 9.492-22.103 14.712-35.52 14.712H75.898L23.685 311.433c-29.56-29.548-29.56-77.478 0-107.026z" fill="hsl(152 80% 30%)"/>
              </svg>
              <div>
                <p className="text-sm font-bold" style={{ color: successColor }}>Pix — Aprovação imediata</p>
                <p className="text-xs text-muted-foreground">QR Code gerado após confirmação do pedido</p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Right: Order Summary ────────────────────────────────── */}
        <div className="space-y-4 order-1 lg:order-2 lg:sticky lg:top-20">
          <section className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-sm text-foreground">Resumo do pedido</h2>

            {/* Product row */}
            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg border border-border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Qtd: {quantity}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-black text-foreground">{formatPrice(unitPrice)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
                  <span className="text-[10px] font-bold bg-destructive text-destructive-foreground px-1 rounded">-{discountPct}%</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{quantity}x {formatPrice(unitPrice)}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between" style={{ color: successColor }}>
                <span className="font-medium">🚚 Frete</span>
                <span className="font-bold">Grátis</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Desconto aplicado</span>
                <span className="text-destructive font-semibold">-{formatPrice((originalPrice - unitPrice) * quantity)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground">Total</span>
              <div className="text-right">
                <p className="text-xl font-black text-foreground">{formatPrice(total)}</p>
                <p className="text-[10px] font-medium" style={{ color: successColor }}>🔒 via PIX • Frete Grátis</p>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={handleSubmit}
              disabled={loadingPayment}
              className="w-full h-12 text-sm font-bold rounded-xl flex items-center justify-center gap-2"
              style={{ background: 'hsl(152 80% 30%)', color: '#fff' }}
            >
              {loadingPayment ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Gerar QR Code PIX
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: successColor }} />
                Compra segura
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Lock className="h-3.5 w-3.5" style={{ color: successColor }} />
                Dados protegidos
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center">
        <p className="text-[10px] text-muted-foreground">
          © 2025 GTSM1 Store · Todos os direitos reservados · Ambiente 100% seguro
        </p>
      </footer>
    </div>
  );
}
