import { motion } from "framer-motion";
import { useMemo } from "react";

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const SparkleParticles = () => {
  const particles = useMemo(() => {
    const items: SparkleParticle[] = [];
    for (let i = 0; i < 40; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
      });
    }
    return items;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
            ease: "easeInOut",
          }}
        >
          {/* Star/sparkle shape */}
          <svg
            width={particle.size * 2}
            height={particle.size * 2}
            viewBox="0 0 24 24"
            fill="white"
            className="drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]"
          >
            <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" />
          </svg>
        </motion.div>
      ))}

      {/* Additional floating dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-white/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            y: [0, -30, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Larger sparkle accents */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`accent-${i}`}
          className="absolute"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: Math.random() * 2 + 3,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div 
            className="w-2 h-2 bg-white rounded-full"
            style={{
              boxShadow: '0 0 10px 3px rgba(255,255,255,0.5), 0 0 20px 6px rgba(200,150,255,0.3)'
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SparkleParticles;
