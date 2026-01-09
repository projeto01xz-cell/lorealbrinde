import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import lorealLogo from "@/assets/loreal-paris-logo.svg";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="px-4 h-12 flex items-center justify-between max-w-screen-sm mx-auto">
          {/* Ícone de busca à esquerda */}
          <button 
            aria-label="Buscar"
            className="w-9 h-9 flex items-center justify-center text-foreground hover:text-primary transition-colors -ml-1"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Logo centralizada */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <img 
              src={lorealLogo}
              alt="L'Oréal Paris"
              className="h-4 w-auto"
            />
          </div>

          {/* Menu hambúrguer à direita */}
          <button 
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center text-foreground hover:text-primary transition-colors -mr-1"
          >
            {menuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-12" />

      {/* Menu mobile dropdown */}
      {menuOpen && (
        <div className="fixed inset-0 top-12 z-40 bg-background animate-fade-in">
          <nav className="px-5 py-6">
            <ul className="space-y-1">
              <li>
                <a 
                  href="#como-funciona"
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/30"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <a 
                  href="#duvidas"
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/30"
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
