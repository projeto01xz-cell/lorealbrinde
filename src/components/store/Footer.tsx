import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              Tech<span className="text-primary">Store</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              A melhor loja de eletrônicos do Brasil. 
              Qualidade e preço justo desde 2020.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/produtos?categoria=smartphones" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=laptops" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Notebooks
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=audio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Áudio
                </Link>
              </li>
              <li>
                <Link to="/produtos?categoria=accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Acessórios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                contato@techstore.com
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 TechStore. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
