import { Phone, Facebook, Instagram, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-8" style={{ backgroundColor: 'hsl(270 55% 32%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <span className="text-xl font-extrabold text-white tracking-tight">JSvariedades</span>
            <p className="text-sm text-white/70 leading-relaxed mt-3">
              Sua loja de variedades com os melhores produtos e preços. Qualidade e confiança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-white/70 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/produtos" className="text-sm text-white/70 hover:text-white transition-colors">Produtos</Link></li>
              <li><Link to="/sobre" className="text-sm text-white/70 hover:text-white transition-colors">Quem somos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contato</h3>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 flex-shrink-0" />
                (11) 4850-7181
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 flex-shrink-0" />
                faleconosco@gtsm1.com.br
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Redes Sociais</h3>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} JSvariedades — Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-white/60">
            <Link to="#" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link to="#" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}