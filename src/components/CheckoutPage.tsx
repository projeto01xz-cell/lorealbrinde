import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Menu, X, Truck, Package, Zap, Loader2, Gift, CheckSquare, Square, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUtmifyParams, saveUtmParams } from "@/lib/utmify";
import lorealLogo from "@/assets/loreal-paris-logo.svg";
import productKitFull from "@/assets/product-kit-full.png";
import serumOleoExtraordinario from "@/assets/serum-oleo-extraordinario.png";
import serumLisoSonhos from "@/assets/serum-liso-sonhos.png";
import leaveInCicatriRenov from "@/assets/leave-in-cicatri-renov.png";
interface CheckoutPageProps {
  userData: {
    name: string;
    whatsapp: string;
    answers: string[];
  };
  onPixGenerated: (pixData: {
    payload: string;
    expiresAt?: string;
  }, total: number) => void;
}
const shippingOptions = [{
  id: "pac",
  name: "PAC",
  price: 16.40,
  days: "8-12 dias úteis",
  icon: Package
}, {
  id: "sedex",
  name: "SEDEX",
  price: 24.80,
  days: "3-5 dias úteis",
  icon: Truck
}, {
  id: "jadlog",
  name: "JADLOG FULL",
  price: 37.70,
  days: "1-2 dias úteis",
  icon: Zap
}];
const orderBumps = [{
  id: "bump1",
  name: "Sérum Óleo Extraordinário 100ml",
  description: "Óleo de flores preciosas. Nutre instantaneamente sem pesar.",
  image: serumOleoExtraordinario,
  oldPrice: 39.16,
  promoPrice: 18.40
}, {
  id: "bump2",
  name: "Sérum Liso dos Sonhos 100ml",
  description: "Cabelos à prova de umidade & lisos por 1 semana. Sem química.",
  image: serumLisoSonhos,
  oldPrice: 31.99,
  promoPrice: 16.30
}, {
  id: "bump3",
  name: "Leave-In Cicatri Renov 100ml",
  description: "12% complexo reparador com micro queratina. Repara a fibra capilar.",
  image: leaveInCicatriRenov,
  oldPrice: 28.45,
  promoPrice: 12.40
}];

