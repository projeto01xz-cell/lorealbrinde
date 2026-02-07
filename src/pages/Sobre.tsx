import { Store, Users, Award, Headphones } from "lucide-react";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sobre a TechStore
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Somos apaixonados por tecnologia e comprometidos em oferecer 
              os melhores produtos com preços justos e atendimento excepcional.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">50k+</p>
                <p className="text-muted-foreground">Clientes Satisfeitos</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">1000+</p>
                <p className="text-muted-foreground">Produtos</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">5</p>
                <p className="text-muted-foreground">Anos de Mercado</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">4.9</p>
                <p className="text-muted-foreground">Avaliação Média</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Nossos Valores
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Trabalhamos apenas com marcas reconhecidas e produtos originais.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Transparência</h3>
                <p className="text-sm text-muted-foreground">
                  Preços justos e informações claras sobre todos os produtos.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Garantia</h3>
                <p className="text-sm text-muted-foreground">
                  Garantia estendida e suporte técnico em todos os produtos.
                </p>
              </div>

              <div className="text-center p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Suporte</h3>
                <p className="text-sm text-muted-foreground">
                  Atendimento humanizado e suporte pós-venda de qualidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Explore nossa coleção de produtos e encontre a tecnologia perfeita para você.
            </p>
            <a
              href="/produtos"
              className="inline-block bg-background text-foreground font-medium px-8 py-3 rounded-lg 
                       hover:bg-background/90 transition-colors"
            >
              Ver Produtos
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
