import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl font-bold text-foreground">
              Tech<span className="text-primary">Store</span>
            </h1>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-secondary/50 
                         text-foreground placeholder:text-muted-foreground text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/produtos" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Produtos
            </Link>
            <Link 
              to="/sobre" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sobre
            </Link>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <ShoppingBag className="h-5 w-5 text-foreground" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground 
                             text-xs font-medium rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            
            <button 
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/50 
                       text-foreground placeholder:text-muted-foreground text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col py-4 px-4 space-y-1">
            <Link 
              to="/" 
              className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/produtos" 
              className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link 
              to="/sobre" 
              className="px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
