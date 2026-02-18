import { Search, ShoppingCart, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full shadow-sm">
      {/* ML Yellow Top Bar */}
      <div className="w-full" style={{ backgroundColor: 'hsl(45 100% 51%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 touch-target"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-extrabold text-foreground tracking-tight">JSvariedades</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden sm:flex">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-sm py-2.5 pl-4 pr-12 text-foreground placeholder:text-muted-foreground 
                           focus:outline-none text-sm border-0 shadow-sm"
                />
                <button
                  className="absolute right-0 top-0 h-full px-4 rounded-r-sm flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'hsl(45 100% 43%)' }}
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              <Link to="/sobre" className="hidden lg:block text-sm font-medium text-foreground px-3 py-1.5 hover:bg-black/10 rounded transition-colors">
                Sobre nós
              </Link>
              <button className="relative p-2 touch-target text-foreground hover:bg-black/10 rounded transition-colors" aria-label="Carrinho">
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary nav bar */}
      <div className="w-full bg-card border-b border-border hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-10">
            <Link to="/produtos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Todos os Produtos</Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Ofertas do Dia</Link>
            <span className="text-xs font-semibold" style={{ color: 'hsl(145 63% 36%)' }}>🚚 Frete Grátis para todo o Brasil</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[56px] bg-card z-40 lg:hidden">
          <nav className="flex flex-col p-4">
            {[
              { to: "/", label: "Início" },
              { to: "/produtos", label: "Produtos" },
              { to: "/sobre", label: "Sobre nós" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between py-4 border-b border-border text-base font-medium text-foreground hover:text-foreground/70 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
