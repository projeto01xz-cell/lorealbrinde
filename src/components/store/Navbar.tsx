import { Search, ShoppingCart, Menu, X, ChevronRight, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = 0;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        Frete Grátis para todo o Brasil
      </div>

      {/* Main Header */}
      <div className="w-full bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
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

            {/* Logo as Text */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-foreground tracking-tight">JSvaridedaes</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary rounded-lg py-2.5 pl-4 pr-10 text-foreground placeholder:text-muted-foreground 
                           focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-border"
                />
                <button className="absolute right-3 text-muted-foreground hover:text-primary transition-colors" aria-label="Buscar">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/produtos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Produtos
              </Link>
              <Link to="/sobre" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Sobre nós
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-foreground hover:text-primary transition-colors touch-target hidden sm:flex" aria-label="Minha conta">
                <User className="h-5 w-5" />
              </button>
              <button className="relative p-2 -mr-2 touch-target text-foreground hover:text-primary transition-colors" aria-label="Carrinho">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 h-4 w-4 bg-primary text-primary-foreground 
                                 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-3">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary rounded-lg py-2.5 pl-4 pr-10 text-foreground placeholder:text-muted-foreground 
                         focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-border"
              />
              <button className="absolute right-3 text-muted-foreground" aria-label="Buscar">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[120px] bg-card z-40 lg:hidden">
          <nav className="flex flex-col p-4">
            {[
              { to: "/", label: "Início" },
              { to: "/produtos", label: "Produtos" },
              { to: "/sobre", label: "Sobre nós" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between py-4 border-b border-border text-base font-medium text-foreground hover:text-primary transition-colors"
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
