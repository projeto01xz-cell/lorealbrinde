import { Phone, Headphones, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import gtsm1Logo from "@/assets/gtsm1-logo.png";

export default function Footer() {
  return (
    <footer className="bg-card mt-4">
      {/* Logo */}
      <div className="flex justify-center py-8 border-b border-border">
        <img src={gtsm1Logo} alt="GTSM1" className="h-16 w-auto" />
      </div>

      {/* Contate-nos */}
      <div className="px-5 py-6">
        <h3 className="text-xl font-bold text-foreground mb-5">CONTATE-NOS</h3>
        
        <div className="space-y-5">
          {/* Telefone 1 */}
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground text-base">(11) 4850-7181</span>
          </div>
          
          {/* Telefone 2 */}
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground text-base">(11) 4850-7195</span>
          </div>
          
          {/* WhatsApp */}
          <div className="flex items-center gap-4">
            <svg className="h-5 w-5 text-muted-foreground flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-foreground text-base">(11) 98835-0248</span>
          </div>
          
          {/* Email SAC */}
          <div className="flex items-center gap-4">
            <div className="px-2 py-1 border border-muted-foreground rounded text-xs text-muted-foreground font-medium flex-shrink-0">
              SAC
            </div>
            <span className="text-foreground text-base">faleconosco@gtsm1.com.br</span>
          </div>
        </div>

        {/* Botão Atendimento */}
        <button className="w-full mt-6 bg-destructive text-destructive-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base">
          <Headphones className="h-6 w-6" />
          <span>ATENDIMENTO</span>
          <span className="text-sm font-normal opacity-90">( ABRIR CHAMADO )</span>
        </button>
      </div>

      {/* Siga-nos */}
      <div className="px-5 py-5 border-t border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">SIGA-NOS</h3>
        <div className="flex gap-5">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Facebook className="h-7 w-7" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-7 w-7" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Youtube className="h-7 w-7" />
          </a>
        </div>
      </div>

      {/* Links */}
      <div className="px-5 py-5 border-t border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">CONTATE-NOS</h3>
        <ul className="space-y-4">
          <li>
            <Link to="/sobre" className="text-foreground text-base hover:text-primary transition-colors">
              Quem Somos
            </Link>
          </li>
          <li>
            <Link to="#" className="text-foreground text-base hover:text-primary transition-colors">
              Minha Conta
            </Link>
          </li>
          <li>
            <Link to="#" className="text-foreground text-base hover:text-primary transition-colors">
              Cadastre-se
            </Link>
          </li>
        </ul>
      </div>

      {/* Copyright Bar */}
      <div className="bg-foreground px-4 py-4 flex items-center justify-center">
        <p className="text-sm text-background font-medium">
          lojagtsm1.com.br
        </p>
      </div>
    </footer>
  );
}
