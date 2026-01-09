import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Menu, X, Truck, Package, Zap } from "lucide-react";
import lorealLogo from "@/assets/loreal-paris-logo.svg";
import productKitFull from "@/assets/product-kit-full.png";

interface CheckoutPageProps {
  userData: {
    name: string;
    whatsapp: string;
    answers: string[];
  };
}

const shippingOptions = [
  {
    id: "pac",
    name: "PAC",
    price: 19.90,
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
    id: "sedex10",
    name: "SEDEX 10",
    price: 49.90,
    days: "1-2 dias úteis",
    icon: Zap,
  },
];

const CheckoutPage = ({ userData }: CheckoutPageProps) => {
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
    state: "",
  });
  const [selectedShipping, setSelectedShipping] = useState("");
  const [addressFilled, setAddressFilled] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check if address is filled
    const requiredAddressFields = ["cep", "street", "number", "neighborhood", "city", "state"];
    const updatedForm = { ...formData, [name]: value };
    const isAddressFilled = requiredAddressFields.every(
      (field) => updatedForm[field as keyof typeof updatedForm]?.trim() !== ""
    );
    setAddressFilled(isAddressFilled);
  };

  const handleSubmit = () => {
    if (!selectedShipping) return;
    const shipping = shippingOptions.find((s) => s.id === selectedShipping);
    const message = `Olá! Quero finalizar meu pedido do Kit Elseve Collagen Lifter!\n\nDados:\nNome: ${formData.fullName}\nEmail: ${formData.email}\nCPF: ${formData.cpf}\nTelefone: ${formData.phone}\n\nEndereço:\n${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ""}\n${formData.neighborhood}\n${formData.city} - ${formData.state}\nCEP: ${formData.cep}\n\nFrete: ${shipping?.name} - R$ ${shipping?.price.toFixed(2)}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, "_blank");
  };

  const selectedShippingOption = shippingOptions.find((s) => s.id === selectedShipping);
  const total = selectedShippingOption ? selectedShippingOption.price : 0;

  return (
    <div className="min-h-[100svh] bg-gray-50 pb-32">
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

      {/* Spacer for fixed header + banner */}
      <div className="h-[84px]" />

      <div className="px-4 py-6 max-w-sm mx-auto space-y-4">
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-sm text-gray-900 mb-3">Resumo do Pedido</h2>
          <div className="flex gap-3">
            <img
              src={productKitFull}
              alt="Kit Elseve Collagen Lifter"
              className="w-20 h-20 object-contain bg-purple-50 rounded-lg"
            />
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
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo"
                className="mt-1 h-11"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs text-gray-600">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                className="mt-1 h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cpf" className="text-xs text-gray-600">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs text-gray-600">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className="mt-1 h-11"
                />
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
              <Input
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                placeholder="00000-000"
                className="mt-1 h-11"
              />
            </div>
            <div>
              <Label htmlFor="street" className="text-xs text-gray-600">
                Rua
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Nome da rua"
                className="mt-1 h-11"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="number" className="text-xs text-gray-600">
                  Número
                </Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="mt-1 h-11"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="complement" className="text-xs text-gray-600">
                  Complemento
                </Label>
                <Input
                  id="complement"
                  name="complement"
                  value={formData.complement}
                  onChange={handleInputChange}
                  placeholder="Apto, bloco..."
                  className="mt-1 h-11"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="neighborhood" className="text-xs text-gray-600">
                Bairro
              </Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                placeholder="Seu bairro"
                className="mt-1 h-11"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="city" className="text-xs text-gray-600">
                  Cidade
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Sua cidade"
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-xs text-gray-600">
                  Estado
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="UF"
                  className="mt-1 h-11"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Options - Only show when address is filled */}
        {addressFilled && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h2 className="font-bold text-sm text-gray-900 mb-4">Opções de Frete</h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedShipping === option.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <option.icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{option.name}</p>
                      <p className="text-xs text-gray-500">{option.days}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      R$ {option.price.toFixed(2).replace(".", ",")}
                    </span>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Order Total */}
        {addressFilled && selectedShipping && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Produto</span>
              <span className="text-sm font-medium text-green-600">GRÁTIS</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Frete</span>
              <span className="text-sm font-medium text-gray-900">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-lg font-black text-gray-900">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-sm mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!addressFilled || !selectedShipping}
            className="w-full h-12 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg"
          >
            FINALIZAR PEDIDO
          </Button>
          {!addressFilled && (
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Preencha o endereço para ver as opções de frete
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