// Máscaras
const maskCPF = (value: string) => {
  return value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");
};
const maskCEP = (value: string) => {
  return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1");
};
const maskPhone = (value: string) => {
  return value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{4})\d+?$/, "$1");
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
  let remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = sum * 10 % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  return true;
};
const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, "");
  return cleanCEP.length === 8;
};
const CheckoutPage = ({
  userData,
  onPixGenerated
}: CheckoutPageProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData.name || "",
    email: "",
    cpf: "",
    phone: userData.whatsapp || "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });
  const [selectedShipping, setSelectedShipping] = useState("");
  const [addressFilled, setAddressFilled] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [errors, setErrors] = useState<{
    cpf?: string;
    cep?: string;
  }>({});
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Salvar UTM params quando a página carrega e disparar evento InitiateCheckout
  useEffect(() => {
    saveUtmParams();
    
    // Facebook Pixel - InitiateCheckout
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Kit Elseve Collagen Lifter',
        content_category: 'Hair Care',
        currency: 'BRL',
        value: 0
      });
    }
  }, []);
  const toggleBump = (bumpId: string) => {
    setSelectedBumps(prev => prev.includes(bumpId) ? prev.filter(id => id !== bumpId) : [...prev, bumpId]);
  };
  const bumpsTotal = selectedBumps.reduce((acc, bumpId) => {
    const bump = orderBumps.find(b => b.id === bumpId);
    return acc + (bump?.promoPrice || 0);
  }, 0);
  const checkAddressFilled = (form: typeof formData) => {
    const requiredAddressFields = ["cep", "street", "number", "neighborhood", "city", "state"];
    return requiredAddressFields.every(field => form[field as keyof typeof form]?.trim() !== "");
  };
  const fetchAddress = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;
    setLoadingCep(true);
    setErrors(prev => ({
      ...prev,
      cep: undefined
    }));
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      if (data.erro) {
        setErrors(prev => ({
          ...prev,
          cep: "CEP não encontrado"
        }));
        return;
      }
      const updatedForm = {
        ...formData,
        cep: maskCEP(cleanCEP),
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || ""
      };
      setFormData(updatedForm);
      setAddressFilled(checkAddressFilled(updatedForm));
    } catch {
      setErrors(prev => ({
        ...prev,
        cep: "Erro ao buscar CEP"
      }));
    } finally {
      setLoadingCep(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    let maskedValue = value;

    // Aplicar máscaras
    if (name === "cpf") {
      maskedValue = maskCPF(value);
      if (maskedValue.replace(/\D/g, "").length === 11) {
        if (!validateCPF(maskedValue)) {
          setErrors(prev => ({
            ...prev,
            cpf: "CPF inválido"
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            cpf: undefined
          }));
        }
      } else {
        setErrors(prev => ({
          ...prev,
          cpf: undefined
        }));
      }
    } else if (name === "cep") {
      maskedValue = maskCEP(value);
      const cleanCEP = maskedValue.replace(/\D/g, "");
      if (cleanCEP.length === 8) {
        fetchAddress(cleanCEP);
      }
    } else if (name === "phone") {
      maskedValue = maskPhone(value);
    }
    const updatedForm = {
      ...formData,
      [name]: maskedValue
    };
    setFormData(updatedForm);
    setAddressFilled(checkAddressFilled(updatedForm));
  };
  const handleSubmit = async () => {
    if (!selectedShipping) return;
    if (!validateCPF(formData.cpf)) {
      setErrors(prev => ({
        ...prev,
        cpf: "CPF inválido"
      }));
      return;
    }
    if (!validateCEP(formData.cep)) {
      setErrors(prev => ({
        ...prev,
        cep: "CEP inválido"
      }));
      return;
    }
    if (!formData.email) {
      toast.error("Por favor, preencha o e-mail");
      return;
    }
    setLoadingPayment(true);
    try {
      // Montar itens do pedido
      const items = [{
        title: "Kit Elseve Collagen Lifter (Brinde)",
        quantity: 1,
        unitPrice: 0
      }];

      // Adicionar order bumps selecionados
      selectedBumps.forEach(bumpId => {
        const bump = orderBumps.find(b => b.id === bumpId);
        if (bump) {
          items.push({
            title: bump.name,
            quantity: 1,
            unitPrice: Math.round(bump.promoPrice * 100)
          });
        }
      });

      // Adicionar frete
      const shipping = shippingOptions.find(s => s.id === selectedShipping);
      if (shipping) {
        items.push({
          title: `Frete ${shipping.name}`,
          quantity: 1,
          unitPrice: Math.round(shipping.price * 100)
        });
      }
      const totalCents = Math.round(total * 100);
      const {
        data,
        error
      } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: totalCents,
          customer: {
            name: formData.fullName,
            email: formData.email,
            document: formData.cpf,
            phone: formData.phone
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

      // Enviar tracking para Utmify
      const utmParams = getUtmifyParams();
      const orderId = data.id?.toString() || `PIX-${Date.now()}`;

      // Montar produtos para tracking
      const trackingProducts = [{
        name: "Kit Elseve Collagen Lifter (Brinde)",
        price: 0,
        quantity: 1
      }];
      selectedBumps.forEach(bumpId => {
        const bump = orderBumps.find(b => b.id === bumpId);
        if (bump) {
          trackingProducts.push({
            name: bump.name,
            price: bump.promoPrice,
            quantity: 1
          });
        }
      });

      // Track sale async (não bloqueia o fluxo)
      supabase.functions.invoke("track-utmify", {
        body: {
          orderId,
          status: "pending",
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            document: formData.cpf
          },
          products: trackingProducts,
          paymentMethod: "pix",
          totalAmount: total,
          utmParams
        }
      }).then(({
        error: trackError
      }) => {
        if (trackError) {
          console.warn("Utmify tracking error:", trackError);
        } else {
          console.log("Sale tracked to Utmify");
        }
      });

      // Facebook Pixel - Purchase
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          content_name: 'Kit Elseve Collagen Lifter',
          content_category: 'Hair Care',
          content_ids: ['kit-elseve-collagen', ...selectedBumps],
          num_items: 1 + selectedBumps.length,
          currency: 'BRL',
          value: total
        });
      }

      // Navegar para página de pagamento Pix
      onPixGenerated({
        payload: data.pix?.payload || "",
        expiresAt: data.pix?.expiresAt
      }, total);
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Erro ao processar pagamento");
    } finally {
      setLoadingPayment(false);
    }
  };
  const selectedShippingOption = shippingOptions.find(s => s.id === selectedShipping);
  const shippingPrice = selectedShippingOption ? selectedShippingOption.price : 0;
  const total = shippingPrice + bumpsTotal;
  return <div className="min-h-[100svh] bg-gray-50 pb-32">
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

      {/* Header */}
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

      <div className="px-4 py-6 max-w-sm mx-auto space-y-4">
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-3">Resumo do Pedido</h2>
          <div className="flex gap-3">
            <img src={productKitFull} alt="Kit Elseve Collagen Lifter" className="w-20 h-20 object-contain bg-purple-50 rounded-lg" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Lançamento Elseve</p>
              <p className="text-xs text-purple-600 font-medium">Collagen Lifter</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xs text-gray-400 line-through">R$ 189,90</span>
                <span className="text-lg font-black text-green-600">GRÁTIS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Data */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-4">Dados Pessoais</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="fullName" className="text-xs text-gray-600">
                Nome Completo
              </Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Digite seu nome completo" className="mt-1 h-11" />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs text-gray-600">
                E-mail
              </Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="seu@email.com" className="mt-1 h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cpf" className="text-xs text-gray-600">
                  CPF
                </Label>
                <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00" className={`mt-1 h-11 ${errors.cpf ? "border-red-500 focus-visible:ring-red-500" : ""}`} />
                {errors.cpf && <p className="text-[10px] text-red-500 mt-1">{errors.cpf}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs text-gray-600">
                  Telefone
                </Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(00) 00000-0000" className="mt-1 h-11" />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-4">Endereço de Entrega</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="cep" className="text-xs text-gray-600">
                CEP
              </Label>
              <div className="relative">
                <Input id="cep" name="cep" value={formData.cep} onChange={handleInputChange} placeholder="00000-000" className={`mt-1 h-11 ${errors.cep ? "border-red-500 focus-visible:ring-red-500" : ""}`} />
                {loadingCep && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 w-4 h-4 animate-spin text-gray-400" />}
              </div>
              {errors.cep && <p className="text-[10px] text-red-500 mt-1">{errors.cep}</p>}
            </div>
            <div>
              <Label htmlFor="street" className="text-xs text-gray-600">
                Rua
              </Label>
              <Input id="street" name="street" value={formData.street} onChange={handleInputChange} placeholder="Nome da rua" className="mt-1 h-11" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="number" className="text-xs text-gray-600">
                  Número
                </Label>
                <Input id="number" name="number" value={formData.number} onChange={handleInputChange} placeholder="123" className="mt-1 h-11" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="complement" className="text-xs text-gray-600">
                  Complemento
                </Label>
                <Input id="complement" name="complement" value={formData.complement} onChange={handleInputChange} placeholder="Apto, bloco..." className="mt-1 h-11" />
              </div>
            </div>
            <div>
              <Label htmlFor="neighborhood" className="text-xs text-gray-600">
                Bairro
              </Label>
              <Input id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="Seu bairro" className="mt-1 h-11" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="city" className="text-xs text-gray-600">
                  Cidade
                </Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Sua cidade" className="mt-1 h-11" />
              </div>
              <div>
                <Label htmlFor="state" className="text-xs text-gray-600">
                  Estado
                </Label>
                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="UF" className="mt-1 h-11" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Options - Only show when address is filled */}
        {addressFilled && <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h2 className="font-bold text-sm text-gray-900 mb-4">Opções de Frete</h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
              <div className="space-y-3">
                {shippingOptions.map(option => <label key={option.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedShipping === option.id ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <RadioGroupItem value={option.id} id={option.id} />
                    <option.icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{option.name}</p>
                      <p className="text-xs text-gray-500">{option.days}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      R$ {option.price.toFixed(2).replace(".", ",")}
                    </span>
                  </label>)}
              </div>
            </RadioGroup>
          </div>}

        {/* Order Total */}
        {addressFilled && selectedShipping && <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Produto</span>
              <span className="text-sm font-medium text-green-600">GRÁTIS</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Frete</span>
              <span className="text-sm font-medium text-gray-900">
                R$ {shippingPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            {bumpsTotal > 0 && <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Ofertas adicionais</span>
                <span className="text-sm font-medium text-purple-600">
                  R$ {bumpsTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-lg font-black text-gray-900">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>}

        {/* Order Bumps */}
        {addressFilled && selectedShipping && <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 border border-purple-500 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-yellow-300" />
              <h2 className="font-bold text-sm text-white uppercase tracking-wide"> DESCONTO ESPECIAL DE LANÇAMENTO</h2>
            </div>
            <p className="text-xs text-purple-200 mb-4">
              Promoção exclusiva para participantes desta campanha especial!
            </p>

            <div className="space-y-3">
              {orderBumps.map(bump => {
            const isSelected = selectedBumps.includes(bump.id);
            return <button key={bump.id} onClick={() => toggleBump(bump.id)} className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left ${isSelected ? "border-yellow-400 bg-white/20" : "border-white/30 bg-white/10 hover:bg-white/15"}`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {isSelected ? <CheckSquare className="w-5 h-5 text-yellow-300" /> : <Square className="w-5 h-5 text-white/60" />}
                    </div>
                    <img src={bump.image} alt={bump.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{bump.name}</p>
                      <p className="text-[11px] text-purple-200 line-clamp-2">
                        {bump.description}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[11px] text-white/50 line-through">
                          R$ {bump.oldPrice.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-sm font-black text-yellow-300">
                          R$ {bump.promoPrice.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  </button>;
          })}
            </div>
          </div>}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-sm mx-auto">
          <Button onClick={handleSubmit} disabled={!addressFilled || !selectedShipping || !!errors.cpf || !!errors.cep || loadingPayment} className="w-full h-12 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg">
            {loadingPayment ? <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                GERANDO PIX...
              </> : <>
                <QrCode className="w-4 h-4 mr-2" />
                PAGAR COM PIX
              </>}
          </Button>
          {!addressFilled && <p className="text-[10px] text-gray-400 text-center mt-2">
              Preencha o endereço para ver as opções de frete
            </p>}
        </div>
      </div>
    </div>;
};
export default CheckoutPage;