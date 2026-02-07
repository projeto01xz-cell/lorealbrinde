import { Zap, Users, Award, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Sobre a GTSM1
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Somos especialistas em mobilidade elétrica, comprometidos em oferecer 
              as melhores e-bikes, scooters e acessórios do mercado.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-card border-y border-border">
          <div className="px-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">10k+</p>
                <p className="text-sm text-muted-foreground">Clientes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">500+</p>
                <p className="text-sm text-muted-foreground">Produtos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">3</p>
                <p className="text-sm text-muted-foreground">Anos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">4.9</p>
                <p className="text-sm text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-8 px-4">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">
            Nossos Valores
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Trabalhamos apenas com marcas reconhecidas e produtos certificados.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Transparência</h3>
                <p className="text-sm text-muted-foreground">
                  Preços justos e informações claras sobre todos os produtos.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Garantia</h3>
                <p className="text-sm text-muted-foreground">
                  Garantia estendida e suporte técnico em todos os produtos.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Suporte</h3>
                <p className="text-sm text-muted-foreground">
                  Atendimento humanizado e suporte pós-venda de qualidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 px-4 bg-primary">
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary-foreground mb-3">
              Pronto para pedalar?
            </h2>
            <p className="text-sm text-primary-foreground/80 mb-6">
              Explore nossa coleção de e-bikes e scooters.
            </p>
            <Link
              to="/produtos"
              className="inline-block bg-card text-foreground font-semibold px-8 py-3 rounded-lg"
            >
              Ver Produtos
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}