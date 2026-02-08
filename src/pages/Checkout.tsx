import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Loader2, MapPin, User, CreditCard, Truck, Package, Zap, Lock, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getProductById, formatPrice, Product } from "@/lib/products";
import gtsm1Logo from "@/assets/gtsm1-logo.png";

// Card masks
const maskCardNumber = (value: string) => {
  return value.replace(/\D/g, "").replace(/(\d{4})(\d)/, "$1 $2").replace(/(\d{4}) (\d{4})(\d)/, "$1 $2 $3").replace(/(\d{4}) (\d{4}) (\d{4})(\d)/, "$1 $2 $3 $4").replace(/(\d{4} \d{4} \d{4} \d{4})\d+?$/, "$1");
};
const maskExpiry = (value: string) => {
  return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\/\d{2})\d+?$/, "$1");
};

// Card validations
const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\D/g, "");
  return cleanNumber.length >= 13 && cleanNumber.length <= 19;
};
const validateExpiry = (expiry: string): boolean => {
  const parts = expiry.split("/");
  if (parts.length !== 2) return false;
  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10);
  if (month < 1 || month > 12) return false;
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
  return true;
};

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
  const [installments, setInstallments] = useState(1);
  const [cardData, setCardData] = useState({
    number: "",
    holderName: "",
    expiry: "",
    cvv: "",
  });

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

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "number") {
      maskedValue = maskCardNumber(value);
      if (maskedValue.replace(/\D/g, "").length >= 13) {
        if (!validateCardNumber(maskedValue)) {
          setErrors((prev) => ({ ...prev, cardNumber: "Número do cartão inválido" }));
        } else {
          setErrors((prev) => ({ ...prev, cardNumber: "" }));
        }
      } else {
        setErrors((prev) => ({ ...prev, cardNumber: "" }));
      }
    } else if (name === "expiry") {
      maskedValue = maskExpiry(value);
      if (maskedValue.length === 5) {
        if (!validateExpiry(maskedValue)) {
          setErrors((prev) => ({ ...prev, cardExpiry: "Data inválida" }));
        } else {
          setErrors((prev) => ({ ...prev, cardExpiry: "" }));
        }
      } else {
        setErrors((prev) => ({ ...prev, cardExpiry: "" }));
      }
    } else if (name === "cvv") {
      maskedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setCardData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const validateCardForm = (): boolean => {
    const cardErrors: Record<string, string> = {};
    
    if (!validateCardNumber(cardData.number)) {
      cardErrors.cardNumber = "Número do cartão inválido";
    }
    if (!cardData.holderName || cardData.holderName.trim().length < 2) {
      cardErrors.cardHolder = "Nome do titular é obrigatório";
    }
    if (!validateExpiry(cardData.expiry)) {
      cardErrors.cardExpiry = "Data de validade inválida";
    }
    if (cardData.cvv.length < 3) {
      cardErrors.cardCvv = "CVV inválido";
    }

    setErrors((prev) => ({ ...prev, ...cardErrors }));
    return Object.keys(cardErrors).length === 0;
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

    // Validate card form for credit card payment
    if (selectedPaymentMethod === "credit" && !validateCardForm()) {
      toast.error("Por favor, verifique os dados do cartão");
      return;
    }
    
    setLoadingPayment(true);
    
    try {
      const shippingOption = shippingOptions.find((s) => s.id === selectedShipping);
      const shippingCost = shippingOption?.price || 0;
      const productTotal = product.price * quantity;
      
      // No PIX discount
      let totalWithDiscount = productTotal + shippingCost;
      // For credit card, apply interest for installments > 1
      const INTEREST_RATE = 0.0299; // 2.99% per month
      if (selectedPaymentMethod === "credit" && installments > 1) {
        totalWithDiscount = (productTotal + shippingCost) * Math.pow(1 + INTEREST_RATE, installments);
      }

      const amountInCents = Math.round(totalWithDiscount * 100);
      
      const paymentData: Record<string, unknown> = {
        amount: amountInCents,
        paymentMethod: selectedPaymentMethod === "pix" ? "pix" : "credit_card",
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
        items: [
          {
            title: `teste ${quantity}`, // Masked product name for privacy
            quantity: quantity,
            unitPrice: Math.round(product.price * 100),
            operationType: 1,
          },
        ],
      };

      // Add card data for credit card payment
      if (selectedPaymentMethod === "credit") {
        const expiryParts = cardData.expiry.split("/");
        paymentData.card = {
          number: cardData.number.replace(/\s/g, ""),
          holderName: cardData.holderName,
          expMonth: parseInt(expiryParts[0], 10),
          expYear: 2000 + parseInt(expiryParts[1], 10),
          cvv: cardData.cvv,
        };
        paymentData.installments = installments;
      }
      
      // Store order data in sessionStorage for PixPaymentPage
      const orderData = {
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
        },
        quantity,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
        },
        address: {
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
        shipping: {
          option: selectedShipping,
          price: shippingCost,
        },
        paymentMethod: selectedPaymentMethod,
        total: totalWithDiscount,
      };
      
      sessionStorage.setItem("checkoutOrder", JSON.stringify(orderData));
      
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: paymentData,
      });
      
      if (error) {
        console.error("Payment error:", error);
        toast.error("Erro ao processar pagamento. Tente novamente.");
        return;
      }

      if (data.error) {
        console.error("Payment API error:", data);
        toast.error(data.error || "Erro ao processar pagamento");
        return;
      }

      if (selectedPaymentMethod === "pix") {
        if (!data || !data.pix?.payload) {
          console.error("Invalid payment response:", data);
          toast.error("Resposta inválida do gateway de pagamento.");
          return;
        }
        
        // Store PIX data in sessionStorage
        sessionStorage.setItem("pixPayment", JSON.stringify({
          id: data.id,
          payload: data.pix.payload,
          qrCodeUrl: data.pix.qrCodeUrl,
          expiresAt: data.pix.expiresAt,
          amount: data.amount,
        }));
        
        // Navigate to PIX payment page
        navigate("/pagamento-pix");
      } else {
        // Credit card payment
        if (data.status === "paid" || data.status === "approved") {
          toast.success("Pagamento aprovado! Seu pedido foi confirmado.");
          // Could redirect to success page here
        } else {
          toast.error("Pagamento não aprovado. Por favor, tente novamente.");
        }
      }
      
    } catch (error) {
      console.error("Payment error:", error);
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

  const selectedShippingOption = shippingOptions.find((s) => s.id === selectedShipping);
  const shippingPrice = selectedShippingOption?.price || 0;
  const subtotal = product.price * quantity;
  const total = subtotal + shippingPrice;

  // Generate installment options with interest
  const INTEREST_RATE = 0.0299; // 2.99% per month
  const installmentOptions = [];
  for (let i = 1; i <= 12; i++) {
    let totalWithInterest = total;
    let installmentValue = total / i;
    let interestLabel = "";

    if (i === 1) {
      interestLabel = "(sem juros)";
    } else {
      totalWithInterest = total * Math.pow(1 + INTEREST_RATE, i);
      installmentValue = totalWithInterest / i;
      interestLabel = `(total R$ ${totalWithInterest.toFixed(2).replace(".", ",")})`;
    }

    if (installmentValue >= 5) {
      installmentOptions.push({
        value: i,
        totalAmount: totalWithInterest,
        label: `${i}x de R$ ${installmentValue.toFixed(2).replace(".", ",")} ${interestLabel}`,
      });
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Custom Checkout Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border w-full">
        <div className="w-full px-4 py-3 flex items-center justify-between">
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

        {/* Promo Banner - Full Width */}
        <div className="bg-black py-3 text-center">
          <p className="text-white text-xs font-medium px-4 max-w-lg mx-auto">
            🔥 <span className="font-bold">QUEIMÃO DE ESTOQUE GTSM1</span> — Promoção válida até 19/02!
          </p>
        </div>

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
                  <p className="text-xs text-muted-foreground">Até 12x com juros</p>
                </div>
              </label>
            </RadioGroup>

            {/* Credit Card Form */}
            {selectedPaymentMethod === "credit" && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-xs font-medium text-muted-foreground">
                    Número do Cartão *
                  </Label>
                  <Input
                    id="cardNumber"
                    name="number"
                    value={cardData.number}
                    onChange={handleCardInputChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className={errors.cardNumber ? "border-destructive" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-destructive mt-1">{errors.cardNumber}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="holderName" className="text-xs font-medium text-muted-foreground">
                    Nome no Cartão *
                  </Label>
                  <Input
                    id="holderName"
                    name="holderName"
                    value={cardData.holderName}
                    onChange={handleCardInputChange}
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                    className={`uppercase ${errors.cardHolder ? "border-destructive" : ""}`}
                  />
                  {errors.cardHolder && (
                    <p className="text-xs text-destructive mt-1">{errors.cardHolder}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry" className="text-xs font-medium text-muted-foreground">
                      Validade *
                    </Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardInputChange}
                      placeholder="MM/AA"
                      maxLength={5}
                      className={errors.cardExpiry ? "border-destructive" : ""}
                    />
                    {errors.cardExpiry && (
                      <p className="text-xs text-destructive mt-1">{errors.cardExpiry}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-xs font-medium text-muted-foreground">
                      CVV *
                    </Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cardCvv ? "border-destructive" : ""}
                    />
                    {errors.cardCvv && (
                      <p className="text-xs text-destructive mt-1">{errors.cardCvv}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="installments" className="text-xs font-medium text-muted-foreground">
                    Parcelas
                  </Label>
                  <select
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                    className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {installmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
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
              {selectedPaymentMethod === "credit" && installments > 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Juros ({installments}x)</span>
                  <span className="text-muted-foreground">
                    +{formatPrice((installmentOptions.find(o => o.value === installments)?.totalAmount || total) - total)}
                  </span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {selectedPaymentMethod === "pix" 
                      ? formatPrice(total * 0.95) 
                      : formatPrice(installmentOptions.find(o => o.value === installments)?.totalAmount || total)}
                  </span>
                </div>
                {selectedPaymentMethod === "credit" && (
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {installments}x de {formatPrice((installmentOptions.find(o => o.value === installments)?.totalAmount || total) / installments)}
                    {installments === 1 ? " (sem juros)" : ""}
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

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-4 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            GTSM1 Comércio de Bicicletas Ltda
          </p>
          <p className="text-xs text-muted-foreground">
            CNPJ: 45.678.901/0001-23
          </p>
        </div>
      </footer>
    </div>
  );
}
