import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import elseveProducts from "@/assets/elseve-products.png";

interface HeroProps {
  onStartQuiz: () => void;
}

const Hero = ({ onStartQuiz }: HeroProps) => {
  return (
    <section 
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, hsl(280 60% 55%) 0%, hsl(270 50% 50%) 50%, hsl(275 45% 45%) 100%)'
      }}
    >
      {/* Light glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] bg-gradient-to-b from-white/30 via-white/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md mx-auto text-center space-y-6 animate-fade-up relative z-10">
        {/* Product Image */}
        <div className="relative mx-auto w-full max-w-sm mb-4">
          <img 
            src={elseveProducts}
            alt="Kit Elseve Collagen Lifter"
            className="relative w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Vagas Limitadas
        </div>
        
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight text-balance drop-shadow-lg">
          Participe do questionário e tenha a chance de receber nosso mais novo lançamento
        </h1>
        
        {/* Subheadline */}
        <p className="text-white/90 text-base drop-shadow-sm">
          Leva menos de 1 minuto. Seleção por disponibilidade.
        </p>
        
        {/* CTA Button */}
        <Button 
          onClick={onStartQuiz}
          size="xl"
          className="w-full sm:w-auto mt-4 bg-white text-[hsl(270_50%_40%)] hover:bg-white/95 shadow-xl font-semibold"
        >
          Começar Questionário
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </Button>
        
        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 pt-4 text-xs text-white/80">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            100% Seguro
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Rápido e Fácil
          </span>
        </div>
      </div>
      
      {/* Decorative star */}
      <div className="absolute bottom-6 right-6 opacity-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
