import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, CreditCard, Banknote, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-8">
      {/* Newsletter */}
      <div className="px-4 py-6 bg-primary/5 border-b border-border">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-foreground mb-1">
            Receba ofertas exclusivas
          </h3>
          <p className="text-sm text-muted-foreground">
            Cadastre-se e ganhe 10% OFF na primeira compra
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="input-field flex-1"
          />
          <button className="btn-primary px-6">
            Enviar
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="px-4 py-6 border-b border-border">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-sm text-muted-foreground">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/produtos?categoria=ebikes" className="text-sm text-muted-foreground">
                  E-Bikes
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=scooters" className="text-sm text-muted-foreground">
                  Scooters
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=parts" className="text-sm text-muted-foreground">
                  Peças
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=accessories" className="text-sm text-muted-foreground">
                  Acessórios
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="px-4 py-6 border-b border-border">
        <h4 className="font-semibold text-foreground mb-3">Contato</h4>
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            (11) 99999-9999
          </li>
          <li className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            contato@gtsm1.com.br
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5" />
            São Paulo, SP
          </li>
        </ul>

        {/* Social */}
        <div className="flex gap-4 mt-4">
          <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
            <Youtube className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="px-4 py-6 border-b border-border">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Compra Segura</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-5 w-5 text-primary" />
            <span>Frete Grátis</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 py-4 border-b border-border">
        <p className="text-xs text-muted-foreground text-center mb-3">
          Formas de Pagamento
        </p>
        <div className="flex justify-center gap-3">
          <div className="flex items-center gap-1 px-3 py-2 bg-secondary rounded text-xs text-muted-foreground">
            <Banknote className="h-4 w-4" />
            PIX
          </div>
          <div className="flex items-center gap-1 px-3 py-2 bg-secondary rounded text-xs text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            Cartão
          </div>
          <div className="px-3 py-2 bg-secondary rounded text-xs text-muted-foreground">
            Boleto
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-4 py-4 bg-secondary/30">
        <p className="text-xs text-muted-foreground text-center">
          © 2025 GTSM1. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}