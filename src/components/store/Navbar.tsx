import { Search, ShoppingCart, Menu, X, ChevronRight, Heart, Mic } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import gtsm1Logo from "@/assets/gtsm1-logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = 0; // Visual only
  const favoritesCount = 0; // Visual only

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-foreground h-2 w-full"></div>

      {/* Main Header */}
      <div className="w-full px-4 bg-card">
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
            <img 
              src={gtsm1Logo} 
              alt="GTSM1" 
              className="h-5 w-auto"
            />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Favorites */}
            <button className="relative p-2 touch-target" aria-label="Favoritos">
              <Heart className="h-6 w-6 text-foreground" strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground 
                             text-[10px] font-bold rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            </button>

            {/* Cart */}
            <button className="relative p-2 -mr-2 touch-target" aria-label="Carrinho">
              <ShoppingCart className="h-6 w-6 text-foreground" strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-primary text-primary-foreground 
                             text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-3 px-2">
          <div className="relative flex items-center bg-card rounded-md border border-border">
            <button className="p-2.5 text-muted-foreground" aria-label="Busca por voz">
              <Mic className="h-4 w-4" />
            </button>
            <input
              type="text"
              placeholder="Busque aqui"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent py-2.5 pr-2 text-foreground placeholder:text-muted-foreground 
                       focus:outline-none text-sm"
            />
            <button className="p-2.5 text-muted-foreground" aria-label="Buscar">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[140px] bg-background z-40">
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