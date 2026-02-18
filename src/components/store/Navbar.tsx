import { Search, ShoppingCart, Menu, X, ChevronRight, Zap, Headphones, Speaker, BatteryCharging, Wind, MonitorSmartphone, Mouse, Lightbulb, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { label: "Eletrônicos em Geral", icon: MonitorSmartphone, to: "/produtos" },
  { label: "Fones de Ouvido", icon: Headphones, to: "/produtos" },
  { label: "Caixas de Som", icon: Speaker, to: "/produtos" },
  { label: "Carregadores", icon: BatteryCharging, to: "/produtos" },
  { label: "Ventiladores", icon: Wind, to: "/produtos" },
  { label: "Suportes de Celular", icon: MonitorSmartphone, to: "/produtos" },
  { label: "Mouse e Teclados", icon: Mouse, to: "/produtos" },
  { label: "Iluminação", icon: Lightbulb, to: "/produtos" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full shadow-md">

      {/* Yellow promo top bar */}
      <div className="w-full text-center py-1.5 text-xs font-bold" style={{ backgroundColor: 'hsl(45 100% 51%)', color: 'hsl(0 0% 10%)' }}>
        ⚡ QUEIMA ESTOQUE — FRETE GRÁTIS PARA TODO O BRASIL ⚡
      </div>

      {/* Purple main header */}
      <div className="w-full" style={{ backgroundColor: 'hsl(270 55% 38%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">

            {/* Mobile Menu */}
            <button
              className="lg:hidden p-2 -ml-1 touch-target text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight hidden sm:block">JSvariedades</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder="Busque o que deseja"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded py-2.5 pl-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border-0 shadow-sm"
                />
                <button
                  className="absolute right-0 top-0 h-full px-4 rounded-r flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'hsl(45 100% 51%)' }}
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" style={{ color: 'hsl(0 0% 10%)' }} />
                </button>
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link to="/sobre" className="hidden lg:flex flex-col items-center gap-0.5 text-white px-2 py-1 hover:bg-white/10 rounded transition-colors">
                <span className="text-xs font-medium">Quem somos</span>
              </Link>
              <button className="flex flex-col items-center gap-0.5 text-white px-2 py-1 hover:bg-white/10 rounded transition-colors" aria-label="Favoritos">
                <Heart className="h-5 w-5" />
                <span className="text-[10px] hidden lg:block">Favoritos</span>
              </button>
              <button className="relative flex flex-col items-center gap-0.5 text-white px-2 py-1 hover:bg-white/10 rounded transition-colors" aria-label="Carrinho">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: 'hsl(45 100% 51%)', color: 'hsl(0 0% 10%)' }}>0</span>
                </div>
                <span className="text-[10px] hidden lg:block">Carrinho</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="w-full hidden lg:block" style={{ backgroundColor: 'hsl(270 55% 30%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap border-r border-white/20">
              <Menu className="h-4 w-4" /> Categorias
            </button>
            <Link to="/" className="px-4 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap">Novidades</Link>
            <Link to="/produtos" className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors" style={{ color: 'hsl(45 100% 65%)' }}>Ofertas</Link>
          </div>
        </div>
      </div>

      {/* Category icons strip */}
      <div className="w-full bg-card border-b border-border hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="flex flex-col items-center gap-1 px-4 py-2 min-w-[90px] rounded hover:bg-secondary transition-colors group"
              >
                <cat.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] text-center text-muted-foreground group-hover:text-foreground leading-tight whitespace-nowrap">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[calc(1.75rem+4rem)] z-40 bg-card lg:hidden">
          <nav className="flex flex-col p-4">
            {[
              { to: "/", label: "Início" },
              { to: "/produtos", label: "Produtos" },
              { to: "/sobre", label: "Quem somos" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between py-4 border-b border-border text-base font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
            <div className="mt-4">
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase">Categorias</p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  className="flex items-center gap-3 py-3 border-b border-border text-sm text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <cat.icon className="h-5 w-5 text-primary" />
                  {cat.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
