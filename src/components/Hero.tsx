import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import productKit from "@/assets/product-kit.jpg";

interface HeroProps {
  onStartQuiz: () => void;
}

const Hero = ({ onStartQuiz }: HeroProps) => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)] -z-10" />
      
      {/* Decorative circles */}
      <div className="absolute top-10 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full bg-primary/10 blur-2xl -z-10" />
      
      <div className="w-full max-w-md mx-auto text-center space-y-6 animate-fade-up">
        {/* Product Image */}
        <div className="relative mx-auto w-full max-w-xs mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270_30%_60%/0.3)] to-transparent rounded-3xl blur-2xl" />
          <img 
            src={productKit}
            alt="Kit Elseve Collagen Lifter"
            className="relative w-full h-auto object-cover rounded-2xl shadow-xl"
          />
        </div>
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Vagas Limitadas
        </div>
        
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance">
          Participe do questionário e tenha a chance de receber nosso mais novo lançamento
        </h1>
        
        {/* Subheadline */}
        <p className="text-muted-foreground text-base">
          Leva menos de 1 minuto. Seleção por disponibilidade.
        </p>
        
        {/* CTA Button */}
        <Button 
          variant="hero" 
          size="xl"
          onClick={onStartQuiz}
          className="w-full sm:w-auto mt-4"
        >
          Começar Questionário
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </Button>
        
        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            100% Seguro
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Rápido e Fácil
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
