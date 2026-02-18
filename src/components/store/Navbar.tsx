import { Search, ShoppingCart, Menu, X, ChevronRight, Zap, Headphones, Speaker, BatteryCharging, Wind, MonitorSmartphone, Mouse, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { label: "Eletrônicos", icon: MonitorSmartphone, to: "/produtos" },
  { label: "Fones", icon: Headphones, to: "/produtos" },
  { label: "Caixas de Som", icon: Speaker, to: "/produtos" },
  { label: "Carregadores", icon: BatteryCharging, to: "/produtos" },
  { label: "Ventiladores", icon: Wind, to: "/produtos" },
  { label: "Suportes", icon: MonitorSmartphone, to: "/produtos" },
  { label: "Mouse/Teclado", icon: Mouse, to: "/produtos" },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-center gap-2 h-14">

            {/* Hamburger */}
            <button
              className="p-2 -ml-1 text-white flex-shrink-0 touch-target"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight leading-tight">Feira da<br className="hidden xs:block" /> Madrugada SP</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 min-w-0 mx-1 sm:mx-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Busque o que deseja"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded py-2 pl-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border-0"
                />
                <button
                  className="absolute right-0 top-0 h-full px-3 rounded-r flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(45 100% 51%)' }}
                  aria-label="Buscar"
                >
                  <Search className="h-3.5 w-3.5" style={{ color: 'hsl(0 0% 10%)' }} />
                </button>
              </div>
            </div>

            {/* Cart icon */}
            <button className="relative p-2 text-white hover:bg-white/10 rounded transition-colors flex-shrink-0" aria-label="Carrinho">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'hsl(45 100% 51%)', color: 'hsl(0 0% 10%)' }}>0</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile category chips strip */}
      <div className="w-full bg-card border-b border-border lg:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 px-3 py-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop categories bar */}
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

      {/* Desktop category icons strip */}
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

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <nav
            className="absolute left-0 top-0 bottom-0 w-72 bg-card shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4 flex-shrink-0" style={{ backgroundColor: 'hsl(270 55% 38%)' }}>
              <span className="text-base font-bold text-white">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {[
                { to: "/", label: "Início" },
                { to: "/produtos", label: "Produtos" },
                { to: "/sobre", label: "Quem somos" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between py-3.5 border-b border-border text-base font-medium text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
              <div className="mt-5">
                <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Categorias</p>
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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
