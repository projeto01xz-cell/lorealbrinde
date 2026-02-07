import { Mail, Phone, Instagram, Facebook, Youtube, CreditCard, Banknote, ShieldCheck, Truck, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import gtsm1Logo from "@/assets/gtsm1-logo.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-4">
      {/* Newsletter */}
      <div className="px-4 py-5 bg-primary/5 border-b border-border">
        <p className="text-sm font-semibold text-foreground text-center mb-3">
          Receba ofertas exclusivas
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Seu e-mail"
            className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-lg text-sm">
            OK
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="px-4 py-4 border-b border-border">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-muted-foreground">Compra Segura</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-muted-foreground">Frete Grátis</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Headphones className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-muted-foreground">Suporte 24h</span>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="px-4 py-4 border-b border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wide">Navegação</h4>
            <ul className="space-y-1.5">
              <li><Link to="/" className="text-muted-foreground text-xs">Início</Link></li>
              <li><Link to="/produtos" className="text-muted-foreground text-xs">Produtos</Link></li>
              <li><Link to="/sobre" className="text-muted-foreground text-xs">Sobre</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wide">Categorias</h4>
            <ul className="space-y-1.5">
              <li><Link to="/produtos?categoria=ebikes" className="text-muted-foreground text-xs">E-Bikes</Link></li>
              <li><Link to="/produtos?categoria=scooters" className="text-muted-foreground text-xs">Scooters</Link></li>
              <li><Link to="/produtos?categoria=parts" className="text-muted-foreground text-xs">Peças</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact & Social */}
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>(11) 99999-9999</span>
        </div>
        <div className="flex gap-2">
          <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="#" className="p-2 bg-secondary rounded-lg text-muted-foreground">
            <Youtube className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex justify-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1.5 bg-secondary rounded text-[10px] text-muted-foreground">
            <Banknote className="h-3 w-3" />
            PIX
          </div>
          <div className="flex items-center gap-1 px-2 py-1.5 bg-secondary rounded text-[10px] text-muted-foreground">
            <CreditCard className="h-3 w-3" />
            Cartão
          </div>
          <div className="px-2 py-1.5 bg-secondary rounded text-[10px] text-muted-foreground">
            Boleto
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="px-4 py-3 bg-secondary/30 flex items-center justify-center gap-2">
        <img src={gtsm1Logo} alt="GTSM1" className="h-4 w-auto opacity-50" />
        <p className="text-[10px] text-muted-foreground">
          © 2025 Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}