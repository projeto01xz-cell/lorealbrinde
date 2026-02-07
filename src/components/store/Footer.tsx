import { Phone, Headphones, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import gtsm1Logo from "@/assets/gtsm1-logo.png";

export default function Footer() {
  return (
    <footer className="bg-card mt-4">
      {/* Logo */}
      <div className="flex justify-center py-6 border-b border-border">
        <img src={gtsm1Logo} alt="GTSM1" className="h-12 w-auto" />
      </div>

      {/* Contate-nos */}
      <div className="px-4 py-5">
        <h3 className="text-lg font-bold text-foreground mb-4">CONTATE-NOS</h3>
        
        <div className="space-y-4">
          {/* Telefone 1 */}
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">(11) 4850-7181</span>
          </div>
          
          {/* Telefone 2 */}
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">(11) 4850-7195</span>
          </div>
          
          {/* WhatsApp */}
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">(11) 98835-0248</span>
          </div>
          
          {/* Email SAC */}
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 border border-muted-foreground rounded text-[10px] text-muted-foreground font-medium">
              SAC
            </div>
            <span className="text-foreground">faleconosco@gtsm1.com.br</span>
          </div>
        </div>

        {/* Botão Atendimento */}
        <button className="w-full mt-5 bg-destructive text-destructive-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          <Headphones className="h-5 w-5" />
          <span>ATENDIMENTO</span>
          <span className="text-sm font-normal">(ABRIR CHAMADO)</span>
        </button>
      </div>

      {/* Siga-nos */}
      <div className="px-4 py-4 border-t border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">SIGA-NOS</h3>
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
        </div>
      </div>

      {/* Links */}
      <div className="px-4 py-4 border-t border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">CONTATE-NOS</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/sobre" className="text-foreground hover:text-primary transition-colors">
              Quem Somos
            </Link>
          </li>
          <li>
            <Link to="#" className="text-foreground hover:text-primary transition-colors">
              Minha Conta
            </Link>
          </li>
          <li>
            <Link to="#" className="text-foreground hover:text-primary transition-colors">
              Cadastre-se
            </Link>
          </li>
        </ul>
      </div>

      {/* Copyright Bar */}
      <div className="bg-foreground px-4 py-3 flex items-center justify-center">
        <p className="text-[11px] text-background">
          lojagtsm1.com.br
        </p>
      </div>
    </footer>
  );
}
