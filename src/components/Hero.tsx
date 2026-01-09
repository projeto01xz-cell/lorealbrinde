import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.png";
import elseveProducts from "@/assets/elseve-products.png";
import SparkleParticles from "./SparkleParticles";

interface HeroProps {
  onStartQuiz: () => void;
}

const Hero = ({ onStartQuiz }: HeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Lock scroll when animation is complete
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest >= 0.95 && !isComplete) {
        setIsComplete(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, isComplete]);

  // Hide scroll indicator when complete
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Product animations - appears as you scroll
  const productY = useTransform(scrollYProgress, [0.1, 0.5], [100, 0]);
  const productOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const productScale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1]);

  // Badge animation
  const badgeOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [0.4, 0.6], [20, 0]);

  // Button animation
  const buttonOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.6, 0.8], [20, 0]);

  // Trust indicators
  const trustOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[200svh]">
      {/* Fixed hero that stays in place */}
      <section 
        className="fixed inset-0 h-[100svh]" 
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      >
        {/* Light glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40%] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-2xl pointer-events-none" />
        
        {/* Sparkle particles */}
        <SparkleParticles />
        
        {/* Content container */}
        <div className="h-full flex flex-col items-center justify-center px-5 pt-16 overflow-hidden">
          <div className="w-full max-w-sm mx-auto text-center space-y-3 relative z-10">
            
            {/* Initial headline - always visible */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-lg px-2">
                Descubra novo Brinde da L´oreal Paris.
              </h1>
              <p className="text-white/80 text-base">Role para descobrir o Brinde</p>
              <motion.div 
                style={{ opacity: scrollIndicatorOpacity }}
                animate={{ y: [0, 8, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity }} 
                className="text-white/60 pt-2"
              >
                <ChevronDown className="w-7 h-7 mx-auto" />
              </motion.div>
            </div>

            {/* Product - reveals on scroll with floating effect */}
            <motion.div 
              style={{
                y: productY,
                opacity: productOpacity,
                scale: productScale
              }} 
              className="relative mx-auto w-full px-4 py-2"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-90" />
              
              {/* Product image with floating animation */}
              <motion.img 
                src={elseveProducts} 
                alt="Kit Elseve Collagen Lifter" 
                className="relative w-full h-auto object-contain drop-shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Shadow below product */}
              <motion.div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[65%] h-6"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)',
                  filter: 'blur(6px)'
                }}
                animate={{ scale: [1, 0.9, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Confetti celebration text */}
            <motion.div 
              style={{ opacity: badgeOpacity, y: badgeY }} 
              className="relative"
            >
              {/* Confetti particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-sm"
                  style={{
                    background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#F472B6', '#34D399'][i % 6],
                    left: `${10 + (i * 7)}%`,
                    top: '-10px',
                  }}
                  animate={{
                    y: [0, 30, 60],
                    x: [0, (i % 2 === 0 ? 10 : -10), (i % 2 === 0 ? -5 : 5)],
                    rotate: [0, 180, 360],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut"
                  }}
                />
              ))}
              <p className="text-white font-semibold text-lg drop-shadow-lg">
                🎉 Vamos distribuir o brinde hoje! 🎉
              </p>
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
                Receber o meu brinde
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