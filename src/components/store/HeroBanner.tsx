import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
      <div className="px-4 py-8">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            Mobilidade Elétrica
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-foreground leading-tight mb-3">
          O futuro da<br />
          mobilidade é <span className="text-primary">elétrico</span>
        </h1>

        {/* Description */}
        <p className="text-base text-muted-foreground mb-6 max-w-sm">
          E-bikes, scooters e peças com os melhores preços. 
          Frete grátis para todo Brasil.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/produtos"
            className="btn-primary inline-flex items-center justify-center gap-2 py-4 text-base"
          >
            Ver Produtos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-8 pt-6 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-foreground">10k+</p>
            <p className="text-sm text-muted-foreground">Clientes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">500+</p>
            <p className="text-sm text-muted-foreground">Produtos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">4.9</p>
            <p className="text-sm text-muted-foreground">Avaliação</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop"
          alt="E-bike elétrica"
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {/* Promo Badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-destructive text-destructive-foreground rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">OFERTA RELÂMPAGO</p>
              <p className="text-xs opacity-90">Até 40% OFF em e-bikes</p>
            </div>
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
}