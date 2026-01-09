import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import lorealLogo from "@/assets/loreal-paris-logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border/30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Ícone de busca à esquerda */}
          <button 
            aria-label="Buscar"
            className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Logo centralizada */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <img 
              src={lorealLogo}
              alt="L'Oréal Paris"
              className="h-5 w-auto"
            />
          </div>

          {/* Menu hambúrguer à direita */}
          <button 
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Menu mobile dropdown */}
      {menuOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-background animate-fade-in">
          <nav className="container mx-auto px-4 py-6">
            <ul className="space-y-4">
              <li>
                <a 
                  href="#como-funciona"
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors border-b border-border/30"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <a 
                  href="#duvidas"
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors border-b border-border/30"
                >
                  Dúvidas
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
