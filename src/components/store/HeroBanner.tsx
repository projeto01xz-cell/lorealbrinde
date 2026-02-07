import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Image with Overlay */}
      <div className="relative h-48">
        <img
          src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=400&fit=crop"
          alt="E-bike elétrica"
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
        
        {/* Content Over Image */}
        <div className="absolute inset-0 flex flex-col justify-center px-4">
          {/* Badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
              Mobilidade Elétrica
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black text-card leading-tight mb-2">
            O futuro é<br />
            <span className="text-primary">elétrico</span>
          </h1>

          {/* CTA */}
          <Link
            to="/produtos"
            className="btn-primary inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm w-fit"
          >
            Ver Produtos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Promo Banner */}
      <Link 
        to="/produtos" 
        className="block bg-destructive text-destructive-foreground px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">⚡ OFERTA RELÂMPAGO</p>
            <p className="text-xs opacity-90">Até 40% OFF em e-bikes selecionadas</p>
          </div>
          <ArrowRight className="h-5 w-5 flex-shrink-0" />
        </div>
      </Link>

      {/* Stats Row */}
      <div className="flex justify-around py-4 bg-card border-b border-border">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">10k+</p>
          <p className="text-[10px] text-muted-foreground uppercase">Clientes</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">500+</p>
          <p className="text-[10px] text-muted-foreground uppercase">Produtos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary">4.9★</p>
          <p className="text-[10px] text-muted-foreground uppercase">Avaliação</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">24h</p>
          <p className="text-[10px] text-muted-foreground uppercase">Envio</p>
        </div>
      </div>
    </section>
  );
}