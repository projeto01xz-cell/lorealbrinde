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
  const productY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const productOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const productScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  // Text animations - fade slightly as product appears
  const headlineY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);
  
  // Badge animation
  const badgeOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [0.2, 0.4], [20, 0]);

  // Button animation
  const buttonOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.4, 0.6], [30, 0]);

  // Trust indicators
  const trustOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero section - taller to allow scroll */}
      <section 
        className="relative min-h-[200vh] flex flex-col"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Light glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[50%] bg-gradient-to-b from-white/25 via-white/5 to-transparent blur-3xl pointer-events-none" />
        
        {/* Sparkle particles */}
        <SparkleParticles />
        
        {/* Sticky content container */}
        <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md mx-auto text-center space-y-6 relative z-10">
            
            {/* Initial headline - always visible */}
            <motion.div
              style={{ y: headlineY }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight text-balance drop-shadow-lg">
                Participe do questionário
              </h1>
              <p className="text-white/80 text-lg">
                Role para descobrir o prêmio
              </p>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white/60"
              >
                <ChevronDown className="w-8 h-8 mx-auto" />
              </motion.div>
            </motion.div>

            {/* Product - reveals on scroll */}
            <motion.div 
              style={{ 
                y: productY, 
                opacity: productOpacity,
                scale: productScale
              }}
              className="relative mx-auto w-full max-w-sm my-6"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-75" />
              
              {/* Product image */}
              <img 
                src={elseveProducts}
                alt="Kit Elseve Collagen Lifter"
                className="relative w-full h-auto object-contain drop-shadow-2xl"
              />
              
              {/* Shadow below product */}
              <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-8"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
            </motion.div>

            {/* Badge - appears after product */}
            <motion.div 
              style={{ opacity: badgeOpacity, y: badgeY }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/20"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Vagas Limitadas
            </motion.div>

            {/* Subheadline */}
            <motion.p 
              style={{ opacity: badgeOpacity }}
              className="text-white/90 text-base drop-shadow-sm"
            >
              Tenha a chance de receber nosso mais novo lançamento
            </motion.p>

            {/* CTA Button - appears last */}
            <motion.div style={{ opacity: buttonOpacity, y: buttonY }}>
              <Button 
                onClick={onStartQuiz}
                size="xl"
                className="w-full sm:w-auto mt-4 bg-white text-[hsl(270_50%_40%)] hover:bg-white/95 shadow-xl font-semibold text-base"
              >
                Começar Questionário
                <ChevronDown className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              style={{ opacity: trustOpacity }}
              className="flex items-center justify-center gap-4 pt-4 text-xs text-white/80"
            >
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
            </motion.div>
          </div>

          {/* Decorative star */}
          <div className="absolute bottom-6 right-6 opacity-40">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
