import { Search, ShoppingCart, Menu, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const cartCount = 0; // Visual only

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      {/* Main Header */}
      <div className="px-4">
        <div className="flex items-center justify-between h-14">
          {/* Menu Button */}
          <button
            className="p-2 -ml-2 touch-target"
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
            <h1 className="text-xl font-black text-foreground tracking-tight">
              GTSM<span className="text-primary">1</span>
            </h1>
          </Link>

          {/* Cart */}
          <button className="relative p-2 -mr-2 touch-target" aria-label="Carrinho">
            <ShoppingCart className="h-6 w-6 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-destructive text-destructive-foreground 
                             text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-11"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-secondary/50 border-t border-border px-4 py-2">
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          {location.pathname !== "/" && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">
                {location.pathname === "/produtos" && "Elétricos"}
                {location.pathname === "/sobre" && "Sobre"}
                {location.pathname.startsWith("/produto/") && "Produto"}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[104px] bg-background z-40">
          <nav className="flex flex-col p-4">
            <Link
              to="/"
              className="flex items-center justify-between py-4 border-b border-border text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link
              to="/produtos"
              className="flex items-center justify-between py-4 border-b border-border text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Elétricos
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link
              to="/produtos?categoria=ebikes"
              className="flex items-center justify-between py-4 border-b border-border text-base pl-4 text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Bicicletas Elétricas
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              to="/produtos?categoria=scooters"
              className="flex items-center justify-between py-4 border-b border-border text-base pl-4 text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Scooters
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              to="/produtos?categoria=parts"
              className="flex items-center justify-between py-4 border-b border-border text-base pl-4 text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Peças
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              to="/produtos?categoria=accessories"
              className="flex items-center justify-between py-4 border-b border-border text-base pl-4 text-muted-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Acessórios
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              to="/sobre"
              className="flex items-center justify-between py-4 border-b border-border text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}