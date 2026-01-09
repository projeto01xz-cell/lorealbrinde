import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroBg from "@/assets/hero-bg.png";
import elseveProducts from "@/assets/elseve-products.png";
import SparkleParticles from "./SparkleParticles";

interface HeroProps {
  onStartQuiz: () => void;
}

const Hero = ({ onStartQuiz }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Product animations - appears and scales up as you scroll
  const productY = useTransform(scrollYProgress, [0, 0.4], [80, 0]);
  const productOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const productScale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);

  // Text animations - fade slightly as product appears
  const headlineY = useTransform(scrollYProgress, [0, 0.4], [0, -20]);
  
  // Badge animation
  const badgeOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [0.15, 0.3], [15, 0]);

  // Button animation
  const buttonOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.3, 0.45], [20, 0]);

  // Trust indicators
  const trustOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero section - mobile optimized height */}
      <section 
        className="relative min-h-[180svh]"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Fixed background overlay for mobile */}
        <div 
          className="fixed inset-0 -z-10"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Light glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40%] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-2xl pointer-events-none" />
        
        {/* Sparkle particles */}
        <SparkleParticles />
        
        {/* Sticky content container - mobile optimized */}
        <div className="sticky top-0 min-h-[100svh] flex flex-col items-center justify-center px-5 py-8 overflow-hidden">
          <div className="w-full max-w-sm mx-auto text-center space-y-4 relative z-10">
            
            {/* Initial headline - always visible */}
            <motion.div
              style={{ y: headlineY }}
              className="space-y-3"
            >
              <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-lg px-2">
                Participe do questionário
              </h1>
              <p className="text-white/80 text-base">
                Role para descobrir o prêmio
              </p>
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white/60 pt-2"
              >
                <ChevronDown className="w-7 h-7 mx-auto" />
              </motion.div>
            </motion.div>

            {/* Product - reveals on scroll */}
            <motion.div 
              style={{ 
                y: productY, 
                opacity: productOpacity,
                scale: productScale
              }}
              className="relative mx-auto w-full px-4 py-4"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-90" />
              
              {/* Product image */}
              <img 
                src={elseveProducts}
                alt="Kit Elseve Collagen Lifter"
                className="relative w-full h-auto object-contain drop-shadow-2xl"
              />
              
              {/* Shadow below product */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[65%] h-6"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)',
                  filter: 'blur(6px)',
                }}
              />
            </motion.div>

            {/* Badge - appears after product */}
            <motion.div 
              style={{ opacity: badgeOpacity, y: badgeY }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Vagas Limitadas
            </motion.div>

            {/* Subheadline */}
            <motion.p 
              style={{ opacity: badgeOpacity }}
              className="text-white/90 text-sm px-4 drop-shadow-sm leading-relaxed"
            >
              Tenha a chance de receber nosso mais novo lançamento
            </motion.p>

            {/* CTA Button - appears last */}
            <motion.div 
              style={{ opacity: buttonOpacity, y: buttonY }}
              className="pt-2 px-4"
            >
              <Button 
                onClick={onStartQuiz}
                size="lg"
                className="w-full bg-white text-[hsl(270_50%_35%)] hover:bg-white/95 shadow-xl font-semibold text-base h-14 rounded-xl"
              >
                Começar Questionário
                <ChevronDown className="w-5 h-5 ml-1" />
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              style={{ opacity: trustOpacity }}
              className="flex items-center justify-center gap-4 pt-3 text-xs text-white/75"
            >
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                100% Seguro
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Rápido e Fácil
              </span>
            </motion.div>
          </div>

          {/* Decorative star */}
          <div className="absolute bottom-4 right-4 opacity-30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
