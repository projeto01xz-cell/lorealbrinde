import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <span className="inline-block badge badge-primary">
              Novidades 2025
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              A tecnologia que você{" "}
              <span className="text-primary">ama</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Descubra os melhores smartphones, notebooks e acessórios 
              com os melhores preços e garantia de qualidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/produtos"
                className="btn-primary px-6 py-3 inline-flex items-center justify-center gap-2"
              >
                Ver Produtos
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/sobre"
                className="btn-secondary px-6 py-3 inline-flex items-center justify-center"
              >
                Sobre Nós
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">50k+</p>
                <p className="text-sm text-muted-foreground">Clientes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1000+</p>
                <p className="text-sm text-muted-foreground">Produtos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&h=600&fit=crop"
                alt="Smartphone"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] 
                          bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
