import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Loader2, MapPin, User, CreditCard, Truck, Package, Zap, Lock, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getProductById, formatPrice, Product } from "@/lib/products";
import gtsm1Logo from "@/assets/gtsm1-logo.png";

// Máscaras
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

// Validações
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const shippingOptions = [
  {
    id: "pac",
    name: "PAC",
    price: 0,
    days: "8-12 dias úteis",
    icon: Package,
  },
  {
    id: "sedex",
    name: "SEDEX",
    price: 29.90,
    days: "3-5 dias úteis",
    icon: Truck,
  },
  {
    id: "express",
    name: "Expresso",
    price: 49.90,
    days: "1-2 dias úteis",
    icon: Zap,
  },
];

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("produto");
  const quantityParam = searchParams.get("quantidade");
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("pix");
  
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
  
  const [selectedShipping, setSelectedShipping] = useState("pac");
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
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
      if (!isNaN(qty) && qty > 0) {
        setQuantity(qty);
      }
    }
  }, [productId, quantityParam, navigate]);

  const fetchAddress = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;
    
    setLoadingCep(true);
    setErrors((prev) => ({ ...prev, cep: "" }));
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setErrors((prev) => ({ ...prev, cep: "CEP não encontrado" }));
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        cep: maskCEP(cleanCEP),
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));
    } catch {
      setErrors((prev) => ({ ...prev, cep: "Erro ao buscar CEP" }));
    } finally {
      setLoadingCep(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "cpf") {
      maskedValue = maskCPF(value);
      if (maskedValue.replace(/\D/g, "").length === 11) {
        if (!validateCPF(maskedValue)) {
          setErrors((prev) => ({ ...prev, cpf: "CPF inválido" }));
        } else {
          setErrors((prev) => ({ ...prev, cpf: "" }));
        }
      } else {
        setErrors((prev) => ({ ...prev, cpf: "" }));
      }
    } else if (name === "cep") {
      maskedValue = maskCEP(value);
      const cleanCEP = maskedValue.replace(/\D/g, "");
      if (cleanCEP.length === 8) {
        fetchAddress(cleanCEP);
      }
    } else if (name === "phone") {
      maskedValue = maskPhone(value);
    } else if (name === "email") {
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: "E-mail inválido" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Nome completo é obrigatório";
    }
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      newErrors.email = "E-mail válido é obrigatório";
    }
    if (!formData.cpf.trim() || !validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF válido é obrigatório";
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone válido é obrigatório";
    }
    if (!formData.cep.trim() || formData.cep.replace(/\D/g, "").length !== 8) {
      newErrors.cep = "CEP válido é obrigatório";
    }
    if (!formData.street.trim()) {
      newErrors.street = "Rua é obrigatória";
    }
    if (!formData.number.trim()) {
      newErrors.number = "Número é obrigatório";
    }
    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = "Bairro é obrigatório";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }
    if (!formData.state.trim()) {
      newErrors.state = "Estado é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!product) return;
    
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }
    
    setLoadingPayment(true);
    
    // Aqui será integrado com o gateway de pagamento
    // Por enquanto, simula o processamento
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Pedido processado! Aguardando integração com gateway.");
      
      // Futuramente: redirecionar para página de pagamento PIX
      // navigate(`/pagamento?orderId=${orderId}`);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erro ao processar pagamento");
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

  const selectedShippingOption = shippingOptions.find((s) => s.id === selectedShipping);
  const shippingPrice = selectedShippingOption?.price || 0;
  const subtotal = product.price * quantity;
  const total = subtotal + shippingPrice;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Custom Checkout Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <Link to="/">
            <img src={gtsm1Logo} alt="GTSM1" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Ambiente Seguro</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 pb-8">

        <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
          {/* Product Summary */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Resumo do Pedido
            </h2>
            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-contain bg-secondary/30 rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Quantidade: {quantity}
                </p>
                <p className="text-base font-bold text-primary mt-1">
                  {formatPrice(subtotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Data */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Dados Pessoais
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground">
                  Nome Completo *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                  E-mail *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cpf" className="text-xs font-medium text-muted-foreground">
                    CPF *
                  </Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={errors.cpf ? "border-destructive" : ""}
                  />
                  {errors.cpf && (
                    <p className="text-xs text-destructive mt-1">{errors.cpf}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">
                    Telefone *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Endereço de Entrega
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cep" className="text-xs font-medium text-muted-foreground">
                  CEP *
                </Label>
                <div className="relative">
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    maxLength={9}
                    className={errors.cep ? "border-destructive" : ""}
                  />
                  {loadingCep && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {errors.cep && (
                  <p className="text-xs text-destructive mt-1">{errors.cep}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="street" className="text-xs font-medium text-muted-foreground">
                  Rua *
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Nome da rua"
                  className={errors.street ? "border-destructive" : ""}
                />
                {errors.street && (
                  <p className="text-xs text-destructive mt-1">{errors.street}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="number" className="text-xs font-medium text-muted-foreground">
                    Número *
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={errors.number ? "border-destructive" : ""}
                  />
                  {errors.number && (
                    <p className="text-xs text-destructive mt-1">{errors.number}</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="complement" className="text-xs font-medium text-muted-foreground">
                    Complemento
                  </Label>
                  <Input
                    id="complement"
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    placeholder="Apto, bloco..."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="neighborhood" className="text-xs font-medium text-muted-foreground">
                  Bairro *
                </Label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="Bairro"
                  className={errors.neighborhood ? "border-destructive" : ""}
                />
                {errors.neighborhood && (
                  <p className="text-xs text-destructive mt-1">{errors.neighborhood}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">
                    Cidade *
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Cidade"
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1">{errors.city}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="state" className="text-xs font-medium text-muted-foreground">
                    UF *
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="UF"
                    maxLength={2}
                    className={errors.state ? "border-destructive" : ""}
                  />
                  {errors.state && (
                    <p className="text-xs text-destructive mt-1">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Options */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Opções de Entrega
            </h2>
            
            <RadioGroup
              value={selectedShipping}
              onValueChange={setSelectedShipping}
              className="space-y-3"
            >
              {shippingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.id}
                    htmlFor={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedShipping === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{option.name}</p>
                      <p className="text-xs text-muted-foreground">{option.days}</p>
                    </div>
                    <span className={`text-sm font-bold ${option.price === 0 ? "text-primary" : "text-foreground"}`}>
                      {option.price === 0 ? "GRÁTIS" : formatPrice(option.price)}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Forma de Pagamento
            </h2>
            
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="space-y-3"
            >
              <label
                htmlFor="pix"
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPaymentMethod === "pix"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <RadioGroupItem value="pix" id="pix" />
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">PIX</p>
                  <p className="text-xs text-muted-foreground">Aprovação imediata</p>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  5% OFF
                </span>
              </label>
              
              <label
                htmlFor="credit"
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPaymentMethod === "credit"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <RadioGroupItem value="credit" id="credit" />
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Cartão de Crédito</p>
                  <p className="text-xs text-muted-foreground">Até 12x sem juros</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-sm font-bold text-foreground mb-3">Resumo</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className={shippingPrice === 0 ? "text-primary font-medium" : "text-foreground"}>
                  {shippingPrice === 0 ? "GRÁTIS" : formatPrice(shippingPrice)}
                </span>
              </div>
              {selectedPaymentMethod === "pix" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto PIX (5%)</span>
                  <span className="text-primary font-medium">-{formatPrice(subtotal * 0.05)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(selectedPaymentMethod === "pix" ? total * 0.95 : total)}
                  </span>
                </div>
                {selectedPaymentMethod === "credit" && (
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    ou 12x de {formatPrice(total / 12)} sem juros
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loadingPayment}
            className="w-full h-14 text-base font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl"
          >
            {loadingPayment ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              `FINALIZAR COMPRA`
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
